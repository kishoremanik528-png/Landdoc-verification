from database.database import db

class OwnershipRecord(db.Model):
    __tablename__ = 'ownership_records'

    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, db.ForeignKey('applications.id'), nullable=False)
    owner_name = db.Column(db.String(255), nullable=False)
    previous_owner = db.Column(db.String(255), nullable=True)
    survey_number = db.Column(db.String(128), nullable=True)
    transfer_date = db.Column(db.String(64), nullable=True)
    source_document = db.Column(db.String(128), nullable=True)
    sequence_order = db.Column(db.Integer, default=1)

    def to_dict(self):
        return {
            'id': self.id,
            'application_id': self.application_id,
            'owner_name': self.owner_name,
            'previous_owner': self.previous_owner,
            'survey_number': self.survey_number,
            'transfer_date': self.transfer_date,
            'source_document': self.source_document,
            'sequence_order': self.sequence_order
        }
