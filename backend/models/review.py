from datetime import datetime
from database.database import db

class Review(db.Model):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, db.ForeignKey('applications.id'), nullable=False)
    officer_name = db.Column(db.String(255), nullable=False)
    officer_id = db.Column(db.String(128), nullable=False)
    decision = db.Column(db.String(64), nullable=False)  # APPROVED, REJECTED, ADDITIONAL_INFO_REQUESTED
    comments = db.Column(db.Text, nullable=True)
    findings_accepted = db.Column(db.Boolean, default=True)
    findings_overridden = db.Column(db.Boolean, default=False)
    review_date = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        for key, val in kwargs.items():
            setattr(self, key, val)

    def to_dict(self):
        return {
            'id': self.id,
            'application_id': self.application_id,
            'officer_name': self.officer_name,
            'officer_id': self.officer_id,
            'decision': self.decision,
            'comments': self.comments,
            'findings_accepted': self.findings_accepted,
            'findings_overridden': self.findings_overridden,
            'review_date': self.review_date.isoformat() if self.review_date else None
        }
