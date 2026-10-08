from datetime import datetime
from database.database import db

class ModuleResult(db.Model):
    __tablename__ = 'module_results'

    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, db.ForeignKey('applications.id'), nullable=False)
    module_name = db.Column(db.String(128), nullable=False)
    status = db.Column(db.String(32), default='SUCCESS')  # SUCCESS, UNAVAILABLE, FAILED
    confidence = db.Column(db.Float, default=1.0)
    findings = db.Column(db.JSON, nullable=True)
    warnings = db.Column(db.JSON, nullable=True)
    metadata_json = db.Column(db.JSON, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'application_id': self.application_id,
            'module_name': self.module_name,
            'status': self.status,
            'confidence': self.confidence,
            'findings': self.findings or [],
            'warnings': self.warnings or [],
            'metadata': self.metadata_json or {},
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
