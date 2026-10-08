# pyrefly: ignore [missing-import]
from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from database.database import init_db
from routes import register_routes

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for React Frontend
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Initialize SQLAlchemy Database
    init_db(app)

    # Register API Blueprints
    register_routes(app)

    @app.route('/', methods=['GET'])
    def health_check():
        return jsonify({
            "service": "LANDGUARD AI Backend",
            "status": "ONLINE",
            "version": "1.0.0",
            "disclaimer": "AI recommendations are for verification assistance only. Final decisions remain with authorized human officers."
        })

    return app

if __name__ == '__main__':
    app = create_app()
    print("[START] LANDGUARD AI Flask Backend running on http://127.0.0.1:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
