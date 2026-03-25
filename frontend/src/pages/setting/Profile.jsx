import React, { useState, useEffect } from 'react';
import {
    Typography,
    Container,
    Grid,
    Box,
    Card,
    CardContent,
    CircularProgress,
} from '@mui/material';
import { useUser } from 'components/UserContext'; // Import the custom hook to access user context
import { useNavigate } from 'react-router-dom';


import ProfileLogo from "../../assets/images/profile.png";




// import { useUser } from 'components/UserContext'; // Adjust path as needed
export default function ProfileInfo() {
    const navigate = useNavigate();
    const { user } = useUser(); // Call the `useUser` hook at the top level
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);

    if(!user){
        navigate("/Login"); 
      }

    useEffect(() => {
        
        if (!user) {
            setError("User not logged in.");
            return;
        }

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

                setProfile(data.user);
            } catch (err) {
                setError(err.message);
            }
        }

        fetchProfile();
    }, [user]); // Re-run the effect when `user` changes

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }

    if (!profile) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
                <CircularProgress />
                <Typography>Loading profile...</Typography>
            </Container>
        );
    }

    return (
        
        <Box  sx={{ mt: 1 }}>
            <Card>
                <CardContent>
                    <Typography
                        variant="h1"
                        gutterBottom
                        align="center"
                        sx={{ mb: 2, fontWeight: 'bold' }}
                    >
                        Profile Information
                    </Typography>

                    <Grid container spacing={4}>
                        <Grid
                            item
                            xs={12}
                            md={6}
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <img
                                src={ProfileLogo}
                                alt="Profile"
                                style={{
                                    width: '150px',
                                    height: '150px',
                                    borderRadius: '50%',
                                    marginBottom: '20px',
                                }}
                            />
                            <Typography variant="h2" gutterBottom>
                                User ID: <span style={{ fontWeight: 'bold', color:'red' }}>{profile.id}</span>
                            </Typography>
                            <Typography variant="h2" gutterBottom>
                                Full Name: <span style={{ fontWeight: 'bold', color:'red' }}>{profile.fullname}</span>
                            </Typography>
                            <Typography variant="h2" gutterBottom>
                                Email: <span style={{ fontWeight: 'bold', color:'red' }}>{profile.email}</span>
                            </Typography>
                            <Typography variant="h2" gutterBottom>
                                Created Date: <span style={{ fontWeight: 'bold', color:'red' }}>{profile.created_at}</span>
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={6}
                            container
                            justifyContent="center"
                            alignItems="center"
                        >
                            <img
                                src="../src/assets/images/profile.png"
                                alt="Side Image"
                                style={{
                                    width: '75%',
                                    height: 'auto',
                                    borderRadius: '8px',
                                }}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
}



