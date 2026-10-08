from datetime import datetime
from database.database import db

class AiFinding(db.Model):
    __tablename__ = "ai_findings"

    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, db.ForeignKey("applications.id"), nullable=False)
    finding_type = db.Column(db.String(64), nullable=False) # MISMATCH, DUPLICATE, TAMPERING, CHAIN_GAP, ANOMALY
    severity = db.Column(db.String(32), default="MEDIUM") # LOW, MEDIUM, HIGH, CRITICAL
    description = db.Column(db.Text, nullable=False)
    confidence = db.Column(db.Float, default=0.9)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "application_id": self.application_id,
            "finding_type": self.finding_type,
            "severity": self.severity,
            "description": self.description,
            "confidence": self.confidence,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
