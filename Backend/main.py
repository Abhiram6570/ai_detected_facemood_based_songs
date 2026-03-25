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

# Disable GPU usage
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"  # Disables GPU

# Initialize FastAPI app and emotion detector
app = FastAPI()
detector = FER()

# Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust this to match your React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Check and print available GPUs
print("Num GPUs Available: ", len(tf.config.list_physical_devices('GPU')))

@app.websocket("/")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Receive image data from WebSocket
            payload = await websocket.receive_text()
            payload = json.loads(payload)
            image_by_base64 = payload['data']['image'].split(',')[1]
            
            # Decode and convert the base64 image into a numpy array
            image = np.frombuffer(base64.b64decode(image_by_base64), np.uint8)
            image = cv2.imdecode(image, cv2.IMREAD_COLOR)

            # Detect emotion via FER model
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
        await websocket.send_json({"error": str(e)})  # Send error message to the client
    finally:
        await websocket.close()


# To run the app, use the command:
# uvicorn main:app --reload
