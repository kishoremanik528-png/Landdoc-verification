class VoiceAssistantAI:
    """
    Module 16: Voice & Conversational Support AI
    Answers questions regarding current application status, verification mismatches, land legal terms, and next steps.
    """

    FAQ_KNOWLEDGE_BASE = {
        "mismatch": "A mismatch occurs when two or more submitted land documents (like Patta and Sale Deed) report conflicting information for the same field, such as different survey numbers or owner names.",
        "survey": "The survey number is a unique land parcel identification code assigned by the Tamil Nadu Revenue Department to denote exact boundary coordinates.",
        "patta": "Patta is an official revenue department document proving land ownership in Tamil Nadu.",
        "chitta": "Chitta is a revenue document detailing land category, soil type, classification, and land area extent.",
        "ec": "An Encumbrance Certificate (EC) shows all registered transactions, mortgages, and legal claims on a property over a specific time period.",
        "review": "Applications are marked 'Review Required' when AI detects discrepancies or risks. The final decision always rests with an authorized human revenue officer.",
        "tamil": "பட்டா மற்றும் கிரைய பத்திரத்தில் புல எண் அல்லது உரிமையாளர் பெயர் மாறுபட்டால், விண்ணப்பம் சரிபார்ப்பிற்கு பரிந்துரைக்கப்படும்."
    }

    def answer_query(self, query, app_context=None):
        if not query:
            return {
                "answer": "Hello! I am your LandGuard AI Assistant. How can I help you verify your land application today?",
                "language": "en"
            }

        q_lower = query.lower().strip()

        # Context-aware query processing
        if app_context:
            app_id = app_context.get('application_id', '')
            status = app_context.get('status', '')
            risk_level = app_context.get('risk_level', '')
            mismatches = app_context.get('mismatches', [])

            if "why" in q_lower and ("review" in q_lower or "flagged" in q_lower or "high" in q_lower):
                if mismatches:
                    fields = ", ".join([m.get('field_name', '').replace('_', ' ') for m in mismatches])
                    return {
                        "answer": f"Application {app_id} is under review because discrepancies were found in: {fields}. Please check the verification matrix for details.",
                        "language": "en"
                    }
                elif risk_level == "HIGH" or risk_level == "CRITICAL":
                    return {
                        "answer": f"Application {app_id} has a high risk score ({app_context.get('risk_score')}/100) due to potential duplicate filing or document integrity flags.",
                        "language": "en"
                    }
                else:
                    return {
                        "answer": f"Application {app_id} is currently in state '{status}' with risk level '{risk_level}'. Final approval is pending officer review.",
                        "language": "en"
                    }

        # Knowledge Base matching
        for key, val in self.FAQ_KNOWLEDGE_BASE.items():
            if key in q_lower:
                return {
                    "answer": val,
                    "language": "ta" if key == "tamil" else "en"
                }

        # Fallback response
        return {
            "answer": "LandGuard AI is designed to assist in land document cross-verification across Patta, Chitta, EC, and Sale Deed. For specific case details, please view the Verification Dashboard.",
            "language": "en"
        }
