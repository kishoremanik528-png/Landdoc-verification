# pyrefly: ignore [missing-import]
from flask import Blueprint, request, jsonify
from database.database import db
from models.application import Application
from models.review import Review
from services.sms_service import (
    send_application_status_notification,
    send_sms,
    normalize_phone_number,
    reload_config
)

review_bp = Blueprint('review_routes', __name__)

@review_bp.route('/api/applications/<application_id>/review', methods=['POST'])
def submit_officer_review(application_id):
    app = Application.query.filter_by(application_id=application_id).first()
    if not app:
        return jsonify({"success": False, "message": "Application not found"}), 404

    data = request.get_json() or {}
    officer_name = data.get('officer_name', 'Revenue Officer')
    officer_id = data.get('officer_id', 'OFF-9901')
    decision = data.get('decision', 'APPROVED')
    comments = data.get('comments', '')
    findings_accepted = data.get('findings_accepted', True)
    findings_overridden = data.get('findings_overridden', False)

    review = Review(
        application_id=app.id,
        officer_name=officer_name,
        officer_id=officer_id,
        decision=decision,
        comments=comments,
        findings_accepted=findings_accepted,
        findings_overridden=findings_overridden
    )
    db.session.add(review)

    # Update Application Status
    decision_upper = str(decision).upper()
    if decision_upper in ('APPROVED', 'ACCEPT'):
        app.status = 'APPROVED'
    elif decision_upper in ('REJECTED', 'REJECT'):
        app.status = 'REJECTED'
    elif decision_upper in ('REQUEST_CHANGES', 'CHANGES_REQUESTED', 'ADDITIONAL_INFO_REQUESTED'):
        app.status = 'CHANGES_REQUESTED'
    else:
        app.status = 'REVIEW_REQUIRED'

    db.session.commit()

    # --- SMS Notification via Twilio (after successful DB commit) ---
    notification_result = {
        'notification_sent': False,
        'request_accepted': False,
        'notification_error': None,
        'sms_sid': None,
        'message': None,
        'provider': 'twilio'
    }
    try:
        notification_result = send_application_status_notification(
            application=app,
            status=app.status,
            reason=comments
        )
    except Exception as exc:
        notification_result['notification_error'] = f'SMS service execution error: {exc}'

    response = {
        "success": True,
        "review": review.to_dict(),
        "application_status": app.status,
        "application_status_updated": True,
        "notification_sent": notification_result.get('notification_sent', False),
        "request_accepted": notification_result.get('request_accepted', False),
        "sms_sid": notification_result.get('sms_sid'),
        "sms_message": notification_result.get('message'),
        "provider": "twilio"
    }

    if notification_result.get('notification_error'):
        response['notification_error'] = notification_result['notification_error']

    return jsonify(response), 201


@review_bp.route('/api/applications/<application_id>/review', methods=['GET'])
def get_officer_reviews(application_id):
    app = Application.query.filter_by(application_id=application_id).first()
    if not app:
        return jsonify({"success": False, "message": "Application not found"}), 404

    reviews = [r.to_dict() for r in Review.query.filter_by(application_id=app.id).order_by(Review.review_date.desc()).all()]
    return jsonify({"success": True, "reviews": reviews}), 200


@review_bp.route('/api/test-sms', methods=['POST'])
def test_sms_endpoint():
    """Development test endpoint to test Twilio SMS API directly."""
    data = request.get_json() or {}
    raw_phone = data.get('phone_number', '9876543210')
    message = data.get('message', 'LANDGUARD AI: Test SMS notification from backend.')

    normalized = normalize_phone_number(raw_phone)
    if not normalized:
        return jsonify({
            "success": False,
            "message": "Test SMS failed",
            "error": f"Invalid phone number format: '{raw_phone}'. Provide 10-digit Indian number.",
            "provider": "twilio"
        }), 400

    config = reload_config()
    sms_res = send_sms(normalized, message, application_id="TEST-REF")

    if sms_res["success"]:
        return jsonify({
            "success": True,
            "message": sms_res.get("message") or "Test SMS request submitted successfully",
            "sms_sid": sms_res.get("sms_sid"),
            "provider": "twilio",
            "config_status": {
                "account_sid_configured": config["account_sid_configured"],
                "auth_token_configured": config["auth_token_configured"],
                "phone_number_configured": config["phone_number_configured"],
                "demo_mode": config["demo_mode"]
            }
        }), 200

    return jsonify({
        "success": False,
        "message": "Test SMS failed",
        "error": sms_res.get("error") or "Twilio SMS dispatch failed",
        "provider": "twilio",
        "config_status": {
            "account_sid_configured": config["account_sid_configured"],
            "auth_token_configured": config["auth_token_configured"],
            "phone_number_configured": config["phone_number_configured"],
            "demo_mode": config["demo_mode"]
        }
    }), 200
