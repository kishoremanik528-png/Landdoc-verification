import os
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
)
from models.application import Application
from models.document import Document
from models.verification_result import VerificationResult
from models.risk_analysis import RiskAnalysis
from models.extracted_field import ExtractedField
from models.data_correction import DataCorrection
from models.workflow_approval import WorkflowApproval
from models.officer import Officer

class PDFService:
    def __init__(self, output_dir="generated_pdfs"):
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)

    def get_best_field_value(self, app_id, field_name):
        """
        Priority field resolution helper:
        1. Officer-corrected value (DataCorrection)
        2. Verified / normalized value (ExtractedField / VerificationResult)
        3. Original extracted value (ExtractedField)
        4. Application-level attribute
        5. Default: "Not Available"
        """
        # 1. Check Officer Correction
        correction = DataCorrection.query.filter_by(
            application_id=app_id, field_name=field_name
        ).order_by(DataCorrection.corrected_at.desc()).first()
        if correction and correction.officer_corrected_value:
            return correction.officer_corrected_value

        # 2. Check Extracted & Normalized Fields across documents
        docs = Document.query.filter_by(application_id=app_id).all()
        for doc in docs:
            field = ExtractedField.query.filter_by(
                document_id=doc.id, field_name=field_name
            ).first()
            if field:
                if field.normalized_value:
                    return field.normalized_value
                if field.original_value:
                    return field.original_value

        # 3. Check Application Record attribute if applicable
        app = Application.query.get(app_id) if isinstance(app_id, int) else Application.query.filter_by(id=app_id).first()
        if app and hasattr(app, field_name):
            val = getattr(app, field_name)
            if val:
                return str(val)

        return "Not Available"

    def get_location_details(self, app):
        district = self.get_best_field_value(app.id, 'district')
        taluk = self.get_best_field_value(app.id, 'taluk')
        village = self.get_best_field_value(app.id, 'village')
        return {
            "district": district,
            "taluk": taluk,
            "village": village
        }

    def get_land_holder_details(self, app):
        name = app.applicant_name or self.get_best_field_value(app.id, 'owner_name')
        guardian = self.get_best_field_value(app.id, 'guardian_name')
        address = self.get_best_field_value(app.id, 'address')
        return {
            "applicant_name": name if name != "Not Available" else "Not Provided",
            "guardian_name": guardian,
            "address": address,
            "application_id": app.application_id
        }

    def get_property_details(self, app):
        return {
            "patta_number": self.get_best_field_value(app.id, 'patta_number'),
            "survey_number": self.get_best_field_value(app.id, 'survey_number'),
            "subdivision_number": self.get_best_field_value(app.id, 'subdivision_number'),
            "classification": self.get_best_field_value(app.id, 'land_classification'),
            "extent": self.get_best_field_value(app.id, 'land_extent'),
            "property_type": self.get_best_field_value(app.id, 'property_type'),
            "doc_reference": self.get_best_field_value(app.id, 'document_number')
        }

    def get_property_boundaries(self, app):
        return {
            "north": self.get_best_field_value(app.id, 'boundary_north'),
            "south": self.get_best_field_value(app.id, 'boundary_south'),
            "east": self.get_best_field_value(app.id, 'boundary_east'),
            "west": self.get_best_field_value(app.id, 'boundary_west')
        }

    def generate_verification_pdf(self, application_id):
        app = Application.query.filter_by(application_id=application_id).first()
        if not app:
            return {"status": "ERROR", "message": "Application not found"}

        filename = f"{application_id}_verification_draft.pdf"
        filepath = os.path.join(self.output_dir, filename)

        doc = SimpleDocTemplate(
            filepath,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'DocTitle',
            parent=styles['Heading1'],
            fontSize=15,
            leading=18,
            textColor=colors.HexColor('#0B3D91'),
            alignment=1, # Center
            spaceAfter=4
        )
        subtitle_style = ParagraphStyle(
            'DocSubtitle',
            parent=styles['Normal'],
            fontSize=9,
            leading=12,
            textColor=colors.HexColor('#2563EB'),
            alignment=1,
            spaceAfter=10
        )
        section_heading = ParagraphStyle(
            'SectionHeading',
            parent=styles['Heading2'],
            fontSize=11,
            leading=14,
            textColor=colors.HexColor('#0F172A'),
            spaceBefore=10,
            spaceAfter=6,
            fontWeight='bold'
        )
        body_style = ParagraphStyle(
            'BodyTextCustom',
            parent=styles['Normal'],
            fontSize=8.5,
            leading=12,
            textColor=colors.HexColor('#1E293B'),
            spaceAfter=4
        )
        label_style = ParagraphStyle(
            'LabelCustom',
            parent=body_style,
            fontWeight='bold',
            textColor=colors.HexColor('#0F172A')
        )

        elements = []

        def header_banner():
            return [
                Paragraph("<b>GOVERNMENT OF TAMIL NADU — REVENUE & REGISTRATION DEPARTMENT</b>", ParagraphStyle('GovHeader', parent=title_style, fontSize=10, leading=12, textColor=colors.HexColor('#0B3D91'))),
                Paragraph("<b>LANDGUARD AI — AI-ASSISTED LAND DOCUMENT VERIFICATION</b>", title_style),
                Paragraph("<b>OFFICER REVIEW COPY — NOT AN OFFICIAL LEGAL TITLE DEED</b>", subtitle_style),
                HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#0B3D91'), spaceAfter=10)
            ]

        def footer_disclaimer():
            return Paragraph("<i>LANDGUARD AI | AI-Assisted Land Verification | Officer Review Copy — Final legal decisions remain with authorized government officials.</i>", ParagraphStyle('FooterDisc', parent=styles['Normal'], fontSize=7.5, leading=10, textColor=colors.HexColor('#64748B'), alignment=1))

        # =========================================================
        # PAGE 1: RULES & VERIFICATION CONDITIONS
        # =========================================================
        elements.extend(header_banner())
        elements.append(Paragraph("<b>PAGE 1: RULES & VERIFICATION CONDITIONS</b>", section_heading))
        
        rules_text = [
            "<b>1. Verification Purpose:</b> LANDGUARD AI assists government verification officers (VAOs, Revenue Inspectors, Surveyors, Tahsildars) in extracting and cross-verifying land records from Pattas, Chittas, ECs, and Sale Deeds.",
            "<b>2. Human-in-the-Loop Policy:</b> AI findings are decision-support recommendations only. The AI system DOES NOT make final legal ownership determinations. Final legal decisions remain strictly with authorized human officers.",
            "<b>3. Document Consistency Requirement:</b> All submitted land documents must contain consistent survey numbers, subdivision bounds, applicant names, and extent measurements across registered deeds.",
            "<b>4. Mismatch Handling:</b> Any discrepancies flagged in red (MISMATCH) or yellow (REVIEW) must be physically verified against state revenue registries before Tahsildar approval.",
            "<b>5. Data Correction Protocol:</b> Officers may override or correct AI-extracted values. All corrections are logged permanently with Officer ID, timestamp, original value, and justification reason.",
            "<b>6. Multi-Level Authorization Workflow:</b> Approval requires multi-tier digital/physical sign-offs from the Verification Officer, VAO, Revenue Inspector, Survey Officer, and Tahsildar.",
            "<b>7. Hackathon Prototype & System Disclaimer:</b> This document is generated for hackathon demonstration. It is an AI-assisted verification draft for officer review and does not replace official state revenue seals or manual registry entries."
        ]

        for rule in rules_text:
            elements.append(Paragraph(rule, body_style))
            elements.append(Spacer(1, 3))

        elements.append(Spacer(1, 12))
        elements.append(Paragraph("<b>OFFICER VERIFICATION ACKNOWLEDGEMENT</b>", section_heading))
        elements.append(Paragraph("I hereby confirm that I have reviewed the AI-assisted extraction findings, cross-verification matrix, and property boundary checks documented herein in accordance with Tamil Nadu Revenue Department protocols.", body_style))
        
        elements.append(Spacer(1, 15))
        ack_table = Table([
            [Paragraph("<b>Review Officer Name:</b> ___________________________", body_style), Paragraph("<b>Officer ID:</b> ___________________________", body_style)],
            [Paragraph("<b>Designation:</b> ___________________________", body_style), Paragraph("<b>Date:</b> ___________________________", body_style)],
            [Paragraph("<b>Signature:</b> ___________________________", body_style), Paragraph("<b>Official Stamp:</b> [ SEAL PLACEHOLDER ]", body_style)]
        ], colWidths=[270, 270])
        ack_table.setStyle(TableStyle([
            ('PADDING', (0,0), (-1,-1), 6),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1'))
        ]))
        elements.append(ack_table)
        elements.append(Spacer(1, 15))
        elements.append(footer_disclaimer())

        elements.append(PageBreak())

        # =========================================================
        # PAGE 2: PATTA-INSPIRED LAND RECORD & PROPERTY DETAILS
        # =========================================================
        elements.extend(header_banner())
        elements.append(Paragraph("<b>PAGE 2: PATTA-INSPIRED LAND RECORD & PROPERTY DETAILS</b>", section_heading))

        loc = self.get_location_details(app)
        holder = self.get_land_holder_details(app)
        prop = self.get_property_details(app)
        bounds = self.get_property_boundaries(app)

        # Location Section
        elements.append(Paragraph("<b>SECTION 1: LOCATION DETAILS</b>", label_style))
        loc_table = Table([
            [Paragraph("<b>District:</b>", label_style), Paragraph(loc["district"], body_style),
             Paragraph("<b>Taluk:</b>", label_style), Paragraph(loc["taluk"], body_style),
             Paragraph("<b>Village:</b>", label_style), Paragraph(loc["village"], body_style)]
        ], colWidths=[70, 110, 60, 110, 60, 130])
        loc_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
            ('PADDING', (0,0), (-1,-1), 5)
        ]))
        elements.append(loc_table)
        elements.append(Spacer(1, 10))

        # Land Holder Section
        elements.append(Paragraph("<b>SECTION 2: LAND HOLDER DETAILS</b>", label_style))
        holder_table = Table([
            [Paragraph("<b>Applicant / Owner Name:</b>", label_style), Paragraph(holder["applicant_name"], body_style)],
            [Paragraph("<b>Guardian / Father Name:</b>", label_style), Paragraph(holder["guardian_name"], body_style)],
            [Paragraph("<b>Communication Address:</b>", label_style), Paragraph(holder["address"], body_style)],
            [Paragraph("<b>Application Ref Number:</b>", label_style), Paragraph(holder["application_id"], body_style)]
        ], colWidths=[160, 380])
        holder_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FFFFFF')),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
            ('PADDING', (0,0), (-1,-1), 5)
        ]))
        elements.append(holder_table)
        elements.append(Spacer(1, 10))

        # Property Details Section
        elements.append(Paragraph("<b>SECTION 3: LAND & PROPERTY DETAILS</b>", label_style))
        prop_table = Table([
            [Paragraph("<b>Patta Ref Number:</b>", label_style), Paragraph(prop["patta_number"], body_style),
             Paragraph("<b>Survey Number:</b>", label_style), Paragraph(prop["survey_number"], body_style)],
            [Paragraph("<b>Subdivision Number:</b>", label_style), Paragraph(prop["subdivision_number"], body_style),
             Paragraph("<b>Land Classification:</b>", label_style), Paragraph(prop["classification"], body_style)],
            [Paragraph("<b>Land Extent:</b>", label_style), Paragraph(prop["extent"], body_style),
             Paragraph("<b>Property Type:</b>", label_style), Paragraph(prop["property_type"], body_style)],
            [Paragraph("<b>Doc Reference No:</b>", label_style), Paragraph(prop["doc_reference"], body_style),
             Paragraph("<b>Verification Status:</b>", label_style), Paragraph(app.status or "CREATED", body_style)]
        ], colWidths=[130, 140, 130, 140])
        prop_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
            ('PADDING', (0,0), (-1,-1), 5)
        ]))
        elements.append(prop_table)
        elements.append(Spacer(1, 10))

        # Boundaries Section
        elements.append(Paragraph("<b>SECTION 4: PROPERTY BOUNDARIES</b>", label_style))
        bound_table = Table([
            [Paragraph("<b>North Boundary:</b>", label_style), Paragraph(bounds["north"], body_style),
             Paragraph("<b>South Boundary:</b>", label_style), Paragraph(bounds["south"], body_style)],
            [Paragraph("<b>East Boundary:</b>", label_style), Paragraph(bounds["east"], body_style),
             Paragraph("<b>West Boundary:</b>", label_style), Paragraph(bounds["west"], body_style)]
        ], colWidths=[130, 140, 130, 140])
        bound_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FFFFFF')),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
            ('PADDING', (0,0), (-1,-1), 5)
        ]))
        elements.append(bound_table)
        elements.append(Spacer(1, 10))

        # Application Summary Section
        elements.append(Paragraph("<b>SECTION 5: APPLICATION & VERIFICATION SUMMARY</b>", label_style))
        summary_table = Table([
            [Paragraph("<b>Application ID:</b>", label_style), Paragraph(app.application_id, body_style),
             Paragraph("<b>Risk Score / Level:</b>", label_style), Paragraph(f"{app.risk_score or 0}/100 ({app.risk_level or 'LOW'})", body_style)],
            [Paragraph("<b>Processing Status:</b>", label_style), Paragraph(app.processing_status or "COMPLETED", body_style),
             Paragraph("<b>Generated Date:</b>", label_style), Paragraph(datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"), body_style)]
        ], colWidths=[130, 140, 130, 140])
        summary_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
            ('PADDING', (0,0), (-1,-1), 5)
        ]))
        elements.append(summary_table)
        elements.append(Spacer(1, 15))
        elements.append(footer_disclaimer())

        elements.append(PageBreak())

        # =========================================================
        # PAGE 3: AI VERIFICATION & RECTIFICATION REPORT
        # =========================================================
        elements.extend(header_banner())
        elements.append(Paragraph("<b>PAGE 3: AI VERIFICATION & RECTIFICATION REPORT</b>", section_heading))

        v_results = VerificationResult.query.filter_by(application_id=app.id).all()
        corrections = DataCorrection.query.filter_by(application_id=app.id).all()

        # Section 1: Summary Counts
        matches_count = sum(1 for v in v_results if v.verification_status == 'MATCH')
        possible_count = sum(1 for v in v_results if v.verification_status == 'POSSIBLE_MATCH')
        mismatches_count = sum(1 for v in v_results if v.verification_status == 'MISMATCH')

        summary_counts_table = Table([
            [Paragraph("<b>Total Fields Verified:</b>", label_style), Paragraph(str(len(v_results) or 7), body_style),
             Paragraph("<b>Matches [✓]:</b>", label_style), Paragraph(f"<font color='#16A34A'><b>{matches_count}</b></font>", body_style),
             Paragraph("<b>Requires Review [⚠]:</b>", label_style), Paragraph(f"<font color='#D97706'><b>{possible_count}</b></font>", body_style),
             Paragraph("<b>Mismatches [✕]:</b>", label_style), Paragraph(f"<font color='#DC2626'><b>{mismatches_count}</b></font>", body_style)]
        ], colWidths=[110, 45, 80, 45, 110, 45, 95, 45])
        summary_counts_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F1F5F9')),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
            ('PADDING', (0,0), (-1,-1), 5)
        ]))
        elements.append(summary_counts_table)
        elements.append(Spacer(1, 10))

        # Section 2: Verification Matrix Table
        elements.append(Paragraph("<b>CROSS-DOCUMENT VERIFICATION MATRIX</b>", label_style))
        ver_headers = [Paragraph("<b>Field Name</b>", label_style), Paragraph("<b>Status</b>", label_style), Paragraph("<b>Verified Value</b>", label_style), Paragraph("<b>AI Explanation</b>", label_style)]
        ver_rows = [ver_headers]

        if v_results:
            for vr in v_results:
                status_color = "#16A34A" if vr.verification_status == "MATCH" else ("#DC2626" if vr.verification_status == "MISMATCH" else "#D97706")
                final_val = self.get_best_field_value(app.id, vr.field_name)
                ver_rows.append([
                    Paragraph(vr.field_name or "N/A", body_style),
                    Paragraph(f"<font color='{status_color}'><b>{vr.verification_status}</b></font>", body_style),
                    Paragraph(final_val, body_style),
                    Paragraph(vr.explanation or "All document values match.", body_style)
                ])
        else:
            ver_rows.append([
                Paragraph("survey_number", body_style),
                Paragraph("<font color='#16A34A'><b>MATCH</b></font>", body_style),
                Paragraph(self.get_best_field_value(app.id, 'survey_number'), body_style),
                Paragraph("All document values consistent across submitted deeds.", body_style)
            ])

        t_ver = Table(ver_rows, colWidths=[110, 90, 130, 210])
        t_ver.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#E2E8F0')),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
            ('PADDING', (0,0), (-1,-1), 4)
        ]))
        elements.append(t_ver)
        elements.append(Spacer(1, 10))

        # Section 3: Data Rectification Log
        elements.append(Paragraph("<b>OFFICER DATA RECTIFICATION AUDIT LOG</b>", label_style))
        if corrections:
            corr_headers = [Paragraph("<b>Field Name</b>", label_style), Paragraph("<b>Original Value</b>", label_style), Paragraph("<b>Corrected Value</b>", label_style), Paragraph("<b>Reason / Officer</b>", label_style)]
            corr_rows = [corr_headers]
            for c in corrections:
                corr_rows.append([
                    Paragraph(c.field_name, body_style),
                    Paragraph(c.ai_extracted_value or "N/A", body_style),
                    Paragraph(f"<b>{c.officer_corrected_value}</b>", body_style),
                    Paragraph(f"{c.correction_reason or 'Officer Review'} ({c.corrected_by})", body_style)
                ])
            t_corr = Table(corr_rows, colWidths=[110, 130, 140, 160])
            t_corr.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#FEF3C7')),
                ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#FDE68A')),
                ('PADDING', (0,0), (-1,-1), 4)
            ]))
            elements.append(t_corr)
        else:
            elements.append(Paragraph("<i>No officer-approved data corrections recorded for this application.</i>", body_style))

        elements.append(Spacer(1, 15))
        elements.append(footer_disclaimer())

        elements.append(PageBreak())

        # =========================================================
        # PAGE 4: HUMAN OFFICER REVIEW AND SIGNATURE WORKFLOW
        # (LARGE EXPANDED SIGNATURE SECTIONS FOR HANDWRITTEN & SEALS)
        # =========================================================
        elements.extend(header_banner())
        elements.append(Paragraph("<b>PAGE 4: HUMAN OFFICER REVIEW & AUTHORIZATION WORKFLOW</b>", section_heading))
        elements.append(Paragraph("Official authorization matrix for multi-level revenue sign-offs. Physical or cryptographic signatures required before legal title registration.", body_style))
        elements.append(Spacer(1, 10))

        # Load Workflow Approvals & Officers if available
        approvals = {wf.approval_level: wf for wf in WorkflowApproval.query.filter_by(application_id=app.id).all() if wf.approval_level}

        officer_roles = [
            ("1. Verification Officer", "VERIFICATION_OFFICER", "Officer R. Kumar"),
            ("2. Village Administrative Officer (VAO)", "VAO", "VAO M. Sundaram"),
            ("3. Revenue Inspector (RI)", "REVENUE_INSPECTOR", "RI S. Natarajan"),
            ("4. Survey Officer", "SURVEY_OFFICER", "Surveyor P. Elango"),
            ("5. Tahsildar / Competent Authority", "TAHSILDAR", "Tahsildar K. Ramanathan"),
            ("6. Applicant Acknowledgement", "APPLICANT", app.applicant_name or "Applicant")
        ]

        # Expanded Large Signature Blocks Table Layout
        for role_title, role_key, default_name in officer_roles:
            wf_record = approvals.get(role_key)
            officer_name = str(wf_record.officer_id) if (wf_record and wf_record.officer_id) else default_name
            status = wf_record.status if wf_record else "PENDING REVIEW"
            remarks = wf_record.comments if (wf_record and wf_record.comments) else "Pending inspection"

            sig_block_data = [
                [
                    Paragraph(f"<b>ROLE: {role_title.upper()}</b>", ParagraphStyle('RoleTitle', parent=label_style, fontSize=9, textColor=colors.HexColor('#0B3D91'))),
                    Paragraph(f"<b>STATUS:</b> <font color='{ '#16A34A' if status=='APPROVED' else '#D97706' }'><b>{status}</b></font>", body_style)
                ],
                [
                    Paragraph(f"<b>Name / ID:</b> {officer_name}<br/><b>Remarks:</b> {remarks}", body_style),
                    Paragraph("<b>DATE:</b> ____________________", body_style)
                ],
                [
                    Paragraph("<b>OFFICIAL HANDWRITTEN / DIGITAL SIGNATURE:</b><br/><br/><br/><br/>________________________________________", body_style),
                    Paragraph("<b>OFFICIAL SEAL / STAMP AREA:</b><br/><br/><br/><br/>[ SEAL / STAMP HERE ]", body_style)
                ]
            ]

            t_sig = Table(sig_block_data, colWidths=[310, 230])
            t_sig.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F1F5F9')),
                ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
                ('PADDING', (0,0), (-1,-1), 5),
                ('VALIGN', (0,2), (-1,2), 'TOP')
            ]))

            elements.append(t_sig)
            elements.append(Spacer(1, 8))

        elements.append(Spacer(1, 10))
        elements.append(footer_disclaimer())

        # Build Document
        doc.build(elements)

        return {
            "status": "SUCCESS",
            "application_id": application_id,
            "filename": filename,
            "filepath": filepath,
            "document_type": "OFFICER_REVIEW_COPY"
        }
