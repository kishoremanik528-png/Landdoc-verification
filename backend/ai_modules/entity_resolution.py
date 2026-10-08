from ai_modules.semantic_comparison import SemanticComparisonAI

class EntityResolutionAI:
    """
    Module 6: Entity Resolution AI
    Determines if owner names & identifiers across documents refer to the same entity safely.
    """

    def __init__(self):
        self.comparator = SemanticComparisonAI()

    def resolve_entities(self, doc_fields_map):
        names = []
        for doc_type, fields in doc_fields_map.items():
            if fields.get('owner_name'):
                names.append((doc_type, fields['owner_name']))

        if not names:
            return {
                "module": "entity_resolution",
                "status": "UNAVAILABLE",
                "message": "Insufficient owner name data for resolution"
            }

        baseline_type, baseline_name = names[0]
        all_matches = True
        scores = []

        for doc_type, name in names[1:]:
            res = self.comparator.compare_values(baseline_name, name, field_type='name')
            scores.append(res['similarity_score'])
            if res['status'] == 'MISMATCH':
                all_matches = False

        avg_score = sum(scores) / max(len(scores), 1) if scores else 1.0

        if all_matches and avg_score >= 0.85:
            resolution = "POSSIBLE_SAME_ENTITY"
            reason = "Available document records are consistent with a single entity"
        elif avg_score >= 0.65:
            resolution = "LIKELY_SAME_ENTITY_WITH_VARIATION"
            reason = "Name variations detected across documents (e.g. initials or spelling difference)"
        else:
            resolution = "ENTITY_MISMATCH_REQUIRES_REVIEW"
            reason = "Multiple distinct owner names detected across documents"

        return {
            "module": "entity_resolution",
            "status": "SUCCESS",
            "confidence": round(avg_score, 2),
            "entity_match": resolution,
            "reason": reason
        }
