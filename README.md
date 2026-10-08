# 🛡️ LANDGUARD AI
### AI-Assisted Land Document Verification & Risk Analysis Platform for Government Officers

---

## 📌 Problem Statement
Government verification officers (VAOs, Revenue Inspectors, Surveyors, Tahsildars) manually process and cross-verify large volumes of complex land documents — such as **Pattas, Chittas, Sale Deeds, and Encumbrance Certificates (ECs)**. Comparing survey numbers, subdivisions, extent measurements, and ownership records across multiple deeds is repetitive, time-consuming, and prone to human oversight.

---

## 💡 Solution: LANDGUARD AI
**LANDGUARD AI** is an intelligent decision-support system designed specifically for authorized government officers. It automates document processing, OCR extraction, field normalization, cross-document verification, duplicate detection, tampering inspection, and transparent risk scoring.

> ⚖️ **Important Disclaimer**: LANDGUARD AI is a decision-support assistant only. The AI system does **NOT** make legal ownership decisions. All final approvals remain strictly with authorized human government officers.

---

## 🏗️ Architecture & Technology Stack

```
GOVERNMENT OFFICER
        │
REACT FRONTEND (Vite, JS, Modern CSS)
        │
FLASK REST API (Python, SQLAlchemy, SQLite)
        │
AI ORCHESTRATOR (ai_modules/)
 ├── Document Intelligence (OCR & Regex)
 ├── Multilingual Processor (Tamil / English)
 ├── Data Normalization & Semantic Matcher
 ├── Cross-Document Verifier (Patta vs Chitta vs Sale Deed)
 ├── Security Engine (Duplicate Detection & Tampering)
 ├── Advanced Graph & Ownership Chain Analyzer
 └── Risk & Explanation Engine (Weighted Scoring 0-100)
        │
OFFICER WORKFLOW & 4-PAGE PDF GENERATION
```

### Stack Components:
- **Frontend**: React, Vite, JavaScript, Modern CSS / Tailwind, Lucide React icons.
- **Backend**: Python 3.14, Flask, Flask-CORS, SQLAlchemy ORM.
- **Database**: SQLite (SQL architecture ready for PostgreSQL migration).
- **PDF Generation**: ReportLab (4-Page Prototype Verification Draft).

---

## ⚡ Quick Start & Setup Instructions

### 1. Backend Setup
```bash
cd backend
# Create virtual environment (optional)
python -m venv .venv
.venv\Scripts\activate # On Windows

# Install requirements
pip install -r requirements.txt
pip install reportlab

# Run Flask server
python app.py
```
*(Backend runs on `http://127.0.0.1:5000`)*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*(Frontend runs on `http://localhost:5173`)*

---

## 🧪 Demo Scenarios (1-Click Test Suite)

LANDGUARD AI includes 5 pre-configured hackathon demo scenarios:

| Scenario | Description | Expected Risk Level |
| :--- | :--- | :--- |
| **Scenario 1** | Clean Cross-Verification (All deeds match) | **LOW (Score: 0)** |
| **Scenario 2** | Critical Survey Number Mismatch (`142/3B` vs `142/3C`) | **HIGH (Score: 50)** |
| **Scenario 3** | Duplicate Application Alert (Same survey number registered) | **MEDIUM (Score: 25)** |
| **Scenario 4** | Ownership Chain History Gap (Missing transaction in EC) | **LOW (Score: 15)** |
| **Scenario 5** | Document Alteration & Tampering Flag (Metadata anomaly) | **HIGH (Score: 50)** |

---

## 📄 4-Page Verification Draft PDF

When an application verification is completed, the system generates a downloadable **4-Page Verification Draft PDF**:
1. **Page 1**: Rules & Verification Conditions & Legal Disclaimer.
2. **Page 2**: Registration, Applicant Details & Property Parcel Table.
3. **Page 3**: AI Cross-Document Verification Summary (Matches vs Mismatches).
4. **Page 4**: Multi-Tier Officer Signature & Stamp Placeholders (VO, VAO, RI, Surveyor, Tahsildar, Applicant).

---

## ⚖️ Ethical AI & Human-in-the-loop

- Every AI-extracted field can be confirmed, edited, or overridden by officers.
- Both original AI values and officer-corrected values are permanently recorded in `data_corrections` for complete auditability.
- No legal ownership decisions are automated.
