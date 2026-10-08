"""
SMS Notification Service for LANDGUARD AI using Twilio SDK.

Required environment variables:
    TWILIO_ACCOUNT_SID
    TWILIO_AUTH_TOKEN
    TWILIO_PHONE_NUMBER
    SMS_DEMO_MODE=false
"""

import logging
import os
import re
from pathlib import Path
from dotenv import load_dotenv

try:
    from twilio.rest import Client
    from twilio.base.exceptions import TwilioRestException
    TWILIO_SDK_AVAILABLE = True
except ImportError:
    TWILIO_SDK_AVAILABLE = False
    Client = None
    TwilioRestException = Exception

BACKEND_DIR = Path(__file__).resolve().parents[1]

logger = logging.getLogger(__name__)

STATUS_LABELS = {
    "APPROVED": "Approved",
    "REJECTED": "Rejected",
    "CHANGES_REQUESTED": "Changes Requested",
    "REVIEW_REQUIRED": "Changes Requested",
}

SMS_TRIGGER_STATUSES = set(STATUS_LABELS.keys())


def reload_config():
    """Dynamically load and parse environment variables without exposing credentials."""
    env_file = BACKEND_DIR / ".env"
    if env_file.exists():
        load_dotenv(env_file, override=True)
    else:
        load_dotenv(override=True)

    account_sid = os.getenv("TWILIO_ACCOUNT_SID", "").strip()
    auth_token = os.getenv("TWILIO_AUTH_TOKEN", "").strip()
    phone_number = os.getenv("TWILIO_PHONE_NUMBER", "").strip()
    demo_mode_raw = os.getenv("SMS_DEMO_MODE", "false").strip().lower()
    demo_mode = demo_mode_raw in ("true", "1", "yes")

    account_sid_valid = bool(account_sid) and account_sid != "your_account_sid"
    auth_token_valid = bool(auth_token) and auth_token != "your_auth_token"
    phone_number_valid = bool(phone_number) and phone_number != "your_twilio_phone_number"

    return {
        "account_sid": account_sid if account_sid_valid else "",
        "auth_token": auth_token if auth_token_valid else "",
        "phone_number": phone_number if phone_number_valid else "",
        "account_sid_configured": account_sid_valid,
        "auth_token_configured": auth_token_valid,
        "phone_number_configured": phone_number_valid,
        "demo_mode": demo_mode,
    }


def normalize_phone_number(phone):
    """
    Normalize Indian phone numbers to E.164 format (+91XXXXXXXXXX).
    Examples:
        9876543210      -> +919876543210
        +919876543210   -> +919876543210
        919876543210    -> +919876543210
        09876543210     -> +919876543210
        +91919876543210 -> +919876543210
    """
    if not phone:
        return None

    raw_str = str(phone).strip()
    digits = re.sub(r"\D", "", raw_str)

    # Handle duplicate country code e.g. 91919876543210 -> 919876543210
    if len(digits) == 14 and digits.startswith("9191"):
        digits = digits[2:]

    # Handle leading zero 09876543210 -> 9876543210
    if len(digits) == 11 and digits.startswith("0"):
        digits = digits[1:]

    # 10-digit Indian mobile number starting with 6,7,8,9
    if len(digits) == 10 and digits[0] in "6789":
        return f"+91{digits}"

    # 12-digit Indian mobile number starting with 91 followed by 6,7,8,9
    if len(digits) == 12 and digits.startswith("91") and digits[2] in "6789":
        return f"+{digits}"

    # Generic E.164 format if original started with + and has 10 to 15 digits
    if raw_str.startswith("+") and 10 <= len(digits) <= 15:
        return f"+{digits}"

    return None


def mask_phone_number(phone):
    """Mask phone number for safe debug logging (e.g., +9198XXXXXX10)."""
    if not phone:
        return "****"
    cleaned = str(phone).strip()
    if cleaned.startswith("+91") and len(cleaned) == 13:
        return f"+91{cleaned[3:5]}XXXXXX{cleaned[11:]}"
    if len(cleaned) > 4:
        return cleaned[:3] + "X" * (len(cleaned) - 5) + cleaned[-2:]
    return "****"


def build_status_message(application_id, status, reason=None):
    """Build exact message text for application status update notifications."""
    app_id_str = str(application_id or "N/A")
    status_upper = str(status or "").upper()
    reason_str = str(reason).strip() if reason else "N/A"

    if status_upper == "APPROVED":
        return (
            "LANDGUARD AI\n\n"
            "Your land document verification application has been APPROVED.\n\n"
            f"Application ID: {app_id_str}\n\n"
            "You can now login to the LANDGUARD AI portal and download your verified application document."
        )

    if status_upper == "REJECTED":
        return (
            "LANDGUARD AI\n\n"
            "Your land document verification application has been REJECTED.\n\n"
            f"Application ID: {app_id_str}\n\n"
            "Reason:\n"
            f"{reason_str}\n\n"
            "Please contact the relevant office or review the application details for further information."
        )

    if status_upper in ("CHANGES_REQUESTED", "REVIEW_REQUIRED", "REQUEST_CHANGES"):
        return (
            "LANDGUARD AI\n\n"
            "Your application requires additional changes.\n\n"
            f"Application ID: {app_id_str}\n\n"
            "Officer Comments:\n"
            f"{reason_str}\n\n"
            "Please login to LANDGUARD AI and update the required information."
        )

    return (
        "LANDGUARD AI\n\n"
        f"Your land document verification application (ID: {app_id_str}) status has been updated to {status_upper}."
    )


