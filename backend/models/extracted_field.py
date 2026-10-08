from database.database import db

class ExtractedField(db.Model):
    __tablename__ = 'extracted_fields'

    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('documents.id'), nullable=False)
    field_name = db.Column(db.String(128), nullable=False)  # owner_name, survey_number, subdivision_number, land_extent, village, etc.
    original_value = db.Column(db.Text, nullable=True)
    normalized_value = db.Column(db.Text, nullable=True)
    confidence = db.Column(db.Float, default=1.0)

    def to_dict(self):
        return {
            'id': self.id,
            'document_id': self.document_id,
            'field_name': self.field_name,
            'original_value': self.original_value,
            'normalized_value': self.normalized_value,
            'confidence': self.confidence
        }
