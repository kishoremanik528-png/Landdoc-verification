from flask import Blueprint, request, jsonify, current_app
from services.document_service import DocumentService
from utils.file_utils import allowed_file

upload_bp = Blueprint('upload_routes', __name__)
doc_service = DocumentService()

@upload_bp.route('/api/applications/<application_id>/documents', methods=['POST'])
def upload_document(application_id):
    if 'file' not in request.files:
        return jsonify({"success": False, "message": "No file uploaded"}), 400

    file = request.files['file']
    doc_type = request.form.get('document_type', 'PATTA')

    if file.filename == '':
        return jsonify({"success": False, "message": "No selected file"}), 400

    if not allowed_file(file.filename):
        return jsonify({"success": False, "message": "Unsupported file format. Please upload PDF, JPG, JPEG, or PNG."}), 400

    doc_dict, error = doc_service.add_document_to_application(
        application_id, file, doc_type, current_app.config['UPLOAD_FOLDER']
    )

    if error:
        return jsonify({"success": False, "message": error}), 400

    return jsonify({"success": True, "document": doc_dict}), 201
