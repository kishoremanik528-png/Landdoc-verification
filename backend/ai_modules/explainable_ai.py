class ExplainableAI:
    """
    Module 15: Explainable AI
    Generates multi-perspective plain-language explanations for verification findings.
    """

    def generate_explanations(self, verification_results, risk_score, risk_level, duplicate_res, tampering_res, chain_res):
        mismatches = [r for r in verification_results if r.get('verification_status') == 'MISMATCH']
        
        # 1. Short Explanation
        if risk_level == 'LOW' and not mismatches:
            short_exp = "All submitted document fields match across Patta, Chitta, EC, and Sale Deed. Low risk profile."
        elif mismatches:
            fields_str = ", ".join([m.get('field_name', '').replace('_', ' ') for m in mismatches])
            short_exp = f"Verification requires review due to field discrepancies in {fields_str}."
        elif duplicate_res and duplicate_res.get('possible_duplicate'):
            short_exp = "Application flagged due to high similarity with a previously registered land application."
        elif tampering_res and tampering_res.get('tampering_suspected'):
            short_exp = "Document integrity warning detected during metadata inspection."
        elif chain_res and chain_res.get('requires_review'):
            short_exp = "Ownership history contains an unverified transfer gap requiring deed verification."
        else:
            short_exp = f"Application evaluated with {risk_level} risk score ({risk_score}/100)."

        # 2. Detailed Explanation
        detailed_bullets = []
        if mismatches:
            for m in mismatches:
                detailed_bullets.append(f"• {m.get('explanation')}")
        else:
            detailed_bullets.append("• Field-by-field cross-verification confirmed complete consistency across all documents.")

        if duplicate_res and duplicate_res.get('possible_duplicate'):
            detailed_bullets.append(f"• Duplicate Check: {duplicate_res.get('explanation')}")

        if tampering_res and tampering_res.get('tampering_suspected'):
            detailed_bullets.append(f"• Integrity Check: {tampering_res.get('explanation')}")

        if chain_res and chain_res.get('requires_review'):
            detailed_bullets.append(f"• Ownership Sequence: {chain_res.get('explanation')}")

        detailed_exp = "\n".join(detailed_bullets)

        # 3. Officer Explanation
        officer_exp = f"[OFFICER SUMMARY - RISK SCORE: {risk_score}/100 ({risk_level})]\n"
        officer_exp += f"Primary Recommendation: Proceed with {'Standard Officer Approval' if risk_level == 'LOW' else 'Detailed Document Inspection'}.\n"
        officer_exp += f"Key Action Item: Verify physical copies of documents associated with {mismatches[0].get('field_name') if mismatches else 'all submitted records'}."

        return {
            "module": "explainable_ai",
            "status": "SUCCESS",
            "confidence": 0.95,
            "short_explanation": short_exp,
            "detailed_explanation": detailed_exp,
            "officer_explanation": officer_exp
        }
