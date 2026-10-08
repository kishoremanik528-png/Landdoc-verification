import uuid
from flask import Blueprint, jsonify
from database.database import db
from models.application import Application
from models.document import Document
from services.orchestrator import AIOrchestrator
from utils.demo_data import DEMO_SCENARIOS

demo_bp = Blueprint('demo_routes', __name__)
orchestrator = AIOrchestrator()

@demo_bp.route('/api/demo/scenarios', methods=['GET'])
def list_demo_scenarios():
    scenarios = []
    for s_key, s_data in DEMO_SCENARIOS.items():
        scenarios.append({
            "scenario_key": s_key,
            "title": s_data["title"],
            "description": s_data["description"],
            "expected_risk": s_data["expected_risk"],
            "applicant": s_data["applicant"],
            "document_count": len(s_data["documents"])
        })
    return jsonify({"success": True, "scenarios": scenarios}), 200

@demo_bp.route('/api/demo/scenarios/<scenario_key>/run', methods=['POST'])
def run_demo_scenario(scenario_key):
    s_data = DEMO_SCENARIOS.get(scenario_key)
    if not s_data:
        return jsonify({"success": False, "message": "Invalid scenario key"}), 400

    unique_app_id = f"APP-2026-{uuid.uuid4().hex[:6].upper()}"
    app = Application(
        application_id=unique_app_id,
        applicant_name=s_data['applicant'],
        status='PROCESSING',
        processing_status='IN_PROGRESS'
    )
    db.session.add(app)
    db.session.commit()

    # Seed Document Metadata records
    for d in s_data['documents']:
        doc = Document(
            document_id=f"DOC-{uuid.uuid4().hex[:6].upper()}",
            application_id=app.id,
            document_type=d['type'],
            original_file_name=d['filename'],
            file_path=f"uploads/{d['filename']}",
            file_type="pdf",
            file_size=12500,
            processing_status='COMPLETED',
            ocr_status='COMPLETED',
            extraction_confidence=0.95
        )
        db.session.add(doc)
    db.session.commit()

    # Run AI Orchestrator
    orchestrator.process_application(app.application_id)

    return jsonify({
        "success": True,
        "application_id": app.application_id,
        "scenario_key": scenario_key,
        "title": s_data["title"],
        "risk_score": app.risk_score,
        "risk_level": app.risk_level,
        "status": app.status
    }), 201

@demo_bp.route('/api/demo/seed', methods=['POST'])
def seed_all_scenarios():
    created = []
    for s_key in DEMO_SCENARIOS.keys():
        s_data = DEMO_SCENARIOS[s_key]
        app_id = f"APP-DEMO-{s_key.split('_')[1].upper()}"
        existing = Application.query.filter_by(application_id=app_id).first()
        if not existing:
            app = Application(
                application_id=app_id,
                applicant_name=s_data['applicant'],
                status='PROCESSING'
            )
            db.session.add(app)
            db.session.commit()
            
            for d in s_data['documents']:
                doc = Document(
                    document_id=f"DOC-SEED-{uuid.uuid4().hex[:4].upper()}",
                    application_id=app.id,
                    document_type=d['type'],
                    original_file_name=d['filename'],
                    file_path=f"uploads/{d['filename']}",
                    file_type="pdf",
                    file_size=12500,
                    processing_status='COMPLETED',
                    ocr_status='COMPLETED',
                    extraction_confidence=0.95
                )
                db.session.add(doc)
            db.session.commit()

            orchestrator.process_application(app.application_id)
            created.append(app.application_id)
        else:
            created.append(existing.application_id)

    return jsonify({"success": True, "seeded_applications": created}), 200
