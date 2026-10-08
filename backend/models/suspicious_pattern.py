from datetime import datetime
from database.database import db

class SuspiciousPattern(db.Model):
    __tablename__ = 'suspicious_patterns'

    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, db.ForeignKey('applications.id'), nullable=False)
    risk_level = db.Column(db.String(32), default='LOW')  # LOW, MEDIUM, HIGH
    detected_patterns = db.Column(db.JSON, nullable=True)  # List of strings/objects
    explanation = db.Column(db.Text, nullable=True)
    confidence = db.Column(db.Float, default=1.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'application_id': self.application_id,
            'risk_level': self.risk_level,
            'detected_patterns': self.detected_patterns or [],
            'explanation': self.explanation,
            'confidence': self.confidence,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
