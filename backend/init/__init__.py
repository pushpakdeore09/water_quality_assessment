from flask import Flask # type: ignore
from flask_cors import CORS # type: ignore
from .routes import main

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}})
    app.register_blueprint(main)
    return app
