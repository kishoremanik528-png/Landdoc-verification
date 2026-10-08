
import uuid

from database.database import db
from models.document import Document
from models.application import Application
from utils.file_utils import save_uploaded_file


class DocumentService:

    def add_document_to_application(
        self,
        app_id_str,
        file_obj,
        document_type,
        upload_folder
    ):
        """
        Add an uploaded document to an existing application.
        """

        # Find application using public application ID
        application = Application.query.filter_by(
            application_id=app_id_str
        ).first()

        if application is None:
            return None, "Application not found"

        try:
            # Save uploaded file
            file_meta = save_uploaded_file(
                file_obj=file_obj,
                upload_folder=upload_folder,
                sub_folder=f"app_{application.id}"
            )

            # Create database document record
            document = Document(
                document_id=f"DOC_{uuid.uuid4().hex[:8].upper()}",
                application_id=application.id,
                document_type=(document_type or "UNKNOWN").upper(),
                original_file_name=file_meta["original_name"],
                file_path=file_meta["file_path"],
                file_type=file_meta["file_type"],
                file_size=file_meta["file_size"],
                processing_status="UPLOADED"
            )

            # Add document to database
            db.session.add(document)
            db.session.commit()

            return document.to_dict(), None

        except Exception as error:
            # Rollback database changes if an error occurs
            db.session.rollback()

            return None, str(error)
