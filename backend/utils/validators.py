def validate_application_data(data):
    errors = []
    if not data:
        errors.append("Request body is empty")
    return errors
