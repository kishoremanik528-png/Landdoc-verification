from datetime import datetime
from database.database import db

class Officer(db.Model):
    __tablename__ = "officers"

    id = db.Column(db.Integer, primary_key=True)
    officer_id = db.Column(db.String(64), unique=True, nullable=False, index=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    designation = db.Column(db.String(128), nullable=True)
    department = db.Column(db.String(128), nullable=True)
    role = db.Column(db.String(64), default="VERIFICATION_OFFICER") # VERIFICATION_OFFICER, VAO, REVENUE_INSPECTOR, SURVEY_OFFICER, TAHSILDAR, ADMIN
    district = db.Column(db.String(100), default="Trichy")
    taluk = db.Column(db.String(100), default="Trichy")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        for key, val in kwargs.items():
            setattr(self, key, val)

    def to_dict(self):
        return {
            "id": self.id,
            "officer_id": self.officer_id,
            "name": self.name,
            "email": self.email,
            "designation": self.designation,
            "department": self.department,
            "role": self.role,
            "district": self.district,
            "taluk": self.taluk,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
