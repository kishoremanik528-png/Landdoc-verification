
import os
import uuid

from werkzeug.utils import secure_filename


ALLOWED_EXTENSIONS = {
    "pdf",
    "jpg",
    "jpeg",
    "png"
}


def allowed_file(filename):
    """
    Check whether the uploaded file has a supported extension.
    """

    if not filename:
        return False

    if "." not in filename:
        return False

    extension = filename.rsplit(".", 1)[1].lower()

    return extension in ALLOWED_EXTENSIONS


def save_uploaded_file(
    file_obj,
    upload_folder,
    sub_folder=None
):
    """
    Save an uploaded file and return file metadata.
    """

    if file_obj is None:
        raise ValueError("No file provided")

    if not file_obj.filename:
        raise ValueError("Invalid file name")

    if not allowed_file(file_obj.filename):
        raise ValueError(
            "Unsupported file type. Allowed types: PDF, JPG, JPEG, PNG"
        )

    # Create safe original filename
    original_name = secure_filename(file_obj.filename)

    # Extract extension
    file_extension = original_name.rsplit(
        ".",
        1
    )[1].lower()

    # Generate unique filename
    unique_filename = (
        f"{uuid.uuid4().hex}.{file_extension}"
    )

    # Build upload directory
    target_folder = upload_folder

    if sub_folder:
        target_folder = os.path.join(
            upload_folder,
            sub_folder
        )

    # Create directory if it does not exist
    os.makedirs(
        target_folder,
        exist_ok=True
    )

    # Full file path
    full_file_path = os.path.join(
        target_folder,
        unique_filename
    )

    # Save file
    file_obj.save(full_file_path)

    # Get file size
    file_size = os.path.getsize(
        full_file_path
    )

    return {
        "original_name": original_name,
        "file_path": full_file_path,
        "file_type": file_extension,
        "file_size": file_size
    }