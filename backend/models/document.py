from datetime import datetime

from database.database import db


class Document(db.Model):
    __tablename__ = "documents"

    # Internal database ID
    id = db.Column(
        db.Integer,
        primary_key=True
    )

    # Public document ID
    document_id = db.Column(
        db.String(50),
        unique=True,
        nullable=False,
        index=True
    )

    # Foreign key to applications table
    application_id = db.Column(
        db.Integer,
        db.ForeignKey("applications.id"),
        nullable=False
    )

    document_type = db.Column(
        db.String(50),
        nullable=False,
        default="UNKNOWN"
    )

    original_file_name = db.Column(
        db.String(255),
        nullable=False
    )

    file_path = db.Column(
        db.String(500),
        nullable=False
    )

    file_type = db.Column(
        db.String(20),
        nullable=False
    )

    file_size = db.Column(
        db.Integer,
        nullable=False
    )

    processing_status = db.Column(
        db.String(50),
        default="UPLOADED",
        nullable=False
    )

    ocr_status = db.Column(
        db.String(50),
        default="PENDING"
    )

    extraction_confidence = db.Column(
        db.Float,
        nullable=True
    )

    upload_date = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        for key, val in kwargs.items():
            setattr(self, key, val)

    def to_dict(self):
        return {
            "id": self.id,
            "document_id": self.document_id,
            "application_id": self.application_id,
            "document_type": self.document_type,
            "original_file_name": self.original_file_name,
            "file_path": self.file_path,
            "file_type": self.file_type,
            "file_size": self.file_size,
            "processing_status": self.processing_status,
            "ocr_status": self.ocr_status,
            "extraction_confidence": self.extraction_confidence,
            "upload_date": (
                self.upload_date.isoformat()
                if self.upload_date
                else None
            )
        }