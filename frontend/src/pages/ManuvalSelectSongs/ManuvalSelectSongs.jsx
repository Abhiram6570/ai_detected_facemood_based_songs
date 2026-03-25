import React, { useState, useRef } from "react";
import {
  Container,
  Typography,
  Select,
  MenuItem,
  Button,
  Box,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Grid,
} from "@mui/material";
import { useNavigate } from 'react-router-dom';

function App() {
  const [mood, setMood] = useState("");
  const [songUrls, setSongUrls] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchSongs = async (selectedMood) => {
    setLoading(true);
    // alert("SelectOption is successfully working");

    // Navigate to Dashboard with emotion data
    navigate('/RecommendationSongs', { state: { emotion: selectedMood } });

  };

  


  const playNextSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songUrls.length);
  };

  const playPreviousSong = () => {
    setCurrentSongIndex((prevIndex) =>
      (prevIndex - 1 + songUrls.length) % songUrls.length
    );
  };

  const togglePause = () => {
    if (audioRef.current) {
      if (isPaused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
      setIsPaused((prevState) => !prevState);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5", // Set background color
        textAlign: 'center',
      }}
    >
      <Card sx={{ width: "100%"}}>
        <Grid container spacing={2} alignItems="center">
          {/* Mood Selection Column */}
          <Grid item xs={12} md={8}>
            <div sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h1" component="div" gutterBottom>
                  Mood-Based Music Player
                </Typography>
                <Typography variant="h2" color="text.secondary" gutterBottom>
                  Current Mood: <span style={{color:'red'}}  variant="h2">{mood || "None detected"}</span> 
                </Typography>
                <Select
                  value={mood}
                  onChange={(e) => {
                    setMood(e.target.value);
                    fetchSongs(e.target.value);
                  }}
                  variant="outlined"
                  displayEmpty
                  sx={{ mt: 2, mb: 2, minWidth: '70%' }}
                >
                  <MenuItem value="">
                    <em>Select Mood</em>
                  </MenuItem>
                  <MenuItem value="neutral">Neutral</MenuItem>
                  <MenuItem value="angry">Angry</MenuItem>
                  <MenuItem value="happy">Happy</MenuItem>
                  <MenuItem value="fear">Fear</MenuItem>
                  <MenuItem value="surprise">Surprise</MenuItem>
                  <MenuItem value="disgust">Disgust</MenuItem>
                  <MenuItem value="sad">Sad</MenuItem>


                  <MenuItem value="love">Love</MenuItem>
                </Select>



                {loading ? (
                  <CircularProgress />
                ) : (
                  songUrls.length > 0 && (
                    <Box>
                      <audio
                        ref={audioRef}
                        src={songUrls[currentSongIndex]}
                        autoPlay
                        onEnded={playNextSong}
                      />
                      <Box mt={2}>
                        <Button variant="contained" onClick={playPreviousSong}>
                          Previous
                        </Button>
                        <Button variant="contained" onClick={playNextSong} sx={{ mx: 2 }}>
                          Next
                        </Button>
                        <Button variant="contained" onClick={togglePause}>
                          {isPaused ? "Play" : "Pause"}
                        </Button>
                      </Box>
                    </Box>
                  )
                )}
              </CardContent>
            </div>
          </Grid>
          {/* Image Column */}
          <Grid item xs={12} md={4}>
            <div>
              <CardMedia
                component="img"
                alt="Mood Representation"
                height="100%"
                image="../src/assets/images/select_music.png" // Replace with your image source
              />
            </div>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}

export default App;
