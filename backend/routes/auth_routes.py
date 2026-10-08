from flask import Blueprint, request, jsonify
from database.database import db
from models.officer import Officer

auth_bp = Blueprint('auth_routes', __name__)

@auth_bp.route('/api/auth/applicant/register', methods=['POST'])
def register_applicant():
    data = request.get_json() or {}
    name = data.get('name', 'Applicant')
    email = data.get('email', '')
    phone = data.get('phone_number', '')

    return jsonify({
        "success": True,
        "message": "Applicant registration successful.",
        "applicant": {
            "name": name,
            "email": email,
            "phone_number": phone
        }
    }), 201

@auth_bp.route('/api/auth/applicant/login', methods=['POST'])
def login_applicant():
    data = request.get_json() or {}
    email = data.get('email', '')
    name = data.get('name', 'Applicant')

    return jsonify({
        "success": True,
        "applicant": {
            "name": name if name else "Kishore Kumar",
            "email": email if email else "applicant@example.com",
            "phone_number": data.get('phone_number', '9876543210')
        }
    }), 200

@auth_bp.route('/api/auth/officer/login', methods=['POST'])
def login_officer():
    data = request.get_json() or {}
    officer_name = data.get('officer_name', 'Kishore Manik')
    officer_id = data.get('officer_id', 'OFF-TN-9081')
    district = data.get('district', 'Trichy')
    taluk = data.get('taluk', 'Trichy')

    # Register or fetch officer from DB
    officer = Officer.query.filter_by(officer_id=officer_id).first()
    if not officer:
        officer = Officer(
            officer_id=officer_id,
            name=officer_name,
            email=f"{officer_name.lower().replace(' ', '.')}@tn.gov.in",
            password_hash="hashed_demo_pw",
            designation="Verification Officer",
            department="Revenue & Disaster Management Dept",
            role="VERIFICATION_OFFICER",
            district=district,
            taluk=taluk
        )
        db.session.add(officer)
        db.session.commit()
    else:
        # Update assigned location if provided
        if district: officer.district = district
        if taluk: officer.taluk = taluk
        db.session.commit()

    return jsonify({
        "success": True,
        "officer": officer.to_dict()
    }), 200
