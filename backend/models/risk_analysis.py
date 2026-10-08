from datetime import datetime
from database.database import db

class RiskAnalysis(db.Model):
    __tablename__ = 'risk_analyses'

    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, db.ForeignKey('applications.id'), nullable=False)
    risk_score = db.Column(db.Integer, nullable=False)  # 0 to 100
    risk_level = db.Column(db.String(32), nullable=False)  # LOW, MEDIUM, HIGH, CRITICAL
    risk_factors = db.Column(db.JSON, nullable=True)  # List of identified risk factors
    calculation_details = db.Column(db.JSON, nullable=True)  # Breakdown of weights and scores
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'application_id': self.application_id,
            'risk_score': self.risk_score,
            'risk_level': self.risk_level,
            'risk_factors': self.risk_factors or [],
            'calculation_details': self.calculation_details or {},
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
