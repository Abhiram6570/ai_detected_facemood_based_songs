import React, { useRef, useEffect, useState } from 'react';

import * as tf from '@tensorflow/tfjs';
import Webcam from 'react-webcam';
import { drawMesh } from './utilities';
import { useNavigate } from 'react-router-dom';

import { Box, Typography, Button, CardContent, TextField, Card } from '@mui/material';
import RecommendationSongs from '../recommendationongs/RecommendationSongs'

import * as blazeface from '@tensorflow-models/blazeface';



function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [faceDetectionActive, setFaceDetectionActive] = useState(false);
  const [intervalId, setIntervalId] = useState(null); // Store interval ID
  const [FaceDetectionInputValue, setFaceDetectionInputValue] = useState();
  const navigate = useNavigate();

  // const blazeface = require('@tensorflow-models/blazeface');

  // const model = await blazeface.load();


  const handleStartFaceEmotionDetection = () => {
    if (!faceDetectionActive) {
      setFaceDetectionActive(true);
      runFaceDetectorModel(); // Start the model

      let count = 0;

      const id = setInterval(() => {
        count++;
      }, 1000); // Log count every second

      setIntervalId(id);

      // Automatically execute this block after 20 seconds
      setTimeout(() => {
        const Face_Emotion = document.getElementById('emotion_text').value;
        // console.log("Face_Emotion", Face_Emotion);

        if (Face_Emotion) {
          clearInterval(intervalId); // Clear interval
          setFaceDetectionActive(false); // Stop face detection
          setIntervalId(null); // Reset intervalId state

          // Navigate to Dashboard with emotion data
          navigate('/RecommendationSongs', { state: { emotion: Face_Emotion } });
        }
      }, 10000); // 20 seconds (20000ms)
    }
  };

  const handleStopFaceEmotionDetection = () => {
    if (faceDetectionActive) {
      clearInterval(intervalId); // Clear the interval
      setFaceDetectionActive(false); // Stop face detection
      setIntervalId(null); // Reset the intervalId state

      const InputFieldvalue = document.getElementById('emotion_text').value;

      setFaceDetectionInputValue(InputFieldvalue);
      document.getElementById('emotion_text').value = InputFieldvalue;
    }
  };

  const runFaceDetectorModel = async () => {
    const model = await blazeface.load();
    console.log('FaceDetection Model is Loaded..');

    // Start the detection and store the interval ID
    const id = setInterval(() => {
      detect(model);
    }, 100);
    setIntervalId(id); // Save the interval ID to state
  };

  const detect = async (net) => {
    if (typeof webcamRef.current !== 'undefined' && webcamRef.current !== null && webcamRef.current.video.readyState === 4) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const face = await net.estimateFaces(video);
      //console.log(face);

      // Websocket
      // var socket = new WebSocket('ws://localhost:8000');
      let socket;
if (process.env.NODE_ENV === 'development') {
  socket = new WebSocket('ws://localhost:8000');
} else if (process.env.REACT_APP_BACKEND_WS) {
  socket = new WebSocket(process.env.REACT_APP_BACKEND_WS);
} else {
  socket = null; // No socket in production for now
}


  //     var imageSrc = webcamRef.current.getScreenshot();
  //     var apiCall = {
  //       event: 'localhost:subscribe',
  //       data: {
  //         image: imageSrc
  //       }
  //     };
  //     socket.onopen = () => socket.send(JSON.stringify(apiCall));
  //     socket.onmessage = function (event) {
  //       var pred_log = JSON.parse(event.data);
  //       document.getElementById('Angry').value = Math.round(pred_log['predictions']['angry'] * 100);
  //       document.getElementById('Neutral').value = Math.round(pred_log['predictions']['neutral'] * 100);
  //       document.getElementById('Happy').value = Math.round(pred_log['predictions']['happy'] * 100);
  //       document.getElementById('Fear').value = Math.round(pred_log['predictions']['fear'] * 100);
  //       document.getElementById('Surprise').value = Math.round(pred_log['predictions']['surprise'] * 100);
  //       document.getElementById('Sad').value = Math.round(pred_log['predictions']['sad'] * 100);
  //       document.getElementById('Disgust').value = Math.round(pred_log['predictions']['disgust'] * 100);

  //       document.getElementById('emotion_text').value = pred_log['emotion'];

  //       // Get canvas context
  //       const ctx = canvasRef.current.getContext('2d');
  //       requestAnimationFrame(() => {
  //         drawMesh(face, pred_log, ctx);
  //       });
  //     };
  //   }
  // };


  if (socket && webcamRef.current) {
  const imageSrc = webcamRef.current.getScreenshot();
  const apiCall = {
    event: 'localhost:subscribe',
    data: { image: imageSrc }
  };

  socket.onopen = () => socket.send(JSON.stringify(apiCall));

  socket.onmessage = function(event) {
    const pred_log = JSON.parse(event.data);

    // Make sure DOM elements exist
    ['Angry','Neutral','Happy','Fear','Surprise','Sad','Disgust','emotion_text'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        if (id === 'emotion_text') el.value = pred_log['emotion'];
        else el.value = Math.round(pred_log['predictions'][id.toLowerCase()] * 100);
      }
    });

    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) requestAnimationFrame(() => drawMesh(face, pred_log, ctx));
  };
}
    }
  }


  // useEffect(()=>{runFaceDetectorModel()}, []);
  return (
    
// Your main component
<Box className="container" sx={{ padding: 3 }}>
  <Card sx={{ boxShadow: 3 }}>
    <CardContent sx={{ position: 'relative', height: 700 }}> {/* Set a fixed height for CardContent */}
      {/* Webcam and Canvas Section */}
      <Webcam
        ref={webcamRef}
        style={{
          // marginLeft: 'auto',
          // marginRight: 'auto',
          display: 'block', // Center align by using block display
          zIndex: 9,
          width: '640px', // Use fixed width
          height: '480px', // Use fixed height
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
          display: 'block', // Center align by using block display
          zIndex: 9,
          width: '640px',
          height: '480px',
          position: 'absolute',
          top: 0, // Align with the webcam
        }}
      />

{/* Prediction Section */}
<Box
  className="Prediction"
  sx={{
    position: 'absolute',
    right: 20, // Adjusted for better spacing
    width: '50%', // Width of the prediction section
    top: 50, // Adjusted for better spacing
    display: 'flex', // Use flexbox for layout
    flexDirection: 'column', // Arrange items in a column
    alignItems: 'flex-start', // Align items to the left
  }}
>
  {[{ label: 'Angry', color: 'red' },
    { label: 'Neutral', color: 'lightgreen' },
    { label: 'Happy', color: 'orange' },
    { label: 'Fear', color: 'lightblue' },
    { label: 'Surprise', color: 'yellow' },
    { label: 'Sad', color: 'gray' },
    { label: 'Disgust', color: 'pink' },
  ].map((emotion) => (
    <Box className="progress-bar mt-3" key={emotion.label} sx={{ width: '100%' }}>
      <Typography className="progress-label mt-3" sx={{ color: emotion.color }}>
        {emotion.label}
      </Typography>
      <progress id={emotion.label} className="mt-3" value="0" max="100" style={{ width: '100%' }} ></progress>
    </Box>
  ))}
</Box>


      {/* Button Group */}
      <Box
        className="button-group"
        sx={{
          textAlign: 'center',
          position: 'absolute', // Keep it absolute to control positioning
          bottom: 10, // Position it at the bottom of the card
          left: 0,
          right: 0,
        }}
      >
        <TextField
          id="emotion_text"
          name="emotion_text"
          defaultValue="Neutral"
          variant="outlined"
          size="small"
          sx={{ mb: 2, mt: 2}}
          inputProps={{
            style: {
              padding: '5px',
              textAlign: 'center',
            },
          }}
        />
        <br />
        <Button
          variant="contained"
          color="primary"
          onClick={handleStartFaceEmotionDetection}
          disabled={faceDetectionActive}
          sx={{ mr: 2 }}
        >
          Click to Start Face Emotion Detection
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleStopFaceEmotionDetection}
          disabled={!faceDetectionActive}
        >
          Click to Stop Face Emotion Detection
        </Button>
      </Box>
    </CardContent>
  </Card>
</Box>
  );
}

export default App;
