from models.application import Application
from models.verification_result import VerificationResult
from models.risk_analysis import RiskAnalysis
from models.module_result import ModuleResult
from ai_modules.explainable_ai import ExplainableAI
from ai_modules.case_summarizer import CaseSummarizerAI

class SummaryService:
    def __init__(self):
        self.explainable_ai = ExplainableAI()
        self.case_summarizer = CaseSummarizerAI()

    def build_case_summary(self, application_db_id):
        app = Application.query.get(application_db_id)
        if not app:
            return None

        v_results = [r.to_dict() for r in VerificationResult.query.filter_by(application_id=app.id).all()]
        m_results = {m.module_name: m.metadata_json for m in ModuleResult.query.filter_by(application_id=app.id).all()}
        r_analysis = RiskAnalysis.query.filter_by(application_id=app.id).first()

        dup_res = m_results.get('duplicate_detection', {})
        tamp_res = m_results.get('tampering_detection', {})
        chain_res = m_results.get('ownership_chain', {})

        explanations = self.explainable_ai.generate_explanations(
            v_results,
            app.risk_score,
            app.risk_level,
            dup_res,
            tamp_res,
            chain_res
        )

        case_summary = self.case_summarizer.summarize(
            len(app.documents),
            v_results,
            app.risk_score,
            app.risk_level
        )

        return {
            "application_id": app.application_id,
            "risk_score": app.risk_score,
            "risk_level": app.risk_level,
            "status": app.status,
            "explanations": explanations,
            "summary": case_summary
        }
