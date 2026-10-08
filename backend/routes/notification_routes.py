from flask import Blueprint, jsonify
from models.application import Application
from services.notification_service import NotificationService

notification_bp = Blueprint('notification_routes', __name__)
notif_service = NotificationService()

@notification_bp.route('/api/applications/<application_id>/notifications', methods=['GET'])
def get_app_notifications(application_id):
    app = Application.query.filter_by(application_id=application_id).first()
    if not app:
        return jsonify({"success": False, "message": "Application not found"}), 404

    notifs = notif_service.get_application_notifications(app.id)
    return jsonify({"success": True, "notifications": notifs}), 200

@notification_bp.route('/api/notifications', methods=['GET'])
def get_all_notifications():
    notifs = notif_service.get_application_notifications()
    return jsonify({"success": True, "notifications": notifs}), 200

@notification_bp.route('/api/notifications/<int:notification_id>/read', methods=['POST'])
def mark_read(notification_id):
    success = notif_service.mark_as_read(notification_id)
    return jsonify({"success": success}), 200 if success else 404
