class RiskService:
    """
    Standardized Risk Engine (Module 11)
    Calculates weighted risk score (0-100) and assigns standardized risk levels:
    - LOW: 0% - 33%
    - MEDIUM: 34% - 66%
    - HIGH: 67% - 100%
    """

    def calculate_risk(self, verification_results, duplicate_res, tampering_res, chain_res):
        score = 0
        risk_factors = []
        calculation_breakdown = []

        # Field Mismatches & Variances
        for res in verification_results:
            status = res.get('verification_status')
            field = res.get('field_name', '')

            if status == 'MISMATCH':
                if field == 'survey_number':
                    weight = 30
                    issue_label = "Survey Number Mismatch"
                elif field == 'owner_name':
                    weight = 25
                    issue_label = "Owner Name Mismatch"
                elif field == 'land_extent':
                    weight = 20
                    issue_label = "Land Extent Mismatch"
                elif field in ['village', 'taluk', 'district']:
                    weight = 15
                    issue_label = f"{field.capitalize()} Location Mismatch"
                else:
                    weight = 10
                    issue_label = f"Field Mismatch ({field})"
                
                score += weight
                risk_factors.append(f"{issue_label} (+{weight} pts)")
                calculation_breakdown.append({"issue": issue_label, "points": weight, "field": field})

            elif status == 'POSSIBLE_MATCH':
                weight = 5
                issue_label = f"Minor variation in {field}"
                score += weight
                risk_factors.append(f"{issue_label} (+{weight} pts)")
                calculation_breakdown.append({"issue": issue_label, "points": weight, "field": field})

            elif status == 'INSUFFICIENT_DATA' or status == 'MISSING_DATA':
                weight = 10
                issue_label = f"Missing Critical Field ({field})"
                score += weight
                risk_factors.append(f"{issue_label} (+{weight} pts)")
                calculation_breakdown.append({"issue": issue_label, "points": weight, "field": field})

        # Duplicate Application Check
        if duplicate_res and duplicate_res.get('possible_duplicate'):
            weight = 15
            issue_label = "Possible Duplicate Application"
            score += weight
            risk_factors.append(f"{issue_label} (+{weight} pts)")
            calculation_breakdown.append({"issue": issue_label, "points": weight})

        # Tampering Inspection
        if tampering_res and tampering_res.get('tampering_suspected'):
            weight = 20
            issue_label = "Potential Document Alteration Warning"
            score += weight
            risk_factors.append(f"{issue_label} (+{weight} pts)")
            calculation_breakdown.append({"issue": issue_label, "points": weight})

        # Ownership Chain Gap
        if chain_res and chain_res.get('requires_review'):
            weight = 15
            issue_label = "Ownership Transfer Sequence Gap"
            score += weight
            risk_factors.append(f"{issue_label} (+{weight} pts)")
            calculation_breakdown.append({"issue": issue_label, "points": weight})

        # Cap score between 0 and 100
        final_score = max(0, min(score, 100))

        # Standardized Risk Classification:
        # LOW: 0 - 33
        # MEDIUM: 34 - 66
        # HIGH: 67 - 100
        if final_score >= 67:
            risk_level = "HIGH"
        elif final_score >= 34:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"

        return {
            "risk_score": final_score,
            "risk_percentage": final_score,
            "risk_level": risk_level,
            "risk_factors": risk_factors,
            "calculation_details": calculation_breakdown
        }
