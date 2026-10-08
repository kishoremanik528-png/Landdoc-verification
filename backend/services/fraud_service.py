from models.suspicious_pattern import SuspiciousPattern

class FraudService:
    def get_suspicious_patterns(self, application_db_id):
        res = SuspiciousPattern.query.filter_by(application_id=application_db_id).first()
        return res.to_dict() if res else None
