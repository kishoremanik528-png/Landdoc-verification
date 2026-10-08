
from datetime import datetime

from database.database import db


class Application(db.Model):
    __tablename__ = "applications"

    # Internal database primary key
    id = db.Column(
        db.Integer,
        primary_key=True
    )

    # Public application ID
    application_id = db.Column(
        db.String(50),
        unique=True,
        nullable=False,
        index=True
    )

    applicant_name = db.Column(
        db.String(255),
        nullable=True
    )

    phone_number = db.Column(
        db.String(15),
        nullable=True
    )

    guardian_name = db.Column(
        db.String(255),
        nullable=True
    )

    district = db.Column(
        db.String(100),
        nullable=True
    )

    taluk = db.Column(
        db.String(100),
        nullable=True
    )

    village = db.Column(
        db.String(100),
        nullable=True
    )

    survey_number = db.Column(
        db.String(100),
        nullable=True
    )

    subdivision_number = db.Column(
        db.String(100),
        nullable=True
    )

    extent = db.Column(
        db.String(100),
        nullable=True
    )

    property_type = db.Column(
        db.String(100),
        nullable=True
    )

    status = db.Column(
        db.String(50),
        default="CREATED",
        nullable=False
    )

    processing_status = db.Column(
        db.String(50),
        default="PENDING",
        nullable=False
    )

    risk_score = db.Column(
        db.Float,
        nullable=True
    )

    risk_level = db.Column(
        db.String(20),
        nullable=True
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    # Relationships
    documents = db.relationship("Document", backref="application", lazy=True, cascade="all, delete-orphan")
    verification_results = db.relationship("VerificationResult", backref="application", lazy=True, cascade="all, delete-orphan")
    risk_analyses = db.relationship("RiskAnalysis", backref="application", lazy=True, cascade="all, delete-orphan")
    module_results = db.relationship("ModuleResult", backref="application", lazy=True, cascade="all, delete-orphan")
    duplicate_results = db.relationship("DuplicateResult", foreign_keys="DuplicateResult.application_id", backref="application", lazy=True, cascade="all, delete-orphan")
    suspicious_patterns = db.relationship("SuspiciousPattern", backref="application", lazy=True, cascade="all, delete-orphan")
    ownership_records = db.relationship("OwnershipRecord", backref="application", lazy=True, cascade="all, delete-orphan")
    notifications = db.relationship("Notification", backref="application", lazy=True, cascade="all, delete-orphan")
    reviews = db.relationship("Review", backref="application", lazy=True, cascade="all, delete-orphan")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        for key, val in kwargs.items():
            setattr(self, key, val)

    def to_dict(self):
        return {
            "id": self.id,
            "application_id": self.application_id,
            "applicant_name": self.applicant_name,
            "guardian_name": self.guardian_name,
            "phone_number": self.phone_number,
            "district": self.district,
            "taluk": self.taluk,
            "village": self.village,
            "survey_number": self.survey_number,
            "subdivision_number": self.subdivision_number,
            "extent": self.extent,
            "property_type": self.property_type,
            "status": self.status,
            "processing_status": self.processing_status,
            "risk_score": self.risk_score,
            "risk_level": self.risk_level,
            "created_at": (
                self.created_at.isoformat()
                if self.created_at
                else None
            ),
            "updated_at": (
                self.updated_at.isoformat()
                if self.updated_at
                else None
            ),
            "document_count": len(self.documents) if self.documents else 0
        }
