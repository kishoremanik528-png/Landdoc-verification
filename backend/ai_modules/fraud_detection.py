class SuspiciousPatternAI:
    """
    Module 8: Suspicious Pattern Detection AI
    Analyzes application data for unusual patterns, repeated conflicts, or anomalies.
    """

    def analyze(self, verification_results, extracted_data):
        patterns = []
        risk_level = "LOW"

        # Check for multiple critical mismatches
        mismatches = [r for r in verification_results if r.get('verification_status') == 'MISMATCH']
        
        if len(mismatches) >= 2:
            patterns.append("Multiple critical field mismatches detected across submitted documents")
            risk_level = "HIGH"
        elif len(mismatches) == 1:
            patterns.append(f"Single critical field conflict detected in {mismatches[0].get('field_name')}")
            risk_level = "MEDIUM"

        # Check survey number format anomalies
        for doc_type, fields in extracted_data.items():
            s_num = fields.get('survey_number', '')
            if s_num and len(s_num) > 15:
                patterns.append(f"Anomalous survey number length in {doc_type}: '{s_num}'")
                if risk_level != "HIGH":
                    risk_level = "MEDIUM"

        explanation = "No suspicious patterns detected" if not patterns else "; ".join(patterns)

        return {
            "module": "suspicious_pattern",
            "status": "SUCCESS",
            "confidence": 0.90,
            "risk_detected": len(patterns) > 0,
            "risk_level": risk_level,
            "patterns": patterns,
            "explanation": explanation
        }
