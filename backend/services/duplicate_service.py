from models.duplicate_result import DuplicateResult

class DuplicateService:
    def get_duplicate_result(self, application_db_id):
        res = DuplicateResult.query.filter_by(application_id=application_db_id).first()
        return res.to_dict() if res else None
