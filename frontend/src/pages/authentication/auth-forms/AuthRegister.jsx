import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Card, CardContent, CircularProgress, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const Register = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState({
    buttonColor: '#000',
    textColor: '#000',
    backgroundColor: '#fff',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      setTheme({ buttonColor: '#FFA500', textColor: '#000', backgroundColor: '#FFF7E0' });
    } else if (hour >= 12 && hour < 18) {
      setTheme({ buttonColor: '#00BFFF', textColor: '#000', backgroundColor: '#ddefff' });
    } else if (hour >= 18 && hour < 21) {
      setTheme({ buttonColor: '#FF4500', textColor: '#FFF', backgroundColor: '#FFD700' });
    } else {
      setTheme({ buttonColor: '#4B0082', textColor: '#FFF', backgroundColor: '#2C2C54' });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!fullname.trim()) {
      setErrorMessage('Fullname is required.');
      setLoading(false);
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Email is required.');
      setLoading(false);
      return;
    }
    if (!email.endsWith('@gmail.com')) {
      setErrorMessage('Email must be a Gmail address (e.g., example@gmail.com).');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match.");
      setLoading(false);
      return;
    }

    const data = JSON.stringify({ fullname, email, password });

    try {
      const response = await axios.post(import.meta.env.VITE_REGISTER, data, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Account Created!',
          text: 'Your account has been created successfully.',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate('/'); // Redirect to login page after success
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        // minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card style={{ maxWidth: 400, padding: '20px', boxShadow: '0px 4px 20px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            AI MUSIC
          </Typography>
          <Typography variant="subtitle1" align="center" gutterBottom>
            Unlock the Music of Your Face Mood
          </Typography>
          {errorMessage && (
            <Typography color="error" align="center">
              {errorMessage}
            </Typography>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Fullname"
              variant="outlined"
              margin="normal"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              style={{ backgroundColor: theme.buttonColor, color: theme.textColor, marginTop: '16px' }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign Up'}
            </Button>
            <Typography variant="body2" align="center" style={{ marginTop: '16px' }}>
              Already have an account?{' '}
              <Link href="/" style={{ color: theme.textColor }}>
                Sign In
              </Link>
            </Typography>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
