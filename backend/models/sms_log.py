from datetime import datetime
from database.database import db


class SmsLog(db.Model):
    __tablename__ = 'sms_logs'

    id = db.Column(db.Integer, primary_key=True)

    application_id = db.Column(
        db.Integer,
        db.ForeignKey('applications.id'),
        nullable=True
    )

    phone_number_masked = db.Column(
        db.String(15),
        nullable=True
    )

    message = db.Column(
        db.Text,
        nullable=True
    )

    status = db.Column(
        db.String(20),
        nullable=False,
        default='DEMO'
    )  # SENT, FAILED, DEMO

    provider = db.Column(
        db.String(20),
        default='Twilio'
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    def to_dict(self):
        return {
            'id': self.id,
            'application_id': self.application_id,
            'phone_number_masked': self.phone_number_masked,
            'message': self.message,
            'status': self.status,
            'provider': self.provider,
            'created_at': (
                self.created_at.isoformat()
                if self.created_at
                else None
            )
        }
