import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Slider,
} from "@mui/material";
import {
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  VolumeUp,
  VolumeDown,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import "./RecommendationSongs.css";
import { useUser } from "../../components/UserContext";

function RecommendationSongs() {
  const location = useLocation();
  const emotion = location.state?.emotion || "";
  const [mood, setMood] = useState(emotion.toLowerCase());
  const [songUrls, setSongUrls] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [user_id, setUserId] = useState(null);
  const { user } = useUser();

    const [favoriteSongIds, setFavoriteSongIds] = useState([]);
  

    // const [favoriteSongIds, setFavoriteSongIds] = useState([]);
  

  const placeholderImage =
    "https://www.iconexperience.com/_img/v_collection_png/256x256/shadow/cd_music.png";

  
  
    useEffect(() => {
      async function fetchProfileAndData() {
        try {
          const email = user?.email;
  
          if (!email) throw new Error("User email not found.");
  
          const response = await fetch(import.meta.env.VITE_PROFILE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
  
          if (!response.ok) throw new Error("Failed to fetch profile.");
  
          const data = await response.json();
          if (data.message !== "User found") throw new Error("User not found.");
  
          const userId = data.user.id;

          setUserId(userId);
          await fetchSongs(mood, userId);
          await fetchFavoriteSongs(userId);
        } catch (err) {
          setError(err.message);
        }
      }
  
      if (user) fetchProfileAndData();
    }, [user, mood]);
  
    const fetchSongs = async (selectedMood, userId) => {
      try {
        const response = await axios.post(
          import.meta.env.VITE_RECOMMEND_SONGS,
          { mood: selectedMood, user_id: userId }
        );
        if (response.data.songs && response.data.songs.length > 0) {
          setSongUrls(
            response.data.songs.map((song) => ({
              id: song.id,
              file_path: song.file_path,
            }))
          );
          setError("");
        } else {
          setError("No songs found for this mood.");
        }
      } catch (error) {
        setError("Failed to fetch songs. Please try again later.");
      }
    };
  
    const fetchFavoriteSongs = async (userId) => {
      try {
        const response = await fetch(import.meta.env.VITE_FAV_SONGS, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId }),
        });
  
        if (response.ok) {
          const data = await response.json();
          if (data.songs) {
            const songIds = data.songs.map((song) => song.song_id);
            setFavoriteSongIds(songIds);
          } else {
            setFavoriteSongIds([]);
          }
        } else {
          throw new Error("Failed to fetch favorite songs.");
        }
      } catch (error) {
        setError("Error fetching favorite songs.");
      }
    };




  const toggleFavorite = async (songId, user_id) => {
    try {
      let updatedFavorites;
      if (favoriteSongIds.includes(songId)) {
        await axios.post(import.meta.env.VITE_REMOVE_FAV_SONGS, {
          user_id,
          song_id: songId,
        });
        updatedFavorites = favoriteSongIds.filter((id) => id !== songId);
      } else {
        await axios.post(import.meta.env.VITE_ADD_FAV_SONGS, {
          user_id,
          song_id: songId,
        });
        updatedFavorites = [...favoriteSongIds, songId];
      }
  
      // Update the favoriteSongIds state directly
      setFavoriteSongIds(updatedFavorites);
    } catch (error) {
      console.error("Error adding/removing favorite:", error.response?.data || error.message);
    }
  };
  



  const playNextSong = () => {
    if (currentSongIndex < songUrls.length - 1) {
      setCurrentSongIndex((prevIndex) => prevIndex + 1);
    } else {
      alert("You have reached the end of the playlist.");
    }
  };

  const playPreviousSong = () => {
    if (currentSongIndex > 0) {
      setCurrentSongIndex((prevIndex) => prevIndex - 1);
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
    if (audioRef.current) {
      audioRef.current.volume = newValue;
    }
  };

  const handleSeekChange = (event, newValue) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newValue;
      setCurrentTime(newValue);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <Box sx={{ paddingBottom: 10 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Detected Mood: {mood.charAt(0).toUpperCase() + mood.slice(1)}
      </Typography>

      {error && (
        <Typography color="error" textAlign="center">
          {error}
        </Typography>
      )}

      <Grid container spacing={3} sx={{ padding: 2 }}>
             {songUrls.map((song, index) => {
               const isFavorite = favoriteSongIds.includes(song.id);
          return (
            <Grid item xs={12} sm={3} md={2} key={song.id}>
              <Card
                sx={{
                  boxShadow: index === currentSongIndex ? 5 : 1,
                  border: index === currentSongIndex ? 2 : 0,
                  borderColor: "primary.main",
                  cursor: "pointer",
                  textAlign: "center",
                  "&:hover": { boxShadow: 5 },
                }}
                onClick={() => setCurrentSongIndex(index)}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 120,
                    position: "relative",
                  }}
                >
                  <IconButton
                    sx={{ position: "absolute", top: 8, right: 8, color: isFavorite ? "red" : "red" }}
                    onClick={() => toggleFavorite(song.id, user_id)}
                  >
                    {isFavorite ? <Favorite /> : <FavoriteBorder />}
                  </IconButton>
                  <CardMedia
                    component="img"
                    sx={{ width: 120, borderRadius: 1 }}
                    image={placeholderImage}
                    alt={`Song ${index + 1}`}
                  />
                </Box>
                <CardContent>
                  <Typography variant="body1" fontWeight="bold">
                    {song.file_path.split("/").pop()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

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
          src={songUrls[currentSongIndex]?.file_path || ""}
          autoPlay
          onLoadedMetadata={() => {
            if (audioRef.current) {
              setDuration(audioRef.current.duration);
              setCurrentTime(0);
            }
          }}
          onTimeUpdate={() => {
            if (audioRef.current) {
              setCurrentTime(audioRef.current.currentTime);
            }
          }}
          onEnded={playNextSong}
        />
        <Grid container spacing={2} sx={{ padding: 2, alignItems: "center" }}>
          <Grid item xs={12} md={12}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <CardMedia
                component="img"
                height="120"
                sx={{ width: 120, borderRadius: 1 }}
                image={placeholderImage}
                alt="Current Song"
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

          <Grid item xs={12} md={11}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, justifyContent: "center" }}>
              <IconButton onClick={playPreviousSong}>
                <SkipPrevious />
              </IconButton>
              <IconButton onClick={togglePause}>
                {isPaused ? <PlayArrow /> : <Pause />}
              </IconButton>
              <IconButton onClick={playNextSong}>
                <SkipNext />
              </IconButton>
              <VolumeDown />
              <Slider
                value={volume}
                min={0}
                max={1}
                step={0.01}
                onChange={handleVolumeChange}
                sx={{ width: 200 }}
              />
              <VolumeUp />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default RecommendationSongs;
