from datetime import datetime
from database.database import db

class VerificationResult(db.Model):
    __tablename__ = 'verification_results'

    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, db.ForeignKey('applications.id'), nullable=False)
    field_name = db.Column(db.String(128), nullable=False)
    verification_status = db.Column(db.String(32), nullable=False)  # MATCH, POSSIBLE_MATCH, MISMATCH, REVIEW_REQUIRED, INSUFFICIENT_DATA
    severity = db.Column(db.String(32), default='LOW')  # LOW, MEDIUM, HIGH, CRITICAL
    confidence = db.Column(db.Float, default=1.0)
    explanation = db.Column(db.Text, nullable=True)
    details = db.Column(db.JSON, nullable=True)  # Detailed values per document
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'application_id': self.application_id,
            'field_name': self.field_name,
            'verification_status': self.verification_status,
            'severity': self.severity,
            'confidence': self.confidence,
            'explanation': self.explanation,
            'details': self.details,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
