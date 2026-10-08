import re
import difflib

def normalize_text(text):
    if not text:
        return ""
    text = str(text).strip()
    text = re.sub(r'\s+', ' ', text)
    return text

def calculate_fuzzy_similarity(str1, str2):
    if not str1 or not str2:
        return 0.0
    s1 = normalize_text(str1).lower()
    s2 = normalize_text(str2).lower()
    if s1 == s2:
        return 1.0
    return round(difflib.SequenceMatcher(None, s1, s2).ratio(), 2)

def extract_survey_number(text):
    if not text:
        return None
    match = re.search(r'\b\d+[\/\-]\d+[A-Za-z0-9]*\b', text)
    if match:
        return match.group(0)
    return None
