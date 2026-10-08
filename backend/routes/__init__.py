from routes.application_routes import app_bp
from routes.upload_routes import upload_bp
from routes.verification_routes import verification_bp
from routes.assistant_routes import assistant_bp
from routes.notification_routes import notification_bp
from routes.review_routes import review_bp
from routes.demo_routes import demo_bp
from routes.pdf_routes import pdf_bp
from routes.auth_routes import auth_bp

def register_routes(app):
    app.register_blueprint(app_bp)
    app.register_blueprint(upload_bp)
    app.register_blueprint(verification_bp)
    app.register_blueprint(assistant_bp)
    app.register_blueprint(notification_bp)
    app.register_blueprint(review_bp)
    app.register_blueprint(demo_bp)
    app.register_blueprint(pdf_bp)
    app.register_blueprint(auth_bp)
