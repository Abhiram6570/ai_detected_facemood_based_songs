import React, { useState, useEffect } from 'react';
import { Card, Grid, Typography, Box, Container, Alert } from '@mui/material';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import CardContent from '@mui/material/CardContent';
import { useUser } from 'components/UserContext'; // Custom hook for accessing user data
import './index.css';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const { user } = useUser(); // Access user context

  const [songStats, setSongStats] = useState(null); // State to hold song stats data

  // Fetch the song stats data
  useEffect(() => {
    const fetchSongStats = async (email) => {
      try {
        const response = await fetch(import.meta.env.VITE_GET_SONGS_COUNT, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Admin-Email': user.email, // Pass the admin email in header
          },
        });
        const data = await response.json();
        setSongStats(data); // Set data into state
      } catch (error) {
        console.error('Error fetching song stats:', error);
      }
    };

    fetchSongStats();
  }, []);

  // Check if user is logged in
  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error">User not logged in. Please log in to change your password.</Alert>
      </Container>
    );
  }

  const fullname = user.fullname;

  if (!songStats) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="info">Loading song statistics...</Alert>
      </Container>
    );
  }

  const { total_moods, total_songs, moods } = songStats;

  // Image URLs for moods
  const images = {
    Happy: "https://img.freepik.com/free-vector/happy-baby-concept-illustration_114360-30557.jpg?t=st=1737044182~exp=1737047782~hmac=3ff467d0b7e73915f848d87abe915f4e061ee03c23d457f1bd0fb0aaf9df79c7&w=826",
    Angry: "https://img.freepik.com/free-vector/angry-woman-concept-illustration_114360-17662.jpg?t=st=1737128626~exp=1737132226~hmac=157074c9d6ab566f3fedbf522caf8450afe80386c591ba1e16722571ff4c83fa&w=826",
    Sad: "https://img.freepik.com/free-vector/sad-boy-with-sweat-drops_1308-170838.jpg?t=st=1737052942~exp=1737056542~hmac=9aa493f227e12b4617284329d98104455435e952b35b6403208579688ab9206d&w=740", // Replace with your actual sad image URL
    Surprise: "https://img.freepik.com/free-vector/surprise-gift-concept-illustration_114360-23104.jpg?t=st=1737128869~exp=1737132469~hmac=4d87f1c548d60978aa48fd95ece33295e3ab81279d614c0d6fe1aede8d4d5abc&w=826", // Replace with your actual surprised image URL
    Disgust: "https://img.freepik.com/free-vector/bullying-illustration-concept_23-2148600657.jpg?t=st=1737128758~exp=1737132358~hmac=c586f832cfe05a5ae526b774aad7a700bcde1c36f9d20287b467618dd037b225&w=826",
    Fear: "https://img.freepik.com/free-vector/panic-disorder-concept-illustration_114360-21442.jpg?t=st=1737130608~exp=1737134208~hmac=8a2b2314eb76c7e5e7d94e9c25bcab07c4644aaa550e7dda95f62dc9aefa9d5b&w=826",
    Neutral: "https://img.freepik.com/free-vector/brunette-man-with-sunglasses_24908-81405.jpg?t=st=1737130688~exp=1737134288~hmac=ce0b5824b7fffe25893ff5c8c9363041f62160476795cc03710e726afeefca04&w=826",
  };

  return (
    <>
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        {/* row 1 */}
        <Grid item xs={12} sx={{ mb: -2.25 }}>
          <Typography variant="h5">Dashboard</Typography>
        </Grid>

        <Grid item xs={12}>
          <Card
            sx={{
              height: '150px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(to right, #6a11cb, #2575fc)',
              color: 'white',
              boxShadow: 3,
              textAlign: 'center',
              padding: 2,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Hi Welcome, {fullname}
              </Typography>
              <Typography variant="subtitle1">
                Enjoy the experience! This is a face detection mood-based AI application recommending songs based on your emotions.
              </Typography>
              {/* Balloon Animation */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                <img
                  src="https://js.pngtree.com/a4/static/l03b0s.d57ca31e.gif"
                  alt="Balloon 1"
                  className="balloon"
                />
                <img
                  src="https://js.pngtree.com/a4/static/l03b0s.d57ca31e.gif"
                  alt="Balloon 2"
                  className="balloon"
                />
                <img
                  src="https://js.pngtree.com/a4/static/l03b0s.d57ca31e.gif"
                  alt="Balloon 3"
                  className="balloon"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Analytics Cards */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce title="Total Moods" count={total_moods} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce title="Total Songs" count={total_songs} />
        </Grid>

        {/* Individual Moods Cards with Images */}
        {moods.map((mood) => {
          // Normalize the mood name (convert to lowercase)
          const moodName = mood.mood;

          // Debug log to check mood name and image being assigned
          // console.log("Mood:", mood.mood);
          // console.log("Image URL:", images[moodName]);

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={mood.mood}>
              <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
                {/* Mood Image */}
                <img
                  src={images[moodName]} // Default to happy if no image found
                  alt={mood.mood}
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    marginBottom: '10px',
                  }}
                />
                <Typography variant="h6">{`Total ${mood.mood} Songs`}</Typography>
                <Typography variant="h5" color="primary">{mood.mood_song_count}</Typography>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}
