from ai_modules.semantic_comparison import SemanticComparisonAI

class CrossVerificationAI:
    """
    Module 7: Cross-Document Verification AI (Core Feature)
    Compares target land fields (owner_name, survey_number, subdivision_number, land_extent, village, taluk, district) field-by-field across Patta, Chitta, EC, Sale Deed.
    """

    TARGET_FIELDS = [
        'owner_name',
        'survey_number',
        'subdivision_number',
        'land_extent',
        'village',
        'taluk',
        'district'
    ]

    FIELD_LABELS = {
        'owner_name': 'Owner Name',
        'survey_number': 'Survey Number',
        'subdivision_number': 'Subdivision',
        'land_extent': 'Land Extent',
        'village': 'Village',
        'taluk': 'Taluk',
        'district': 'District'
    }

    def __init__(self):
        self.comparator = SemanticComparisonAI()

    def verify(self, doc_extracted_map):
        """
        doc_extracted_map format:
        {
          "PATTA": {"owner_name": "...", "survey_number": "..."},
          "CHITTA": {"owner_name": "...", "survey_number": "..."},
          ...
        }
        """
        results = []
        doc_types = list(doc_extracted_map.keys())

        if len(doc_types) < 2:
            return {
                "module": "cross_verification",
                "status": "INSUFFICIENT_DOCUMENTS",
                "message": "At least 2 documents are required for cross-verification",
                "field_results": []
            }

        for field in self.TARGET_FIELDS:
            values_per_doc = {}
            valid_values = []
            
            for dtype in doc_types:
                val = doc_extracted_map[dtype].get(field)
                values_per_doc[dtype] = val
                if val:
                    valid_values.append((dtype, str(val)))

            if not valid_values:
                results.append({
                    "field_name": field,
                    "field_label": self.FIELD_LABELS.get(field, field),
                    "verification_status": "INSUFFICIENT_DATA",
                    "severity": "LOW",
                    "confidence": 0.5,
                    "explanation": "Field value not available in any submitted document",
                    "doc_values": values_per_doc
                })
                continue

            # Compare first valid value against all other document values for this field
            first_dtype, first_val = valid_values[0]
            mismatches = []
            possible_matches = []

            for dtype, val in valid_values[1:]:
                comp = self.comparator.compare_values(first_val, val, field_type=field)
                if comp['status'] == 'MISMATCH':
                    mismatches.append((dtype, val))
                elif comp['status'] == 'POSSIBLE_MATCH':
                    possible_matches.append((dtype, val))

            if mismatches:
                status = "MISMATCH"
                severity = "HIGH" if field in ['survey_number', 'owner_name', 'land_extent'] else "MEDIUM"
                diff_desc = ", ".join([f"{dt}: '{v}'" for dt, v in valid_values])
                explanation = f"{self.FIELD_LABELS.get(field, field)} mismatch found across documents ({diff_desc})"
            elif possible_matches:
                status = "POSSIBLE_MATCH"
                severity = "LOW"
                explanation = f"Slight variation in {self.FIELD_LABELS.get(field, field)} detected across documents"
            else:
                status = "MATCH"
                severity = "LOW"
                explanation = f"All available documents report identical {self.FIELD_LABELS.get(field, field)}"

            results.append({
                "field_name": field,
                "field_label": self.FIELD_LABELS.get(field, field),
                "verification_status": status,
                "severity": severity,
                "confidence": 0.95,
                "explanation": explanation,
                "doc_values": values_per_doc
            })

        return {
            "module": "cross_verification",
            "status": "SUCCESS",
            "confidence": 0.95,
            "field_results": results
        }
