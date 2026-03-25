import json
import base64
import os
from flask import Flask, Blueprint, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room
from pathlib import Path
import cv2
import numpy as np
from fer import FER



from fastapi import FastAPI, WebSocket
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware






# Initialize the Flask app
app = Flask(__name__)

# Enable CORS for React frontend
CORS(app)

# Initialize the SocketIO instance
socketio = SocketIO(app)

# Disable GPU usage
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"  # Disables GPU

# Initialize the emotion detector (FER)
detector = FER()

# Path to the songs directory
songs_dir = Path(__file__).parent / "songs"

# Blueprint for main routes
main_bp = Blueprint('main', __name__)

# WebSocket handling (emotion detection via WebSocket)
@socketio.on('connect', namespace='/main')
def handle_connect():
    print("Client connected to WebSocket")

@socketio.on('disconnect', namespace='/main')
def handle_disconnect():
    print("Client disconnected from WebSocket")

@socketio.on('detect_emotion', namespace='/main')
def handle_emotion_detection(data):
    print("Received emotion detection request")
    try:
        image_base64 = data['image'].split(',')[1]  # Get image from the payload
        # Decode and convert the base64 image into a numpy array
        image = np.frombuffer(base64.b64decode(image_base64), np.uint8)
        image = cv2.imdecode(image, cv2.IMREAD_COLOR)

        # Detect emotions using FER
        predictions = detector.detect_emotions(image)
        if predictions:
            response = {
                "predictions": predictions[0]['emotions'],
                "emotion": max(predictions[0]['emotions'], key=predictions[0]['emotions'].get)
            }
            emit('emotion_response', response)
        else:
            emit('emotion_response', {"error": "No emotions detected"})
    except Exception as e:
        emit('emotion_response', {"error": str(e)})

# Route for serving songs (same as your existing route)
@main_bp.route('/get_songs/', methods=["GET"])
def get_songs():
    mood = request.args.get('mood')
    
    # Map mood to a folder containing songs
    mood_to_folder = {
        "neutral": "neutral",
        "angry": "angry",
        "happy": "happy",
        "fear": "fear",
        "surprise": "surprise",
        "normal": "normal",
        "disgust": "disgust",
        "sad": "sad",
    }

    folder = mood_to_folder.get(mood.lower(), None)
    print(f"Requested mood: {mood}, mapped folder: {folder}")  # Debugging line

    if folder:
        # Get all mp3 files from the selected mood folder
        song_path = songs_dir / folder
        print(f"Checking songs in: {song_path}")  # Debugging line
        songs = list(song_path.glob("*.mp3"))  # List all mp3 files in the folder
        
        if not songs:
            print(f"No songs found in folder: {folder}")  # Debugging line
            
        song_urls = [f"http://localhost:5000/songs/{folder}/{song.name}" for song in songs]

        if song_urls:
            return jsonify({"song_urls": song_urls})
        else:
            return jsonify({"error": "No songs found in folder"}), 404
    else:
        return jsonify({"error": "Mood not found"}), 404

# Register the Blueprint
app.register_blueprint(main_bp, url_prefix='/main')

# Serve the songs directory
app.add_url_rule('/songs/<path:filename>', endpoint='song_file', view_func=app.send_static_file)

# To run the app:
# python app.py
if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)
