from datetime import datetime
from database.database import db

class DataCorrection(db.Model):
    __tablename__ = "data_corrections"

    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, db.ForeignKey("applications.id"), nullable=False)
    field_name = db.Column(db.String(128), nullable=False)
    ai_extracted_value = db.Column(db.Text, nullable=True)
    officer_corrected_value = db.Column(db.Text, nullable=False)
    correction_reason = db.Column(db.Text, nullable=True)
    corrected_by = db.Column(db.String(128), default="OFFICER")
    corrected_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "application_id": self.application_id,
            "field_name": self.field_name,
            "ai_extracted_value": self.ai_extracted_value,
            "officer_corrected_value": self.officer_corrected_value,
            "correction_reason": self.correction_reason,
            "corrected_by": self.corrected_by,
            "corrected_at": self.corrected_at.isoformat() if self.corrected_at else None
        }
