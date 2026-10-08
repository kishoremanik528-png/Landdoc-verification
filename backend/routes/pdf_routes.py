import os
from flask import Blueprint, jsonify, send_file
from services.pdf_service import PDFService

from models.application import Application

pdf_bp = Blueprint('pdf_bp', __name__)
pdf_service = PDFService()

@pdf_bp.route('/api/applications/<application_id>/generate-document', methods=['POST'])
def generate_pdf_document(application_id):
    app = Application.query.filter_by(application_id=application_id).first()
    if not app:
        return jsonify({"success": False, "message": "Application not found"}), 404
    if app.status != 'APPROVED':
        return jsonify({"success": False, "message": "PDF generation is only allowed for APPROVED applications."}), 403

    res = pdf_service.generate_verification_pdf(application_id)
    if res.get('status') == 'ERROR':
        return jsonify(res), 404
    return jsonify(res), 200

@pdf_bp.route('/api/applications/<application_id>/document', methods=['GET'])
def get_pdf_document(application_id):
    app = Application.query.filter_by(application_id=application_id).first()
    if not app:
        return jsonify({"success": False, "message": "Application not found"}), 404
    if app.status != 'APPROVED':
        return jsonify({"success": False, "message": "PDF download is only available for APPROVED applications."}), 403

    filename = f"{application_id}_verification_draft.pdf"
    filepath = os.path.abspath(os.path.join("generated_pdfs", filename))
    if not os.path.isfile(filepath):
        res = pdf_service.generate_verification_pdf(application_id)
        if res.get('status') == 'ERROR':
            return jsonify(res), 404
        filepath = os.path.abspath(res.get('filepath', filepath))
    return send_file(filepath, mimetype='application/pdf', as_attachment=True, download_name=filename)
