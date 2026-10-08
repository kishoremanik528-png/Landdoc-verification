import re
import uuid
# pyrefly: ignore [missing-import]
from flask import Blueprint, request, jsonify
from database.database import db
from models.application import Application
from models.document import Document

app_bp = Blueprint('application_routes', __name__)

@app_bp.route('/api/applications', methods=['POST'])
def create_application():
    data = request.get_json() or {}
    applicant_name = data.get('applicant_name', 'Applicant')
    guardian_name = data.get('guardian_name', None)
    phone_number = data.get('phone_number', None)
    district = data.get('district', 'Trichy')
    taluk = data.get('taluk', 'Trichy')
    village = data.get('village', 'Kallakudi')
    survey_number = data.get('survey_number', None)
    subdivision_number = data.get('subdivision_number', None)
    extent = data.get('extent', None)
    property_type = data.get('property_type', 'Agricultural')

    # Validate and clean phone number
    if phone_number:
        phone_number = re.sub(r'\s+', '', str(phone_number).strip())
        if not re.match(r'^(\+91|91)?[6-9]\d{9}$', phone_number):
            return jsonify({
                "success": False,
                "message": "Please provide a valid Indian mobile number."
            }), 400
    
    unique_app_id = f"APP-{uuid.uuid4().hex[:8].upper()}"
    app = Application(
        application_id=unique_app_id,
        applicant_name=applicant_name,
        guardian_name=guardian_name,
        phone_number=phone_number,
        district=district,
        taluk=taluk,
        village=village,
        survey_number=survey_number,
        subdivision_number=subdivision_number,
        extent=extent,
        property_type=property_type,
        status='PENDING',
        processing_status='NOT_STARTED'
    )
    db.session.add(app)
    db.session.commit()

    return jsonify({"success": True, "application": app.to_dict()}), 201

@app_bp.route('/api/applications', methods=['GET'])
def get_applications_history():
    district = request.args.get('district')
    taluk = request.args.get('taluk')
    
    query = Application.query
    if district and district.lower() != 'all':
        query = query.filter(Application.district.ilike(f"%{district}%"))
    if taluk and taluk.lower() != 'all':
        query = query.filter(Application.taluk.ilike(f"%{taluk}%"))
        
    apps = query.order_by(Application.created_at.desc()).all()
    return jsonify({"success": True, "applications": [a.to_dict() for a in apps]}), 200

@app_bp.route('/api/applications/<application_id>', methods=['GET'])
def get_application_details(application_id):
    app = Application.query.filter_by(application_id=application_id).first()
    if not app:
        return jsonify({"success": False, "message": "Application not found"}), 404

    app_dict = app.to_dict()
    docs = [d.to_dict() for d in Document.query.filter_by(application_id=app.id).all()]
    app_dict['documents'] = docs

    return jsonify({"success": True, "application": app_dict}), 200
