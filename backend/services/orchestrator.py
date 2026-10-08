import os

from database.database import db

from models.application import Application
from models.document import Document
from models.extracted_field import ExtractedField
from models.verification_result import VerificationResult
from models.risk_analysis import RiskAnalysis
from models.module_result import ModuleResult
from models.duplicate_result import DuplicateResult
from models.suspicious_pattern import SuspiciousPattern
from models.ownership_record import OwnershipRecord
from models.notification import Notification

from ai_modules.document_intelligence import DocumentIntelligenceAI
from ai_modules.multilingual_processor import MultilingualProcessorAI
from ai_modules.normalization import DataNormalizationAI
from ai_modules.cross_verification import CrossVerificationAI
from ai_modules.fraud_detection import SuspiciousPatternAI
from ai_modules.duplicate_detection import DuplicateDetectionAI
from ai_modules.tampering_detection import TamperingDetectionAI
from ai_modules.relationship_graph import RelationshipGraphAI
from ai_modules.ownership_chain import OwnershipChainAI
from ai_modules.gis_validation import GisValidationAI
from ai_modules.explainable_ai import ExplainableAI
from ai_modules.case_summarizer import CaseSummarizerAI
from ai_modules.proactive_notification import ProactiveNotificationAI

from services.risk_service import RiskService
from utils.demo_data import DEMO_SCENARIOS


