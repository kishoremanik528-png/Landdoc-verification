import re

class DataNormalizationAI:
    """
    Module 4: Data Normalization
    Standardizes survey numbers, land extent units, location names, and text formatting.
    """

    LOCATION_SYNONYMS = {
        "trichy": "Tiruchirappalli",
        "tanjore": "Thanjavur",
        "madras": "Chennai",
        "kovai": "Coimbatore",
        "tuticorin": "Thoothukudi"
    }

    def normalize_fields(self, field_dict):
        normalized = {}
        for key, val in field_dict.items():
            if val is None:
                normalized[key] = None
                continue

            val_str = str(val).strip()
            if key == 'survey_number':
                normalized[key] = self.normalize_survey_number(val_str)
            elif key == 'land_extent':
                normalized[key] = self.normalize_extent(val_str)
            elif key in ['village', 'taluk', 'district']:
                normalized[key] = self.normalize_location(val_str)
            elif key == 'owner_name':
                normalized[key] = self.normalize_name(val_str)
            else:
                normalized[key] = re.sub(r'\s+', ' ', val_str)

        return {
            "module": "data_normalization",
            "status": "SUCCESS",
            "confidence": 0.96,
            "normalized_fields": normalized
        }

    def normalize_survey_number(self, survey):
        s = re.sub(r'\s+', '', survey)
        s = s.replace('-', '/').upper()
        return s

    def normalize_extent(self, extent):
        ext_lower = extent.lower().strip()
        # Convert cents to acres if given
        cents_match = re.search(r'(\d+)\s*cents', ext_lower)
        acres_match = re.search(r'(\d+(?:\.\d+)?)\s*acres', ext_lower)
        
        acres = 0.0
        if acres_match:
            acres += float(acres_match.group(1))
        if cents_match:
            acres += float(cents_match.group(1)) / 100.0

        if acres > 0:
            return f"{acres:.2f} acres"
        return ext_lower

    def normalize_location(self, loc):
        cleaned = re.sub(r'\s+', ' ', loc).strip().title()
        loc_lower = cleaned.lower()
        if loc_lower in self.LOCATION_SYNONYMS:
            return self.LOCATION_SYNONYMS[loc_lower]
        return cleaned

    def normalize_name(self, name):
        cleaned = re.sub(r'\s+', ' ', name).strip()
        # Remove common prefixes
        cleaned = re.sub(r'^(Thiru|Mr\.|Mrs\.|Dr\.|Selvi)\s+', '', cleaned, flags=re.IGNORECASE)
        return cleaned.title()
