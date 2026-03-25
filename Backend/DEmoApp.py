from flask import Flask
from flask_cors import CORS
from config import Config
from db import get_db, close_db
from routes.addsongs import addsongs
from routes.auth import auth_bp
from routes.analyze import analyze_bp
from routes.main import main_bp

# Initialize the Flask app
app = Flask(__name__)


# Load configuration from Config class
Config.init_app(app)

# Set up CORS for handling requests from the frontend
CORS(app, resources={r"/*": {"origins": Config.CORS_ORIGINS}}, supports_credentials=True)

# Register blueprints for the routes
app.register_blueprint(addsongs, url_prefix='/addsongs')
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(analyze_bp, url_prefix='/analyze')
app.register_blueprint(main_bp, url_prefix='/main')

# Teardown database connection after each request
@app.teardown_appcontext
def teardown_db(exception):
    close_db()  

if __name__ == '__main__':
    app.run(debug=True, port=5000)
