import difflib

class SemanticComparisonAI:
    """
    Module 5: Semantic Comparison AI
    Fuzzy string matching & similarity classification.
    """

    # Fields that require exact matching (any difference = MISMATCH)
    EXACT_MATCH_FIELDS = {'survey_number', 'subdivision_number', 'land_extent'}

    def compare_values(self, val1, val2, field_type='general'):
        if not val1 or not val2:
            return {
                "similarity_score": 0.0,
                "status": "INSUFFICIENT_DATA",
                "explanation": "One or both values are missing"
            }

        s1 = str(val1).strip().lower()
        s2 = str(val2).strip().lower()

        if s1 == s2:
            return {
                "similarity_score": 1.0,
                "status": "MATCH",
                "explanation": "Exact string match"
            }

        # For coded identifiers (survey numbers, extents), any difference = MISMATCH
        if field_type in self.EXACT_MATCH_FIELDS:
            return {
                "similarity_score": round(difflib.SequenceMatcher(None, s1, s2).ratio(), 2),
                "status": "MISMATCH",
                "explanation": f"Values differ: '{val1}' vs '{val2}'"
            }

        # Token set comparison for names and locations
        tokens1 = set(s1.split())
        tokens2 = set(s2.split())
        token_overlap = len(tokens1.intersection(tokens2)) / max(len(tokens1), len(tokens2), 1)

        seq_ratio = difflib.SequenceMatcher(None, s1, s2).ratio()
        final_score = round(max(seq_ratio, token_overlap), 2)

        if final_score >= 0.85:
            status = "MATCH"
            explanation = "High similarity match"
        elif final_score >= 0.65:
            status = "POSSIBLE_MATCH"
            explanation = "Partial similarity detected (e.g. abbreviation or initial variation)"
        else:
            status = "MISMATCH"
            explanation = "Significant value divergence detected"

        return {
            "similarity_score": final_score,
            "status": status,
            "explanation": explanation
        }