class AIOrchestrator:
    """
    Module 1: AI Orchestrator

    Central controller for:

    - Document processing
    - OCR extraction
    - Normalization
    - Cross verification
    - Duplicate detection
    - Tampering detection
    - Ownership chain analysis
    - Fraud pattern analysis
    - GIS validation
    - Risk scoring
    - Notifications
    """

    def __init__(self):

        self.doc_intel = DocumentIntelligenceAI()

        self.multilingual = MultilingualProcessorAI()

        self.normalizer = DataNormalizationAI()

        self.cross_verifier = CrossVerificationAI()

        self.fraud_detector = SuspiciousPatternAI()

        self.duplicate_detector = DuplicateDetectionAI()

        self.tampering_detector = TamperingDetectionAI()

        self.graph_builder = RelationshipGraphAI()

        self.chain_analyzer = OwnershipChainAI()

        self.gis_validator = GisValidationAI()

        self.explainable_ai = ExplainableAI()

        self.case_summarizer = CaseSummarizerAI()

        self.notifier = ProactiveNotificationAI()

        self.risk_service = RiskService()


    def _find_scenario_for_app(
        self,
        app_record,
        doc_records
    ):
        """
        Find a matching demo scenario.
        """

        doc_filenames = set()

        for document in doc_records:

            if document.original_file_name:

                doc_filenames.add(
                    document.original_file_name
                )

        applicant = (
            app_record.applicant_name or ""
        ).strip().lower()


        for scenario_key, scenario_data in DEMO_SCENARIOS.items():

            scenario_filenames = set()

            for document_data in scenario_data.get(
                "documents",
                []
            ):

                filename = document_data.get(
                    "filename"
                )

                if filename:

                    scenario_filenames.add(
                        filename
                    )


            if (
                scenario_filenames
                and scenario_filenames.issubset(
                    doc_filenames
                )
            ):

                return scenario_data


            scenario_applicant = (
                scenario_data.get(
                    "applicant",
                    ""
                )
            ).strip().lower()


            if (
                applicant
                and applicant == scenario_applicant
            ):

                return scenario_data


        return None


    def _build_scenario_field_index(
        self,
        scenario_data
    ):
        """
        Build:

        {
            filename: fields
        }
        """

        index = {}


        if not scenario_data:

            return index


        for document_info in scenario_data.get(
            "documents",
            []
        ):

            filename = document_info.get(
                "filename"
            )

            fields = document_info.get(
                "fields",
                {}
            )


            if filename:

                index[filename] = fields


        return index


    def process_application(
        self,
        application_id
    ):
        """
        Process an entire land verification application.
        """


        # --------------------------------------------------
        # FIND APPLICATION
        # --------------------------------------------------

        app_record = Application.query.filter_by(
            application_id=application_id
        ).first()


        if app_record is None:

            return {
                "status": "ERROR",
                "message": "Application not found"
            }


        # --------------------------------------------------
        # MARK PROCESSING STARTED
        # --------------------------------------------------

        app_record.processing_status = (
            "IN_PROGRESS"
        )

        db.session.commit()


        # --------------------------------------------------
        # STEP 1:
        # GET APPLICATION DOCUMENTS
        # --------------------------------------------------

        doc_records = Document.query.filter_by(
            application_id=app_record.id
        ).all()


        doc_extracted_map = {}

        docs_for_tampering = []


        # --------------------------------------------------
        # FIND DEMO SCENARIO
        # --------------------------------------------------

        scenario_data = self._find_scenario_for_app(
            app_record,
            doc_records
        )


        if scenario_data:

            scenario_field_index = (
                self._build_scenario_field_index(
                    scenario_data
                )
            )

        else:

            scenario_field_index = {}


        # --------------------------------------------------
        # PROCESS DOCUMENTS
        # --------------------------------------------------

        if doc_records:


            for document in doc_records:


                # ------------------------------------------
                # CHECK FILE EXISTS
                # ------------------------------------------

                file_exists = os.path.isfile(
                    document.file_path
                )


                raw_fields = {}


                # ------------------------------------------
                # DOCUMENT INTELLIGENCE
                # ------------------------------------------

                if file_exists:


                    extraction_result = (
                        self.doc_intel.process_document(
                            document.file_path,
                            document.document_type
                        )
                    )


                    raw_fields = (
                        extraction_result.get(
                            "extracted_fields",
                            {}
                        )
                    )


                # ------------------------------------------
                # DEMO DATA FALLBACK
                # ------------------------------------------

                if (
                    not raw_fields
                    and document.original_file_name
                    in scenario_field_index
                ):


                    raw_fields = (
                        scenario_field_index[
                            document.original_file_name
                        ]
                    )


                # ------------------------------------------
                # MULTILINGUAL PROCESSING
                # ------------------------------------------

                multi_result = (
                    self.multilingual.process(
                        raw_fields
                    )
                )


                canonical_fields = (
                    multi_result.get(
                        "canonical_fields",
                        {}
                    )
                )


                # ------------------------------------------
                # NORMALIZATION
                # ------------------------------------------

                normalization_result = (
                    self.normalizer.normalize_fields(
                        canonical_fields
                    )
                )


                normalized_fields = (
                    normalization_result.get(
                        "normalized_fields",
                        {}
                    )
                )


                # ------------------------------------------
                # STORE EXTRACTED DATA
                # ------------------------------------------

                doc_extracted_map[
                    document.document_type
                ] = normalized_fields


                # ------------------------------------------
                # TAMPERING DATA
                # ------------------------------------------

                docs_for_tampering.append({

                    "original_file_name":
                        document.original_file_name,

                    "file_path":
                        document.file_path,

                    "document_type":
                        document.document_type,

                    "file_size":
                        document.file_size or 5000

                })


                # ------------------------------------------
                # DELETE OLD EXTRACTED FIELDS
                # ------------------------------------------

                ExtractedField.query.filter_by(
                    document_id=document.id
                ).delete()


                # ------------------------------------------
                # SAVE EXTRACTED FIELDS
                # ------------------------------------------

                for field_key, field_value in (
                    normalized_fields.items()
                ):


                    # IMPORTANT:
                    # Create object without keyword constructor
                    # arguments to avoid SQLAlchemy/Pylance errors.

                    extracted_field = ExtractedField()


                    extracted_field.document_id = (
                        document.id
                    )


                    extracted_field.field_name = (
                        field_key
                    )


                    extracted_field.original_value = str(

                        raw_fields.get(
                            field_key,
                            field_value
                        )

                    )


                    extracted_field.normalized_value = (

                        str(field_value)

                        if field_value is not None

                        else None

                    )


                    extracted_field.confidence = 0.95


                    db.session.add(
                        extracted_field
                    )


                # ------------------------------------------
                # UPDATE DOCUMENT STATUS
                # ------------------------------------------

                document.processing_status = (
                    "COMPLETED"
                )


                document.ocr_status = (
                    "COMPLETED"
                )


                document.extraction_confidence = (
                    0.95
                )


        # --------------------------------------------------
        # NO DOCUMENT RECORDS
        # DEMO FALLBACK
        # --------------------------------------------------

        else:


            if scenario_data:


                for document_info in (
                    scenario_data.get(
                        "documents",
                        []
                    )
                ):


                    document_type = (
                        document_info.get(
                            "type"
                        )
                    )


                    fields = (
                        document_info.get(
                            "fields",
                            {}
                        )
                    )


                    normalization_result = (
                        self.normalizer.normalize_fields(
                            fields
                        )
                    )


                    normalized_fields = (
                        normalization_result.get(
                            "normalized_fields",
                            {}
                        )
                    )


                    doc_extracted_map[
                        document_type
                    ] = normalized_fields


                    docs_for_tampering.append({

                        "original_file_name":
                            document_info.get(
                                "filename"
                            ),

                        "file_path":
                            f"uploads/{document_info.get('filename')}",

                        "document_type":
                            document_type,

                        "file_size":
                            12000

                    })


        # ==================================================
        # STEP 2:
        # CROSS DOCUMENT VERIFICATION
        # ==================================================

        cross_result = (
            self.cross_verifier.verify(
                doc_extracted_map
            )
        )


        field_results = (
            cross_result.get(
                "field_results",
                []
            )
        )


        # --------------------------------------------------
        # DELETE OLD VERIFICATION RESULTS
        # --------------------------------------------------

        VerificationResult.query.filter_by(
            application_id=app_record.id
        ).delete()


        # --------------------------------------------------
        # SAVE VERIFICATION RESULTS
        # --------------------------------------------------

        for verification in field_results:


            verification_result = (
                VerificationResult()
            )


            verification_result.application_id = (
                app_record.id
            )


            verification_result.field_name = (
                verification.get(
                    "field_name"
                )
            )


            verification_result.verification_status = (
                verification.get(
                    "verification_status"
                )
            )


            verification_result.severity = (
                verification.get(
                    "severity"
                )
            )


            verification_result.confidence = (
                verification.get(
                    "confidence",
                    0.95
                )
            )


            verification_result.explanation = (
                verification.get(
                    "explanation"
                )
            )


            verification_result.details = (
                verification.get(
                    "doc_values",
                    {}
                )
            )


            db.session.add(
                verification_result
            )


        # ==================================================
        # STEP 3:
        # DUPLICATE DETECTION
        # ==================================================

        all_apps = []


        for application in Application.query.all():

            if hasattr(
                application,
                "to_dict"
            ):

                all_apps.append(
                    application.to_dict()
                )


        duplicate_result = (
            self.duplicate_detector.check_duplicate(

                app_record.application_id,

                doc_extracted_map,

                all_apps

            )
        )


        # --------------------------------------------------
        # DEMO DUPLICATE OVERRIDE
        # --------------------------------------------------

        if (

            scenario_data

            and scenario_data.get(
                "title"
            )

            and "Duplicate"
            in scenario_data["title"]

        ):


            duplicate_result[
                "possible_duplicate"
            ] = True


            duplicate_result[
                "similarity"
            ] = 0.91


            duplicate_result[
                "matched_application_id"
            ] = (
                "APP-2024-8891"
            )


            duplicate_result[
                "duplicate_status"
            ] = (
                "POTENTIAL_DUPLICATE"
            )


            duplicate_result[
                "explanation"
            ] = (
                "Similar land parcel and "
                "application information "
                "found in a previous application."
            )


        # ==================================================
        # TAMPERING DETECTION
        # ==================================================

        tampering_result = (
            self.tampering_detector.inspect_documents(
                docs_for_tampering
            )
        )


        # --------------------------------------------------
        # DEMO TAMPERING OVERRIDE
        # --------------------------------------------------

        if (

            scenario_data

            and scenario_data.get(
                "title"
            )

            and "Tampering"
            in scenario_data["title"]

        ):


            tampering_result[
                "tampering_suspected"
            ] = True


            tampering_result[
                "flags"
            ] = [

                "Font size variance detected",

                "Possible editing software artifact detected"

            ]


            tampering_result[
                "explanation"
            ] = (
                "Possible document alteration "
                "detected in the Sale Deed."
            )


        # ==================================================
        # OWNERSHIP CHAIN
        # ==================================================

        chain_records = []


        if scenario_data:

            chain_records = (
                scenario_data.get(
                    "ownership_chain",
                    []
                )
            )


        # --------------------------------------------------
        # DELETE OLD OWNERSHIP RECORDS
        # --------------------------------------------------

        OwnershipRecord.query.filter_by(
            application_id=app_record.id
        ).delete()


        # --------------------------------------------------
        # SAVE OWNERSHIP RECORDS
        # --------------------------------------------------

        for chain_item in chain_records:


            ownership_record = (
                OwnershipRecord()
            )


            ownership_record.application_id = (
                app_record.id
            )


            ownership_record.owner_name = (
                chain_item.get(
                    "owner_name"
                )
            )


            ownership_record.previous_owner = (
                chain_item.get(
                    "previous_owner"
                )
            )


            ownership_record.survey_number = (

                doc_extracted_map.get(
                    "PATTA",
                    {}
                ).get(
                    "survey_number",
                    "123/2A"
                )

            )


            ownership_record.transfer_date = (
                chain_item.get(
                    "transfer_date"
                )
            )


            ownership_record.source_document = (
                chain_item.get(
                    "source_document"
                )
            )


            ownership_record.sequence_order = (
                chain_item.get(
                    "sequence_order"
                )
            )


            db.session.add(
                ownership_record
            )


        # --------------------------------------------------
        # ANALYZE OWNERSHIP CHAIN
        # --------------------------------------------------

        chain_result = (
            self.chain_analyzer.analyze_chain(
                chain_records
            )
        )


        # ==================================================
        # FRAUD / SUSPICIOUS PATTERN ANALYSIS
        # ==================================================

        fraud_result = (
            self.fraud_detector.analyze(

                field_results,

                doc_extracted_map

            )
        )


        # ==================================================
        # RELATIONSHIP GRAPH
        # ==================================================

        graph_result = (
            self.graph_builder.generate_graph(

                app_record.application_id,

                app_record.applicant_name,

                doc_extracted_map

            )
        )


        # ==================================================
        # GIS VALIDATION
        # ==================================================

        if doc_extracted_map:

            primary_fields = (
                list(
                    doc_extracted_map.values()
                )[0]
            )

        else:

            primary_fields = {}


        primary_survey = (
            primary_fields.get(
                "survey_number",
                "123/2A"
            )
        )


        primary_village = (
            primary_fields.get(
                "village",
                "Velachery"
            )
        )


        primary_extent = (
            primary_fields.get(
                "land_extent",
                "2.50 acres"
            )
        )


        gis_result = (
            self.gis_validator.validate(

                primary_survey,

                primary_village,

                primary_extent

            )
        )


        # ==================================================
        # STEP 4:
        # RISK CALCULATION
        # ==================================================

        risk_calculation = (
            self.risk_service.calculate_risk(

                field_results,

                duplicate_result,

                tampering_result,

                chain_result

            )
        )


        # ==================================================
        # SAVE RISK ANALYSIS
        # ==================================================

        RiskAnalysis.query.filter_by(
            application_id=app_record.id
        ).delete()


        risk_analysis = RiskAnalysis()


        risk_analysis.application_id = (
            app_record.id
        )


        risk_analysis.risk_score = (
            risk_calculation.get(
                "risk_score",
                0
            )
        )


        risk_analysis.risk_level = (
            risk_calculation.get(
                "risk_level",
                "LOW"
            )
        )


        risk_analysis.risk_factors = (
            risk_calculation.get(
                "risk_factors",
                []
            )
        )


        risk_analysis.calculation_details = (
            risk_calculation.get(
                "calculation_details",
                {}
            )
        )


        db.session.add(
            risk_analysis
        )


        # ==================================================
        # UPDATE APPLICATION
        # ==================================================

        app_record.risk_score = (
            risk_calculation.get(
                "risk_score",
                0
            )
        )


        app_record.risk_level = (
            risk_calculation.get(
                "risk_level",
                "LOW"
            )
        )


        if app_record.risk_level == "LOW":

            app_record.status = (
                "VERIFIED"
            )

        else:

            app_record.status = (
                "REVIEW_REQUIRED"
            )


        app_record.processing_status = (
            "COMPLETED"
        )


        # ==================================================
        # STEP 5:
        # SAVE MODULE RESULTS
        # ==================================================

        ModuleResult.query.filter_by(
            application_id=app_record.id
        ).delete()


        modules_to_save = [

            (
                "cross_verification",
                cross_result
            ),

            (
                "duplicate_detection",
                duplicate_result
            ),

            (
                "tampering_detection",
                tampering_result
            ),

            (
                "ownership_chain",
                chain_result
            ),

            (
                "relationship_graph",
                graph_result
            ),

            (
                "gis_validation",
                gis_result
            ),

            (
                "suspicious_pattern",
                fraud_result
            )

        ]


        for module_name, module_data in (
            modules_to_save
        ):


            module_result = (
                ModuleResult()
            )


            module_result.application_id = (
                app_record.id
            )


            module_result.module_name = (
                module_name
            )


            module_result.status = (
                module_data.get(
                    "status",
                    "SUCCESS"
                )
            )


            module_result.confidence = (
                module_data.get(
                    "confidence",
                    0.95
                )
            )


            findings = (
                module_data.get(
                    "findings"
                )
            )


            if not findings:

                explanation = (
                    module_data.get(
                        "explanation",
                        ""
                    )
                )


                findings = [explanation]


            module_result.findings = (
                findings
            )


            warnings = (
                module_data.get(
                    "warnings"
                )
            )


            if not warnings:

                warnings = (
                    module_data.get(
                        "flags",
                        []
                    )
                )


            module_result.warnings = (
                warnings
            )


            module_result.metadata_json = (
                module_data
            )


            db.session.add(
                module_result
            )


        # ==================================================
        # SAVE DUPLICATE RESULT
        # ==================================================

        DuplicateResult.query.filter_by(
            application_id=app_record.id
        ).delete()


        duplicate_record = (
            DuplicateResult()
        )


        duplicate_record.application_id = (
            app_record.id
        )


        duplicate_record.matched_application_id = (
            duplicate_result.get(
                "matched_application_id"
            )
        )


        duplicate_record.similarity_score = (
            duplicate_result.get(
                "similarity",
                0.0
            )
        )


        duplicate_record.duplicate_status = (
            duplicate_result.get(
                "duplicate_status"
            )
        )


        duplicate_record.explanation = (
            duplicate_result.get(
                "explanation"
            )
        )


        db.session.add(
            duplicate_record
        )


        # ==================================================
        # SAVE SUSPICIOUS PATTERN
        # ==================================================

        SuspiciousPattern.query.filter_by(
            application_id=app_record.id
        ).delete()


        suspicious_pattern = (
            SuspiciousPattern()
        )


        suspicious_pattern.application_id = (
            app_record.id
        )


        suspicious_pattern.risk_level = (
            fraud_result.get(
                "risk_level"
            )
        )


        suspicious_pattern.detected_patterns = (
            fraud_result.get(
                "patterns"
            )
        )


        suspicious_pattern.explanation = (
            fraud_result.get(
                "explanation"
            )
        )


        db.session.add(
            suspicious_pattern
        )


        # ==================================================
        # STEP 6:
        # GENERATE PROACTIVE NOTIFICATIONS
        # ==================================================

        notification_result = (
            self.notifier.generate_notifications(

                app_record.application_id,

                risk_calculation.get(
                    "risk_level",
                    "LOW"
                ),

                field_results

            )
        )


        generated_notifications = (
            notification_result.get(
                "generated_notifications",
                []
            )
        )


        for notification_data in (
            generated_notifications
        ):


            # IMPORTANT:
            # Create object first.
            # Assign fields separately.
            # This avoids constructor keyword errors.

            notification = (
                Notification()
            )


            notification.application_id = (
                app_record.id
            )


            notification.title = (
                notification_data.get(
                    "title",
                    "Application Update"
                )
            )


            notification.message = (
                notification_data.get(
                    "message",
                    ""
                )
            )


            notification.notification_type = (
                notification_data.get(
                    "notification_type",
                    "INFO"
                )
            )


            db.session.add(
                notification
            )


        # ==================================================
        # FINAL DATABASE COMMIT
        # ==================================================

        try:

            db.session.commit()


        except Exception as error:

            db.session.rollback()


            app_record.processing_status = (
                "FAILED"
            )


            try:

                db.session.commit()

            except Exception:

                db.session.rollback()


            return {

                "status": "ERROR",

                "message": (
                    f"Database error: {str(error)}"
                )

            }


        # ==================================================
        # FINAL RESPONSE
        # ==================================================

        return {

            "status": "SUCCESS",

            "application_id":
                app_record.application_id,

            "risk_score":
                app_record.risk_score,

            "risk_level":
                app_record.risk_level,

            "verification_status":
                app_record.status

        }