def send_sms(phone_number, message, application_id=None):
    """
    Send SMS using Twilio Python SDK.

    Returns structured dictionary:
        Success:
            {
                "success": True,
                "message": "SMS request accepted by Twilio",
                "sms_sid": "SM...",
                "status": "queued",
                "provider": "twilio"
            }
        Failure:
            {
                "success": False,
                "message": "SMS sending failed",
                "error": "safe error message",
                "provider": "twilio"
            }
    """
    config = reload_config()
    normalized_phone = normalize_phone_number(phone_number)
    masked_phone = mask_phone_number(normalized_phone or phone_number)

    logger.info(
        "[SMS DEBUG]\n"
        "  TWILIO_ACCOUNT_SID configured: %s\n"
        "  TWILIO_AUTH_TOKEN configured: %s\n"
        "  TWILIO_PHONE_NUMBER configured: %s\n"
        "  Application ID: %s\n"
        "  Phone number exists: %s\n"
        "  Masked phone number: %s\n"
        "  Twilio request attempted: %s\n"
        "  Demo Mode: %s",
        config["account_sid_configured"],
        config["auth_token_configured"],
        config["phone_number_configured"],
        application_id or "N/A",
        bool(phone_number),
        masked_phone,
        not config["demo_mode"] and config["account_sid_configured"],
        config["demo_mode"]
    )

    if not normalized_phone:
        error_msg = f"Invalid phone number format: '{phone_number}'. Must be a valid 10-digit Indian number."
        logger.warning("[SMS ERROR] AppID: %s - %s", application_id, error_msg)
        return {
            "success": False,
            "message": "SMS sending failed",
            "error": error_msg,
            "provider": "twilio"
        }

    if config["demo_mode"]:
        logger.info("[SMS DEMO MODE] Simulated Twilio SMS to %s", masked_phone)
        return {
            "success": True,
            "message": "SMS request accepted by Twilio (DEMO MODE)",
            "sms_sid": "SM_DEMO_SIMULATED",
            "status": "simulated",
            "provider": "twilio"
        }

    if not config["account_sid_configured"]:
        return {
            "success": False,
            "message": "SMS sending failed",
            "error": "TWILIO_ACCOUNT_SID is not configured in .env",
            "provider": "twilio"
        }

    if not config["auth_token_configured"]:
        return {
            "success": False,
            "message": "SMS sending failed",
            "error": "TWILIO_AUTH_TOKEN is not configured in .env",
            "provider": "twilio"
        }

    if not config["phone_number_configured"]:
        return {
            "success": False,
            "message": "SMS sending failed",
            "error": "TWILIO_PHONE_NUMBER is not configured in .env",
            "provider": "twilio"
        }

    if not TWILIO_SDK_AVAILABLE:
        return {
            "success": False,
            "message": "SMS sending failed",
            "error": "Twilio Python SDK is not installed in server environment",
            "provider": "twilio"
        }

    try:
        client = Client(config["account_sid"], config["auth_token"])
        twilio_message = client.messages.create(
            body=message,
            from_=config["phone_number"],
            to=normalized_phone
        )

        logger.info(
            "[SMS DEBUG] Twilio request succeeded. Message SID: %s, Status: %s",
            twilio_message.sid, twilio_message.status
        )

        return {
            "success": True,
            "message": "SMS request accepted by Twilio",
            "sms_sid": twilio_message.sid,
            "status": twilio_message.status,
            "provider": "twilio"
        }

    except TwilioRestException as exc:
        safe_error = f"Twilio API Error [{exc.code}]: {exc.msg}"
        logger.error("[SMS ERROR] TwilioRestException for %s: %s", masked_phone, safe_error)
        return {
            "success": False,
            "message": "SMS sending failed",
            "error": safe_error,
            "provider": "twilio"
        }
    except Exception as exc:
        safe_error = f"Twilio request failed: {type(exc).__name__}: {str(exc)}"
        logger.error("[SMS ERROR] Unexpected exception for %s: %s", masked_phone, safe_error)
        return {
            "success": False,
            "message": "SMS sending failed",
            "error": safe_error,
            "provider": "twilio"
        }


def send_application_status_notification(application, status, reason=None):
    """
    Send an SMS notification after an officer updates application status.

    Returns structured dict for API routes.
    """
    status_upper = str(status or "").upper()

    if status_upper in ("APPROVED", "ACCEPT"):
        status_key = "APPROVED"
    elif status_upper in ("REJECTED", "REJECT"):
        status_key = "REJECTED"
    elif status_upper in ("CHANGES_REQUESTED", "REQUEST_CHANGES", "REVIEW_REQUIRED", "ADDITIONAL_INFO_REQUESTED"):
        status_key = "CHANGES_REQUESTED"
    else:
        status_key = status_upper

    if status_key not in SMS_TRIGGER_STATUSES:
        return {
            "success": False,
            "notification_sent": False,
            "request_accepted": False,
            "notification_error": f"Status '{status_upper}' does not trigger SMS",
            "provider": "twilio"
        }

    raw_phone = getattr(application, "phone_number", None)
    app_id = getattr(application, "application_id", getattr(application, "id", "N/A"))

    if not raw_phone:
        logger.warning("[SMS SKIPPED] Missing phone number for app %s", app_id)
        return {
            "success": False,
            "notification_sent": False,
            "request_accepted": False,
            "notification_error": "Applicant phone number is missing in database application record",
            "provider": "twilio"
        }

    message = build_status_message(app_id, status_key, reason)
    sms_res = send_sms(raw_phone, message, application_id=app_id)

    return {
        "success": sms_res["success"],
        "notification_sent": sms_res["success"],
        "request_accepted": sms_res["success"],
        "sms_sid": sms_res.get("sms_sid"),
        "status": sms_res.get("status"),
        "message": sms_res["message"],
        "notification_error": sms_res.get("error"),
        "provider": "twilio"
    }
