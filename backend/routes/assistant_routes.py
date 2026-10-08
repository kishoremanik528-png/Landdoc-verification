from flask import Blueprint, request, jsonify
from models.application import Application
from models.verification_result import VerificationResult
from ai_modules.voice_assistant import VoiceAssistantAI
from ai_modules.document_simplifier import DocumentSimplifierAI

assistant_bp = Blueprint('assistant_routes', __name__)
voice_assistant = VoiceAssistantAI()
doc_simplifier = DocumentSimplifierAI()

@assistant_bp.route('/api/assistant/chat', methods=['POST'])
def assistant_chat():
    data = request.get_json() or {}
    message = data.get('message', '')
    app_id_str = data.get('application_id')

    context = None
    if app_id_str:
        app = Application.query.filter_by(application_id=app_id_str).first()
        if app:
            vr_list = [v.to_dict() for v in VerificationResult.query.filter_by(application_id=app.id).all()]
            mismatches = [v for v in vr_list if v.get('verification_status') == 'MISMATCH']
            context = {
                "application_id": app.application_id,
                "status": app.status,
                "risk_score": app.risk_score,
                "risk_level": app.risk_level,
                "mismatches": mismatches
            }

    res = voice_assistant.answer_query(message, app_context=context)
    return jsonify({"success": True, "response": res}), 200

@assistant_bp.route('/api/assistant/context', methods=['POST'])
def assistant_context_help():
    data = request.get_json() or {}
    app_id_str = data.get('application_id')
    
    if not app_id_str:
        return jsonify({"success": False, "message": "Application ID required"}), 400

    app = Application.query.filter_by(application_id=app_id_str).first()
    if not app:
        return jsonify({"success": False, "message": "Application not found"}), 404

    vr_list = [v.to_dict() for v in VerificationResult.query.filter_by(application_id=app.id).all()]
    mismatches = [v for v in vr_list if v.get('verification_status') == 'MISMATCH']

    summary_msg = f"Application {app.application_id} is evaluated as {app.risk_level} Risk ({app.risk_score}/100)."
    if mismatches:
        summary_msg += f" Discrepancies found in {len(mismatches)} fields."

    return jsonify({
        "success": True,
        "context_summary": summary_msg,
        "risk_level": app.risk_level,
        "mismatches_count": len(mismatches)
    }), 200

@assistant_bp.route('/api/assistant/simplify', methods=['POST'])
def simplify_text():
    data = request.get_json() or {}
    raw_text = data.get('text', '')
    term = data.get('term')
    
    res = doc_simplifier.simplify(raw_text, term=term)
    return jsonify({"success": True, "data": res}), 200
