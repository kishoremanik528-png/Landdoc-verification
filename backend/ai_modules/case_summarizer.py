class CaseSummarizerAI:
    """
    Module 17: AI Case Summarizer & Smart Action Advisor
    Generates complete application summary, issue highlights, and recommended next officer actions.
    """

    def summarize(self, doc_count, verification_results, risk_score, risk_level):
        total_fields = len(verification_results)
        matches = len([r for r in verification_results if r.get('verification_status') == 'MATCH'])
        mismatches = [r for r in verification_results if r.get('verification_status') == 'MISMATCH']
        mismatch_count = len(mismatches)

        main_issue = "None"
        if mismatches:
            main_issue = mismatches[0].get('explanation')

        # Smart Action Advisor logic
        if risk_level == 'LOW':
            recommended_action = "Approve Application: All document fields are consistent across submitted records."
        elif risk_level == 'MEDIUM':
            recommended_action = f"Request Officer Review: Verify {mismatches[0].get('field_name') if mismatches else 'ownership chain'} before approval."
        else:
            recommended_action = f"Flag for In-Person Investigation: High risk discrepancies found in {mismatches[0].get('field_name') if mismatches else 'document integrity'}."

        return {
            "module": "case_summarizer",
            "status": "SUCCESS",
            "confidence": 0.95,
            "documents_submitted": doc_count,
            "fields_verified": total_fields,
            "matches_count": matches,
            "issues_found": mismatch_count,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "main_issue": main_issue,
            "recommended_action": recommended_action
        }
