from models.verification_result import VerificationResult

class ComparisonService:
    def get_verification_matrix(self, application_db_id):
        results = VerificationResult.query.filter_by(application_id=application_db_id).all()
        return [r.to_dict() for r in results]
