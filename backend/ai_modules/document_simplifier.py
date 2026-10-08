class DocumentSimplifierAI:
    """
    Module 18: Document Accessibility & Simplification AI
    Simplifies complex legal land document terms into clear Tamil and English explanations.
    """

    SIMPLIFICATION_MAP = {
        "survey number": "Unique land parcel registration code given by the government.",
        "patta": "Government certificate proving who owns the land parcel.",
        "chitta": "Government register showing land area, soil type, and classification.",
        "encumbrance": "Record of prior bank loans, mortgages, or court cases attached to the land.",
        "subdivision": "Division of a larger survey land parcel into smaller sub-plots."
    }

    SIMPLIFICATION_MAP_TAMIL = {
        "survey number": "அரசாங்கத்தால் வழங்கப்பட்ட நிலத்தின் தனித்துவமான புல எண்.",
        "patta": "நிலத்தின் அதிகாரப்பூர்வ உரிமையாளர் சான்றிதழ்.",
        "chitta": "நிலத்தின் பரப்பளவு மற்றும் வகைப்பாடு கொண்ட அரசுப் பதிவேடு.",
        "encumbrance": "நிலத்தின் மீதான வங்கி கடன் அல்லது அடமான விவரங்கள் (வில்லங்கம்).",
        "subdivision": "பெரிய நிலப்பகுதியை சிறிய உட்பிரிவுகளாகப் பிரிப்பது."
    }

    def simplify(self, raw_text, term=None):
        if term:
            t_lower = term.lower().strip()
            english_exp = self.SIMPLIFICATION_MAP.get(t_lower, "Land document term used in government registry.")
            tamil_exp = self.SIMPLIFICATION_MAP_TAMIL.get(t_lower, "அரசு நிலப் பதிவேட்டில் பயன்படுத்தப்படும் சட்டச் சொல்.")
            return {
                "term": term,
                "english_simple": english_exp,
                "tamil_simple": tamil_exp
            }

        # Full text simplification sample
        simple_summary = "This document identifies a specific parcel of land, specifying its registered owner, survey identification number, total land area in acres, and official government boundary locations."
        simple_summary_tamil = "இந்த ஆவணம் குறிப்பிட்ட நிலத்தின் உரிமையாளர், புல எண், நில பரப்பளவு மற்றும் எல்லை விவரங்களை தெளிவாக விவரிக்கிறது."

        return {
            "module": "document_simplifier",
            "status": "SUCCESS",
            "original_text": raw_text[:300] + "..." if len(raw_text) > 300 else raw_text,
            "simple_explanation_en": simple_summary,
            "simple_explanation_ta": simple_summary_tamil
        }
