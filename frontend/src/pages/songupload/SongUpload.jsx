import React, { useState } from 'react';
import axios from 'axios';
import {
    TextField,
    Button,
    Typography,
    Container,
    Grid,
    Card,
    CardContent,
    InputAdornment,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';


import { SentimentVeryDissatisfied, SentimentSatisfied, SentimentSatisfiedAlt, SentimentVerySatisfied } from '@mui/icons-material';



import Swal from 'sweetalert2';
import { MusicNote, Person, Category, Mood } from '@mui/icons-material';
// import { MusicNote } from '@mui/icons-material'; // Import the MusicNote icon/
// import songadd from '../src/assets/images/sondadd.png'

export default function SongUpload() {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [genre, setGenre] = useState('');
    // const [mood, setMood] = useState('');
    // const [file, setFile] = useState(null);
    // const [mood, setMood] = useState('');
    const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const [mood, setMood] = useState('Neutral');

  const moodOptions = [
    { label: 'Neutral', color: 'lightgreen', icon: <Mood style={{ color: 'lightgreen' }} /> },
    { label: 'Angry', color: 'red', icon: <SentimentVeryDissatisfied style={{ color: 'red' }} /> },
    { label: 'Happy', color: 'orange', icon: <SentimentSatisfied style={{ color: 'orange' }} /> },
    { label: 'Fear', color: 'lightblue', icon: <Mood style={{ color: 'lightblue' }} /> },
    { label: 'Surprise', color: 'yellow', icon: <SentimentSatisfiedAlt style={{ color: 'yellow' }} /> },
    { label: 'Sad', color: 'gray', icon: <SentimentVeryDissatisfied style={{ color: 'gray' }} /> },
    { label: 'Disgust', color: 'pink', icon: <Mood style={{ color: 'pink' }} /> },
  ];


  const getMoodIcon = (moodLabel) => {
    const moodOption = moodOptions.find(option => option.label === moodLabel);
    return moodOption ? moodOption.icon : null;
  };

      
      const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        
        if (selectedFile) {
          const fileType = selectedFile.type;
          const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/mp4']; // MIME types for the allowed formats
    
          // Check if the file type is allowed
          if (!allowedTypes.includes(fileType)) {
            setError('File not supported. Please upload an audio file (.mp3, .wav, .flac, .m4a).');
            setFile(null); // Clear the file state
          } else {
            setError(''); // Clear error if file type is valid
            setFile(selectedFile); // Set the file state to the selected file
          }
        }
      };
    





    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!file) {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'Please upload a file.',
            });
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('artist', artist);
        formData.append('genre', genre);
        formData.append('mood', mood);
        formData.append('file', file);

        try {
            const API_URL_LINK = import.meta.env.VITE_BACKEND_URL; // e.g., 'http://localhost:5000'
            const SONG_ADD_PATH_LINK = 'addsongs/add_song'; // This is the correct path
            
            const response = await fetch(`${API_URL_LINK}/${SONG_ADD_PATH_LINK}`, {
                method: 'POST',
                body: formData,
                headers: {
                    // No need to set Content-Type for FormData
                },
            });

            // Check if the response is ok (status code 200-299)
            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || 'Failed to upload song.');
            }

            const responseData = await response.json();
            console.log(responseData);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: responseData.message,
            });


            
        } catch (error) {
            console.error('Error uploading song:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.message || 'Failed to upload song.',
            });
        }
    };

    return (
        <Container-fuild maxWidth="lg" sx={{ mt: 4 }}>
            <Card>
                <CardContent>
                <Typography className='text-center' variant="h1" gutterBottom>
                Upload Song
            </Typography>
                    <Grid container spacing={4}>

                        <Grid item xs={12} md={6}>
                           
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} mt={1} mb={2}>
                                        <TextField
                                            label="Title"
                                            variant="outlined"
                                            fullWidth
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <MusicNote />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} mt={1} mb={2}>
                                        <TextField
                                            label="Artist"
                                            variant="outlined"
                                            fullWidth
                                            value={artist}
                                            onChange={(e) => setArtist(e.target.value)}
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Person />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} mt={1} mb={2}>
                                        <TextField
                                            label="Genre"
                                            variant="outlined"
                                            fullWidth
                                            value={genre}
                                            onChange={(e) => setGenre(e.target.value)}
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Category />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} mt={1} mb={1}>
      <FormControl fullWidth required>
        <InputLabel id="mood-label">Mood</InputLabel>
        <Select
          labelId="mood-label"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              {getMoodIcon(mood)}
            </InputAdornment>
          }
          label="Mood"
        >
          {moodOptions.map((option) => (
            <MenuItem key={option.label} value={option.label}>
              <span style={{ fontSize: "20px" }}>{option.label}</span>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
                                    
                                    <Grid item xs={12} mt={1} mb={1}>
      <Button variant="contained" component="label" fullWidth startIcon={<MusicNote />}>
        Upload File
        <input
          type="file"
          hidden
          onChange={handleFileChange}
          required
          accept=".mp3, .wav, .flac, .m4a" // Specify allowed audio file types
        />
      </Button>
      {file && (
                                            <Typography variant="body1" style={{ color: 'green' }} mt={1}>
                                                Selected file: {file.name}
                                            </Typography>
                                        )}
                                        {error && (
                                            <Typography variant="body2" color="error" mt={1}>
                                                {error}
                                            </Typography>
                                        )}
    </Grid>
                                    <Grid item xs={12}>
                                        <Button type="submit" variant="contained" color="primary" fullWidth>
                                            Submit
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Grid>
                        <Grid item xs={12} md={6}>

    <img
        src='../src/assets/images/sondadd.png' // Sample music note image
        alt="Music Cover"
        style={{
            width: '100%',
            height: 'auto',
            borderRadius: '8px',
        }}
    />
</Grid>


                    </Grid>
                </CardContent>
            </Card>
        </Container-fuild>
    );
}
