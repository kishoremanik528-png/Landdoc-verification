class MultilingualProcessorAI:
    """
    Module 3: Multilingual AI
    Maps Tamil, English, and mixed script land document labels to canonical standard fields.
    """

    TAMIL_MAP = {
        'உரிமையாளர் பெயர்': 'owner_name',
        'பட்டா எண்': 'document_number',
        'புல எண்': 'survey_number',
        'உட்பிரிவு': 'subdivision_number',
        'நில அளவு': 'land_extent',
        'கிராமம்': 'village',
        'தாலுகா': 'taluk',
        'மாவட்டம்': 'district',
        'பதிவு தேதி': 'registration_date',
        'எல்லைகள்': 'property_boundaries'
    }

    ENGLISH_MAP = {
        'owner name': 'owner_name',
        'purchaser': 'owner_name',
        'patta no': 'document_number',
        'survey no': 'survey_number',
        'survey number': 'survey_number',
        'subdivision': 'subdivision_number',
        'extent': 'land_extent',
        'area': 'land_extent',
        'village': 'village',
        'taluk': 'taluk',
        'district': 'district',
        'registration date': 'registration_date',
        'boundaries': 'property_boundaries'
    }

    def process(self, extracted_fields):
        normalized_fields = {}
        confidence_map = {}

        for raw_label, val in extracted_fields.items():
            canonical_key = self.map_label_to_canonical(raw_label)
            normalized_fields[canonical_key] = val
            confidence_map[canonical_key] = 0.95

        return {
            "module": "multilingual_processor",
            "status": "SUCCESS",
            "confidence": 0.95,
            "canonical_fields": normalized_fields,
            "field_confidence": confidence_map
        }

    def map_label_to_canonical(self, label):
        lbl_lower = str(label).strip().lower()
        if lbl_lower in self.TAMIL_MAP:
            return self.TAMIL_MAP[lbl_lower]
        if lbl_lower in self.ENGLISH_MAP:
            return self.ENGLISH_MAP[lbl_lower]

        for k, v in self.TAMIL_MAP.items():
            if k in lbl_lower:
                return v

        for k, v in self.ENGLISH_MAP.items():
            if k in lbl_lower:
                return v

        return label
