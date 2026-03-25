from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Adjust this to match your React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the static files directory
songs_dir = Path(__file__).parent / "songs"
app.mount("/songs", StaticFiles(directory=songs_dir), name="songs")

@app.get("/get_songs/")
def get_songs(mood: str):
    # Map mood to a folder containing songs
    mood_to_folder = {
        "Normal": "normal",  # Folder names must match exactly
        "Sad": "sad",
        "Love": "love",      # Add more mappings as needed
    }

    folder = mood_to_folder.get(mood, None)
    if folder:
        # Get all mp3 files from the selected mood folder
        song_path = songs_dir / folder
        songs = list(song_path.glob("*.mp3"))  # List all mp3 files in the folder
        song_urls = [f"http://localhost:8000/songs/{folder}/{song.name}" for song in songs]

        if song_urls:
            return JSONResponse({"song_urls": song_urls})
        else:
            return JSONResponse({"error": "No songs found in folder"}, status_code=404)
    else:
        return JSONResponse({"error": "Mood not found"}, status_code=404)

# To run the app, use the command:
# uvicorn Moodbasedplaysongs:app --reload



from fer import FER
import cv2

def detect_emotion(image_path):
    # Load the image
    img = cv2.imread(image_path)

    # Create a FER instance
    detector = FER()

    # Detect emotions
    emotions = detector.detect_emotions(img)

    return emotions
