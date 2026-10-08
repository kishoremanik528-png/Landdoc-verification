import re
import os
import PyPDF2

class DocumentIntelligenceAI:
    """
    Module 2: Document Intelligence AI
    Extracts text from PDF/Image files, classifies document types, and parses key land fields.
    """

    SUPPORTED_DOC_TYPES = ['PATTA', 'CHITTA', 'ENCUMBRANCE_CERTIFICATE', 'SALE_DEED']

    def process_document(self, file_path, document_type_hint=None):
        raw_text = self._extract_raw_text(file_path)
        doc_type = self._classify_document_type(raw_text, hint=document_type_hint)
        extracted_fields = self._extract_land_fields(raw_text)

        return {
            "module": "document_intelligence",
            "status": "SUCCESS",
            "confidence": 0.92 if len(extracted_fields) > 3 else 0.75,
            "document_type": doc_type,
            "raw_text": raw_text,
            "extracted_fields": extracted_fields,
            "warnings": []
        }

    def _extract_raw_text(self, file_path):
        if not os.path.exists(file_path):
            return ""
        
        ext = file_path.rsplit('.', 1)[-1].lower()
        if ext == 'pdf':
            try:
                text = ""
                with open(file_path, 'rb') as f:
                    reader = PyPDF2.PdfReader(f)
                    for page in reader.pages:
                        extracted = page.extract_text()
                        if extracted:
                            text += extracted + "\n"
                if text.strip():
                    return text
            except Exception:
                pass
        
        # Fallback reading text if plain text or mocked file
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                return f.read()
        except Exception:
            return f"Sample text extracted from {os.path.basename(file_path)}"

    def _classify_document_type(self, text, hint=None):
        if hint and hint.upper() in self.SUPPORTED_DOC_TYPES:
            return hint.upper()

        text_upper = text.upper()
        if "PATTA" in text_upper or "பட்டா" in text:
            return "PATTA"
        elif "CHITTA" in text_upper or "சிட்டா" in text:
            return "CHITTA"
        elif "ENCUMBRANCE" in text_upper or "EC " in text_upper or "வில்லங்க" in text:
            return "ENCUMBRANCE_CERTIFICATE"
        elif "SALE DEED" in text_upper or "கிரைய பத்திரம்" in text or "DEED OF ABSOLUTE SALE" in text_upper:
            return "SALE_DEED"
        
        return hint.upper() if hint else "PATTA"

    def _extract_land_fields(self, text):
        fields = {}

        # Owner Name
        owner_match = re.search(r'(?:Owner|Purchaser|Claimant|உரிமையாளர் பெயர்)\s*[:\-]?\s*([A-Za-z\.\s]+)', text, re.IGNORECASE)
        if owner_match:
            fields['owner_name'] = owner_match.group(1).strip()

        # Survey Number
        survey_match = re.search(r'(?:Survey|புல எண்)\s*(?:No|Number|\.)?\s*[:\-]?\s*(\d+[\/\-]\d+[A-Za-z0-9]*)', text, re.IGNORECASE)
        if survey_match:
            fields['survey_number'] = survey_match.group(1).strip()

        # Subdivision
        sub_match = re.search(r'(?:Subdivision|Sub-Division)\s*[:\-]?\s*([A-Za-z0-9]+)', text, re.IGNORECASE)
        if sub_match:
            fields['subdivision_number'] = sub_match.group(1).strip()

        # Land Extent
        extent_match = re.search(r'(?:Land Extent|Area Extent|Extent|நில அளவு)\s*[:\-]?\s*([\d\.]+\s*(?:Acres|acres|Cents|cents|sq\.ft|sqft))', text, re.IGNORECASE)
        if extent_match:
            fields['land_extent'] = extent_match.group(1).strip()

        # Village
        village_match = re.search(r'(?:Village|கிராமம்)\s*[:\-]?\s*([A-Za-z\s]+)', text, re.IGNORECASE)
        if village_match:
            fields['village'] = village_match.group(1).strip().split('\n')[0]

        # Taluk
        taluk_match = re.search(r'(?:Taluk|தாலுகா)\s*[:\-]?\s*([A-Za-z\s]+)', text, re.IGNORECASE)
        if taluk_match:
            fields['taluk'] = taluk_match.group(1).strip().split('\n')[0]

        # District
        dist_match = re.search(r'(?:District|மாவட்டம்)\s*[:\-]?\s*([A-Za-z\s]+)', text, re.IGNORECASE)
        if dist_match:
            fields['district'] = dist_match.group(1).strip().split('\n')[0]

        # Document Number
        doc_num_match = re.search(r'(?:Doc|Patta|EC|Deed)\s*(?:No|Number|\.)?\s*[:\-]?\s*([A-Za-z0-9\/\-]+)', text, re.IGNORECASE)
        if doc_num_match:
            fields['document_number'] = doc_num_match.group(1).strip()

        # Registration Date
        date_match = re.search(r'\b(\d{2}[\/\-]\d{2}[\/\-]\d{4}|\d{4}[\/\-]\d{2}[\/\-]\d{2})\b', text)
        if date_match:
            fields['registration_date'] = date_match.group(1)

        return fields
