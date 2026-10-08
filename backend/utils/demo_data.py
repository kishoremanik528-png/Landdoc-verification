DEMO_SCENARIOS = {
    "scenario_1": {
        "title": "Scenario 1: Clean Cross-Verification (Normal)",
        "description": "All submitted land documents (Patta, Chitta, EC, Sale Deed) contain matching ownership, survey numbers, and boundaries.",
        "expected_risk": "LOW",
        "applicant": "Kishore Kumar",
        "documents": [
            {
                "type": "PATTA",
                "filename": "patta_123_2a.pdf",
                "raw_text": "TAMIL NADU LAND REVENUE DEPARTMENT\nPATTA PASSBOOK (பட்டா பாஸ் புத்தகம்)\nPatta No: PAT-2024-8812\nOwner Name (உரிமையாளர் பெயர்): Kishore Kumar S/O Sundaram\nSurvey No (புல எண்): 123/2A\nSubdivision: 2A\nLand Extent (நில அளவு): 2.50 Acres (2 ஏக்கர் 50 சென்ட்)\nVillage (கிராமம்): Velachery\nTaluk (தாலுகா): Guindy\nDistrict (மாவட்டம்): Chennai\nRegistration Date: 12-01-2021",
                "fields": {
                    "owner_name": "Kishore Kumar",
                    "survey_number": "123/2A",
                    "subdivision_number": "2A",
                    "land_extent": "2.50 acres",
                    "village": "Velachery",
                    "taluk": "Guindy",
                    "district": "Chennai",
                    "document_number": "PAT-2024-8812",
                    "registration_date": "2021-01-12",
                    "property_boundaries": "North: Road, South: Canal, East: Plot 14, West: Survey 123/1"
                }
            },
            {
                "type": "CHITTA",
                "filename": "chitta_extract.pdf",
                "raw_text": "REVENUE RECORD - CHITTA EXTRACT\nLand Registry Book 4, Page 112\nOwner: Kishore Kumar\nSurvey Number: 123/2A\nSub-Division: 2A\nArea Extent: 2.50 Acres\nVillage: Velachery\nTaluk: Guindy\nDistrict: Chennai\nSoil Classification: Dry Land Class I",
                "fields": {
                    "owner_name": "Kishore Kumar",
                    "survey_number": "123/2A",
                    "subdivision_number": "2A",
                    "land_extent": "2.50 acres",
                    "village": "Velachery",
                    "taluk": "Guindy",
                    "district": "Chennai",
                    "document_number": "CHT-112-2021",
                    "registration_date": "2021-01-12",
                    "property_boundaries": "North: Road, South: Canal, East: Plot 14, West: Survey 123/1"
                }
            },
            {
                "type": "ENCUMBRANCE_CERTIFICATE",
                "filename": "encumbrance_certificate_ec.pdf",
                "raw_text": "REGISTRATION DEPARTMENT - TAMIL NADU\nENCUMBRANCE CERTIFICATE (வில்லங்க சான்றிதழ்)\nEC No: EC-2024-00912\nSearch Period: 01-Jan-2010 to 01-Jan-2025\nProperty Location: Survey 123/2A, Velachery Village\nExecution Date: 12-Jan-2021\nClaimant: Kishore Kumar\nExecutant: Ramasamy Naidu\nLand Area: 2.50 Acres\nEncumbrance Details: NIL (No Mortgages or Liabilities)",
                "fields": {
                    "owner_name": "Kishore Kumar",
                    "survey_number": "123/2A",
                    "subdivision_number": "2A",
                    "land_extent": "2.50 acres",
                    "village": "Velachery",
                    "taluk": "Guindy",
                    "district": "Chennai",
                    "document_number": "EC-2024-00912",
                    "registration_date": "2021-01-12",
                    "property_boundaries": "North: Main Road, South: Drainage Canal, East: Plot 14, West: Survey 123/1"
                }
            },
            {
                "type": "SALE_DEED",
                "filename": "sale_deed_registered.pdf",
                "raw_text": "DEED OF ABSOLUTE SALE\nDoc No: 1042/2021, SRO Guindy\nPurchaser: Kishore Kumar S/O Sundaram\nVendor: Ramasamy Naidu S/O Venkatraman\nProperty Description: All that piece and parcel of land in Survey No. 123/2A, measuring 2.50 Acres situated at Velachery Village, Guindy Taluk, Chennai District.",
                "fields": {
                    "owner_name": "Kishore Kumar",
                    "survey_number": "123/2A",
                    "subdivision_number": "2A",
                    "land_extent": "2.50 acres",
                    "village": "Velachery",
                    "taluk": "Guindy",
                    "district": "Chennai",
                    "document_number": "1042/2021",
                    "registration_date": "2021-01-12",
                    "property_boundaries": "North: Road, South: Canal, East: Plot 14, West: Survey 123/1"
                }
            }
        ],
        "ownership_chain": [
            {"sequence_order": 1, "owner_name": "Ramasamy Naidu", "previous_owner": "Venkatraman Naidu", "transfer_date": "2005-04-10", "source_document": "Parent Deed 442/2005"},
            {"sequence_order": 2, "owner_name": "Kishore Kumar", "previous_owner": "Ramasamy Naidu", "transfer_date": "2021-01-12", "source_document": "Sale Deed 1042/2021"}
        ]
    },
    "scenario_2": {
        "title": "Scenario 2: Critical Survey Number Mismatch",
        "description": "High risk anomaly where Patta & EC specify Survey 142/3B, but the Sale Deed claims Survey 142/3C.",
        "expected_risk": "HIGH",
        "applicant": "Subramanian V.",
        "documents": [
            {
                "type": "PATTA",
                "filename": "patta_142_3b.pdf",
                "raw_text": "PATTA EXTRACT\nPatta No: 4491\nOwner: Subramanian V.\nSurvey No: 142/3B\nLand Extent: 1.80 Acres\nVillage: Tambaram\nTaluk: Tambaram\nDistrict: Chengalpattu",
                "fields": {
                    "owner_name": "Subramanian V.",
                    "survey_number": "142/3B",
                    "subdivision_number": "3B",
                    "land_extent": "1.80 acres",
                    "village": "Tambaram",
                    "taluk": "Tambaram",
                    "district": "Chengalpattu",
                    "document_number": "PAT-4491",
                    "registration_date": "2019-05-20"
                }
            },
            {
                "type": "CHITTA",
                "filename": "chitta_tambaram.pdf",
                "raw_text": "CHITTA EXTRACT\nOwner: Subramanian V.\nSurvey No: 142/3B\nExtent: 1.80 Acres\nVillage: Tambaram",
                "fields": {
                    "owner_name": "Subramanian V.",
                    "survey_number": "142/3B",
                    "subdivision_number": "3B",
                    "land_extent": "1.80 acres",
                    "village": "Tambaram",
                    "taluk": "Tambaram",
                    "district": "Chengalpattu",
                    "document_number": "CHT-882",
                    "registration_date": "2019-05-20"
                }
            },
            {
                "type": "SALE_DEED",
                "filename": "sale_deed_conflicting.pdf",
                "raw_text": "SALE DEED 2210/2019 SRO Tambaram\nPurchaser: Subramanian V.\nProperty: Land in Survey No. 142/3C (MISMATCH), Extent: 1.80 Acres, Tambaram Village.",
                "fields": {
                    "owner_name": "Subramanian V.",
                    "survey_number": "142/3C",
                    "subdivision_number": "3C",
                    "land_extent": "1.80 acres",
                    "village": "Tambaram",
                    "taluk": "Tambaram",
                    "district": "Chengalpattu",
                    "document_number": "2210/2019",
                    "registration_date": "2019-05-20"
                }
            }
        ],
        "ownership_chain": [
            {"sequence_order": 1, "owner_name": "Subramanian V.", "previous_owner": "Unknown Vendor", "transfer_date": "2019-05-20", "source_document": "Sale Deed 2210/2019"}
        ]
    },
    "scenario_3": {
        "title": "Scenario 3: Duplicate Application Alert",
        "description": "System detects that an identical land parcel (Survey 88/1A in Sriperumbudur) was already submitted in Application APP-2024-8891.",
        "expected_risk": "HIGH",
        "applicant": "Anand S.",
        "documents": [
            {
                "type": "PATTA",
                "filename": "patta_duplicate.pdf",
                "raw_text": "PATTA PASSBOOK\nOwner: Anand S.\nSurvey No: 88/1A\nLand Extent: 3.10 Acres\nVillage: Sriperumbudur",
                "fields": {
                    "owner_name": "Anand S.",
                    "survey_number": "88/1A",
                    "subdivision_number": "1A",
                    "land_extent": "3.10 acres",
                    "village": "Sriperumbudur",
                    "taluk": "Sriperumbudur",
                    "district": "Kanchipuram",
                    "document_number": "PAT-881A",
                    "registration_date": "2023-11-04"
                }
            },
            {
                "type": "SALE_DEED",
                "filename": "sale_deed_duplicate.pdf",
                "raw_text": "SALE DEED 4410/2023\nPurchaser: Anand S.\nProperty: Survey No 88/1A, Sriperumbudur, 3.10 Acres.",
                "fields": {
                    "owner_name": "Anand S.",
                    "survey_number": "88/1A",
                    "subdivision_number": "1A",
                    "land_extent": "3.10 acres",
                    "village": "Sriperumbudur",
                    "taluk": "Sriperumbudur",
                    "district": "Kanchipuram",
                    "document_number": "4410/2023",
                    "registration_date": "2023-11-04"
                }
            }
        ],
        "ownership_chain": [
            {"sequence_order": 1, "owner_name": "Anand S.", "previous_owner": "Kannan M.", "transfer_date": "2023-11-04", "source_document": "Sale Deed 4410/2023"}
        ]
    },
    "scenario_4": {
        "title": "Scenario 4: Ownership Chain History Gap",
        "description": "Historical deed sequence is missing a verified transfer deed between Owner B (Murugan) and Owner D (Senthil Nathan).",
        "expected_risk": "MEDIUM",
        "applicant": "Senthil Nathan",
        "documents": [
            {
                "type": "PATTA",
                "filename": "patta_chain_gap.pdf",
                "raw_text": "PATTA EXTRACT\nOwner: Senthil Nathan\nSurvey No: 301/4\nExtent: 4.20 Acres\nVillage: Sholinganallur",
                "fields": {
                    "owner_name": "Senthil Nathan",
                    "survey_number": "301/4",
                    "subdivision_number": "4",
                    "land_extent": "4.20 acres",
                    "village": "Sholinganallur",
                    "taluk": "Sholinganallur",
                    "district": "Chennai",
                    "document_number": "PAT-3014",
                    "registration_date": "2022-08-15"
                }
            },
            {
                "type": "ENCUMBRANCE_CERTIFICATE",
                "filename": "ec_chain_gap.pdf",
                "raw_text": "ENCUMBRANCE CERTIFICATE\nProperty: Survey 301/4, Sholinganallur\n1995: Ramasamy to Murugan (Sale Deed 120/1995)\n2022: Senthil Nathan claims ownership (Sale Deed 3102/2022)\nWARNING: No transfer record found between Murugan and Senthil Nathan from 1995 to 2022.",
                "fields": {
                    "owner_name": "Senthil Nathan",
                    "survey_number": "301/4",
                    "subdivision_number": "4",
                    "land_extent": "4.20 acres",
                    "village": "Sholinganallur",
                    "taluk": "Sholinganallur",
                    "district": "Chennai",
                    "document_number": "EC-3014-2024",
                    "registration_date": "2022-08-15"
                }
            }
        ],
        "ownership_chain": [
            {"sequence_order": 1, "owner_name": "Ramasamy", "previous_owner": "Original Allottee", "transfer_date": "1980-01-10", "source_document": "Deed 11/1980"},
            {"sequence_order": 2, "owner_name": "Murugan", "previous_owner": "Ramasamy", "transfer_date": "1995-03-22", "source_document": "Sale Deed 120/1995"},
            {"sequence_order": 3, "owner_name": "[UNVERIFIED TRANSITION GAP]", "previous_owner": "Murugan", "transfer_date": "UNKNOWN", "source_document": "MISSING_DEED"},
            {"sequence_order": 4, "owner_name": "Senthil Nathan", "previous_owner": "Unverified Source", "transfer_date": "2022-08-15", "source_document": "Sale Deed 3102/2022"}
        ]
    },
    "scenario_5": {
        "title": "Scenario 5: Document Alteration & Tampering Flag",
        "description": "PDF Document Integrity scanner detected font size variance anomalies and metadata modification flags in the uploaded Sale Deed copy.",
        "expected_risk": "HIGH",
        "applicant": "Dinesh Kumar",
        "documents": [
            {
                "type": "PATTA",
                "filename": "patta_dinesh.pdf",
                "raw_text": "PATTA EXTRACT\nOwner: Dinesh Kumar\nSurvey No: 55/2\nExtent: 0.75 Acres\nVillage: Porur",
                "fields": {
                    "owner_name": "Dinesh Kumar",
                    "survey_number": "55/2",
                    "subdivision_number": "2",
                    "land_extent": "0.75 acres",
                    "village": "Porur",
                    "taluk": "Maduravoyal",
                    "district": "Tiruvallur",
                    "document_number": "PAT-552",
                    "registration_date": "2020-02-14"
                }
            },
            {
                "type": "SALE_DEED",
                "filename": "sale_deed_altered_copy.pdf",
                "raw_text": "SALE DEED 771/2020\nPurchaser: Dinesh Kumar\nProperty: Survey No. 55/2, Porur, Extent: 5.75 Acres (ALTERED FONT DETECTED).\nSoftware: Adobe Photoshop CS6 (Edited PDF)",
                "fields": {
                    "owner_name": "Dinesh Kumar",
                    "survey_number": "55/2",
                    "subdivision_number": "2",
                    "land_extent": "5.75 acres",
                    "village": "Porur",
                    "taluk": "Maduravoyal",
                    "district": "Tiruvallur",
                    "document_number": "771/2020",
                    "registration_date": "2020-02-14"
                }
            }
        ],
        "ownership_chain": [
            {"sequence_order": 1, "owner_name": "Dinesh Kumar", "previous_owner": "Prakash R.", "transfer_date": "2020-02-14", "source_document": "Sale Deed 771/2020"}
        ]
    }
}
