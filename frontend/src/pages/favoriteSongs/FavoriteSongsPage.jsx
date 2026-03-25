import React, { useState, useEffect, useRef } from "react";
import { Box, Grid, Typography, IconButton, Card, CardMedia, CardContent, Slider } from "@mui/material";
import { PlayArrow, Pause, SkipNext, SkipPrevious, VolumeUp, VolumeDown, Favorite, FavoriteBorder } from "@mui/icons-material";
import { useUser } from "components/UserContext";

function RecommendationSongs() {
  const [songUrls, setSongUrls] = useState([]);
  const [favoriteSongs, setFavoriteSongs] = useState([]); // State to hold favorite songs
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(""); // State for error messages
  const [user_id, setUserId] = useState(Number);
  const [useAuth, setUserAuth] = useState('');

  const {user} = useUser();


      useEffect(() => {

  
          async function fetchProfile() {
              try {
                  const email = user.email;
  
                  if (!email) {
                      throw new Error("User email not found.");
                  }
  
                  const response = await fetch(import.meta.env.VITE_PROFILE, {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ email }), // Send the email in the request body
                  });
  
                  if (!response.ok) {
                      throw new Error("Failed to fetch profile.");
                  }
  
                  const data = await response.json();
                  if (data.message !== "User found") {
                      throw new Error("User not found.");
                  }
                  setUserId(data.user.id);
                  fetchFavoriteSongs(data.user.id); // Fetch favorite songs

              } catch (err) {
                  setError(err.message);
              }
          }
  
          fetchProfile();
      }, []); // Re-run the effect when `user` changes













  
  const placeholderImage = "https://www.iconexperience.com/_img/v_collection_png/256x256/shadow/cd_music.png";


  // Fetch favorite songs for the user
  const fetchFavoriteSongs = async (user_id) => {
    try {
      const response = await fetch(import.meta.env.VITE_FAV_SONGS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user_id }), // Replace with the actual user ID
      });

      // console.log("user_id",user_id);


      if (response.ok) {
        const data = await response.json();
        if (data.message === "No favorite songs found") {
          setFavoriteSongs([]);
        } else {
          setFavoriteSongs(data.songs); // Assuming songs are in 'songs' field
          // Prepend the backend URL to the song file path
          const urls = data.songs.map(song => `${import.meta.env.VITE_BACKENDBASEURL}/${song.song_file_path}`);
          setSongUrls(urls);
        }
      } else {
        console.error("Failed to fetch favorite songs", response.statusText);
        setError("Failed to fetch favorite songs.");
      }
    } catch (error) {
      console.error("Error fetching favorite songs:", error);
      setError("Error fetching favorite songs.");
    }
  };

  const handleRemoveSong = async (songId) => {
    try {
      const data = JSON.stringify({
        user_id: user_id, // Replace with the actual user ID
        song_id: songId,
      });
console.log("remove Favarate Table page Songs Id data ",data);


      
      const response = await fetch(import.meta.env.VITE_REMOVE_FAV_SONGS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message); // Show success message
        // Remove the song from the state
        setFavoriteSongs(favoriteSongs.filter(song => song.song_id !== songId));
        setSongUrls(songUrls.filter(url => !url.includes(songId))); // Remove song URL as well
      } else {
        console.error("Failed to remove song", response.statusText);
      }
    } catch (error) {
      console.error("Error removing song:", error);
    }
  };

  // useEffect(() => {
  // }, []); // Only run once on mount

  // Start playing when the song URLs are loaded
  useEffect(() => {
    if (songUrls.length > 0 && audioRef.current) {
      audioRef.current.play(); // Start playing the first song automatically when songUrls are populated
    }
  }, [songUrls]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume; // Set volume when it's updated
    }
  }, [volume]);

  useEffect(() => {
    // Ensure the audio plays the selected song when currentSongIndex changes
    if (audioRef.current) {
      audioRef.current.load(); // Reload audio to play the selected song
      audioRef.current.play();
    }
  }, [currentSongIndex]); // Trigger when the song index changes

  const playNextSong = () => {
    if (currentSongIndex < songUrls.length - 1) {
      setCurrentSongIndex(prevIndex => prevIndex + 1);
    } else {
      alert("You have reached the end of the playlist.");
    }
  };

  const playPreviousSong = () => {
    if (currentSongIndex > 0) {
      setCurrentSongIndex(prevIndex => prevIndex - 1);
    } else {
      alert("This is the first song in the playlist.");
    }
  };

  const togglePause = () => {
    if (audioRef.current) {
      if (isPaused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
      setIsPaused(!isPaused);
    }
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
  };

  const handleSeekChange = (event, newValue) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newValue;
      setCurrentTime(newValue);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <Box sx={{ paddingBottom: 10 }}>
      <Typography variant="h1" gutterBottom textAlign="center">
        Your Favorite Songs
      </Typography>

      {error && (
        <Typography color="error" textAlign="center">
          {error}
        </Typography>
      )}

      {/* Favorite Songs Section */}
      {favoriteSongs.length > 0 ? (
        <Grid container spacing={3} sx={{ padding: 2 }}>
          {favoriteSongs.map((song, index) => (
            <Grid item xs={12} sm={3} md={2} key={song.song_id}>
              <Card
                sx={{
                  position: "relative", // Make the card's position relative to place the icon in the top-right corner
                  cursor: "pointer",
                  textAlign: "center",
                  "&:hover": {
                    boxShadow: 5,
                  },
                }}
                onClick={() => setCurrentSongIndex(index)} // Set the song index when clicked
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 120,
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      width: 120,
                      borderRadius: 1,
                    }}
                    image={song.song_image || placeholderImage} // Use song image if available
                    alt={`Song ${song.song_title}`}
                  />
                </Box>
                <CardContent>
                  <Typography variant="body1" fontWeight="bold">
                    {song.song_title}
                  </Typography>
                  <Typography variant="body2">{song.song_artist}</Typography>

                  {/* Heart Icon for removing the song */}
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      color: "red",
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the card click event from firing
                      handleRemoveSong(song.song_id);
                    }}
                  >
                    <Favorite />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography textAlign="center">No favorite songs found.</Typography>
      )}

      {/* Audio Player */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          backgroundColor: "background.paper",
          boxShadow: "0px -2px 8px rgba(0, 0, 0, 0.1)",
          zIndex: 1200,
        }}
      >
        <audio
          ref={audioRef}
          src={songUrls[currentSongIndex]}
          autoPlay
          onLoadedMetadata={() => {
            if (audioRef.current) {
              setDuration(audioRef.current.duration);
            }
          }}
          onTimeUpdate={handleTimeUpdate}
          onEnded={playNextSong}
        />
        <Grid container spacing={2} sx={{ padding: 2, alignItems: "center" }}>
          {/* Time and Controls */}
          <Grid item xs={12} md={12}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <CardMedia
                component="img"
                height="120"
                sx={{
                  width: 120,
                  borderRadius: 1,
                }}
                image={favoriteSongs[currentSongIndex]?.song_image || placeholderImage}
                alt={`Current Song`}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Slider
                  value={currentTime}
                  max={duration || 100}
                  step={1}
                  onChange={handleSeekChange}
                  sx={{ marginBottom: 1 }}
                />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="caption">{formatTime(currentTime)}</Typography>
                  <Typography variant="caption">{formatTime(duration)}</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Player Controls and Volume */}
          <Grid item xs={12} md={11}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
                <IconButton onClick={playPreviousSong}>
                  <SkipPrevious />
                </IconButton>
                <IconButton onClick={togglePause}>
                  {isPaused ? <PlayArrow /> : <Pause />}
                </IconButton>
                <IconButton onClick={playNextSong}>
                  <SkipNext />
                </IconButton>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={1}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <VolumeDown />
                <Slider
                  value={volume}
                  onChange={handleVolumeChange}
                  step={0.1}
                  min={0}
                  max={1}
                  sx={{ width: 100 }}
                />
                <VolumeUp />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default RecommendationSongs;
