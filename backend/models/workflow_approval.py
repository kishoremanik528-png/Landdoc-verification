from datetime import datetime

from database.database import db


class WorkflowApproval(db.Model):
    __tablename__ = "workflow_approvals"

    id = db.Column(db.Integer, primary_key=True)

    application_id = db.Column(
        db.Integer,
        db.ForeignKey("applications.id"),
        nullable=False
    )

    officer_id = db.Column(
        db.Integer,
        nullable=True
    )

    approval_level = db.Column(
        db.String(100),
        nullable=True
    )

    status = db.Column(
        db.String(50),
        nullable=False,
        default="PENDING"
    )

    comments = db.Column(
        db.Text,
        nullable=True
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    def to_dict(self):
        return {
            "id": self.id,
            "application_id": self.application_id,
            "officer_id": self.officer_id,
            "approval_level": self.approval_level,
            "status": self.status,
            "comments": self.comments,
            "created_at": (
                self.created_at.isoformat()
                if self.created_at
                else None
            ),
            "updated_at": (
                self.updated_at.isoformat()
                if self.updated_at
                else None
            )
        }
        