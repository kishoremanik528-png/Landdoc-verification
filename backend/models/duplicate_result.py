from datetime import datetime
from database.database import db

class DuplicateResult(db.Model):
    __tablename__ = 'duplicate_results'

    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, db.ForeignKey('applications.id'), nullable=False)
    matched_application_id = db.Column(db.String(64), nullable=True)
    similarity_score = db.Column(db.Float, default=0.0)
    duplicate_status = db.Column(db.String(64), default='NO_DUPLICATE')  # NO_DUPLICATE, POTENTIAL_DUPLICATE, HIGH_PROBABILITY_DUPLICATE
    explanation = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'application_id': self.application_id,
            'matched_application_id': self.matched_application_id,
            'similarity_score': self.similarity_score,
            'duplicate_status': self.duplicate_status,
            'explanation': self.explanation,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
