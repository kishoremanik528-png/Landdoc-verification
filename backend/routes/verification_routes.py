from flask import Blueprint, jsonify
from models.application import Application
from models.verification_result import VerificationResult
from models.risk_analysis import RiskAnalysis
from models.module_result import ModuleResult
from models.ownership_record import OwnershipRecord
from services.orchestrator import AIOrchestrator
from services.summary_service import SummaryService

verification_bp = Blueprint('verification_routes', __name__)
orchestrator = AIOrchestrator()
summary_service = SummaryService()

@verification_bp.route('/api/applications/<application_id>/process', methods=['POST'])
def trigger_processing(application_id):
    res = orchestrator.process_application(application_id)
    if res.get('status') == 'ERROR':
        return jsonify({"success": False, "message": res.get('message')}), 400
    return jsonify({"success": True, "data": res}), 200

@verification_bp.route('/api/applications/<application_id>/results', methods=['GET'])
def get_verification_results(application_id):
    app = Application.query.filter_by(application_id=application_id).first()
    if not app:
        return jsonify({"success": False, "message": "Application not found"}), 404

    vr_list = [v.to_dict() for v in VerificationResult.query.filter_by(application_id=app.id).all()]
    ra = RiskAnalysis.query.filter_by(application_id=app.id).first()
    m_results = [m.to_dict() for m in ModuleResult.query.filter_by(application_id=app.id).all()]
    chain_records = [c.to_dict() for c in OwnershipRecord.query.filter_by(application_id=app.id).all()]

    m_map = {m['module_name']: m['metadata'] for m in m_results}

    return jsonify({
        "success": True,
        "application_id": app.application_id,
        "applicant_name": app.applicant_name,
        "phone_number": app.phone_number,
        "status": app.status,
        "risk_score": app.risk_score,
        "risk_level": app.risk_level,
        "verification_matrix": vr_list,
        "risk_analysis": ra.to_dict() if ra else None,
        "ownership_chain": chain_records,
        "relationship_graph": m_map.get('relationship_graph', {}).get('graph', {}),
        "gis_validation": m_map.get('gis_validation', {}),
        "duplicate_result": m_map.get('duplicate_detection', {}),
        "tampering_result": m_map.get('tampering_detection', {}),
        "suspicious_pattern": m_map.get('suspicious_pattern', {})
    }), 200

@verification_bp.route('/api/applications/<application_id>/summary', methods=['GET'])
def get_application_summary(application_id):
    app = Application.query.filter_by(application_id=application_id).first()
    if not app:
        return jsonify({"success": False, "message": "Application not found"}), 404

    summary_data = summary_service.build_case_summary(app.id)
    return jsonify({"success": True, "summary": summary_data}), 200
