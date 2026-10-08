from database.database import db
from models.notification import Notification

class NotificationService:
    def get_application_notifications(self, application_db_id=None):
        if application_db_id:
            notifs = Notification.query.filter_by(application_id=application_db_id).order_by(Notification.created_at.desc()).all()
        else:
            notifs = Notification.query.order_by(Notification.created_at.desc()).limit(50).all()
        return [n.to_dict() for n in notifs]

    def mark_as_read(self, notification_id):
        notif = Notification.query.get(notification_id)
        if notif:
            notif.is_read = True
            db.session.commit()
            return True
        return False
