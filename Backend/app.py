from flask import Flask, send_from_directory
from flask_cors import CORS
from config import Config
from db import get_db, close_db
from routes.addsongs import addsongs
from routes.auth import auth_bp
from routes.analyze import analyze_bp
from routes.main import main_bp
from routes.profile import profile_bp
from routes.passwordchange import passwordchange_bp
from routes.recommendationsongs import recommendationsongs_bp
from routes.getuserdata import getuserdata_bp
from routes.favsongs import favsongs_bp
from routes.addfavsongs import addfavsongs_bp
from routes.removefavsongs import removefavsongs_bp

from routes.songstats import songstats_bp




import json
import base64
import os
from fastapi import FastAPI, WebSocket
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import tensorflow as tf
import cv2
import numpy as np
from fer import FER
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from asgiref.wsgi import WsgiToAsgi

# Initialize Flask and FastAPI apps
flask_app = Flask(__name__)
fastapi_app = FastAPI()

# Flask Configuration
Config.init_app(flask_app)
CORS(flask_app, resources={r"/*": {"origins": Config.CORS_ORIGINS}}, supports_credentials=True)

# Register blueprints for Flask routes
flask_app.register_blueprint(addsongs, url_prefix='/addsongs')
flask_app.register_blueprint(auth_bp, url_prefix='/auth')
flask_app.register_blueprint(analyze_bp, url_prefix='/analyze')
flask_app.register_blueprint(main_bp, url_prefix='/main')
flask_app.register_blueprint(profile_bp, url_prefix='/profile')
flask_app.register_blueprint(passwordchange_bp, url_prefix='/passwordchange')
flask_app.register_blueprint(recommendationsongs_bp, url_prefix='/recommendationsongs')
flask_app.register_blueprint(getuserdata_bp, url_prefix='/getuserdata')
flask_app.register_blueprint(favsongs_bp, url_prefix='/favsongs')

flask_app.register_blueprint(addfavsongs_bp, url_prefix='/addfavsongs')
flask_app.register_blueprint(removefavsongs_bp, url_prefix='/removefavsongs')
flask_app.register_blueprint(songstats_bp)



@flask_app.route('/uploads/songs/<path:filename>', methods=['GET'])
def send_audio_file(filename):
    return send_from_directory('uploads/songs', filename)

@flask_app.teardown_appcontext
def teardown_db(exception):
    close_db()

# FastAPI Configuration
# Disable GPU usage
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"

# Initialize emotion detector
detector = FER()

# Allow CORS for React frontend
fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the static files directory for songs
songs_dir = Path(__file__).parent / "uploads"
fastapi_app.mount("/songs", StaticFiles(directory=songs_dir), name="songs")

# Check and print available GPUs
print("Num GPUs Available: ", len(tf.config.list_physical_devices('GPU')))

@fastapi_app.websocket("/websocket")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            payload = await websocket.receive_text()
            payload = json.loads(payload)
            image_by_base64 = payload['data']['image'].split(',')[1]
            image = np.frombuffer(base64.b64decode(image_by_base64), np.uint8)
            image = cv2.imdecode(image, cv2.IMREAD_COLOR)

            predictions = detector.detect_emotions(image)
            if predictions:
                response = {
                    "predictions": predictions[0]['emotions'],
                    "emotion": max(predictions[0]['emotions'], key=predictions[0]['emotions'].get)
                }
                await websocket.send_json(response)
            else:
                await websocket.send_json({"error": "No emotions detected"})
    except Exception as e:
        print(f"Error: {e}")
        await websocket.send_json({"error": str(e)})
    finally:
        await websocket.close()

@fastapi_app.get("/get_songs/")
def get_songs(mood: str):
    mood_to_folder = {
        "normal": "normal",
        "sad": "sad",
        "love": "love",
    }

    folder = mood_to_folder.get(mood.lower(), None)
    if folder:
        song_path = songs_dir / folder
        songs = list(song_path.glob("*.mp3"))
        song_urls = [f"http://localhost:5000/uploads/songs/{folder}/{song.name}" for song in songs]

        if song_urls:
            return JSONResponse({"song_urls": song_urls})
        else:
            return JSONResponse({"error": "No songs found in folder"}, status_code=404)
    else:
        return JSONResponse({"error": "Mood not found"}, status_code=404)

# Combine Flask and FastAPI using Werkzeug's DispatcherMiddleware
flask_app.wsgi_app = DispatcherMiddleware(
    flask_app.wsgi_app,
    {
        "/fastapi": WsgiToAsgi(fastapi_app)
    }
)

if __name__ == '__main__':
    flask_app.run(host="0.0.0.0", port=5000, debug=True)
