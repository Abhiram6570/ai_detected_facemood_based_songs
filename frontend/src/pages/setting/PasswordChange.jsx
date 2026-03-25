import React, { useState, useEffect } from 'react';
import {
    Typography,
    Container,
    TextField,
    Button,
    Card,
    CardContent,
    Alert,
} from '@mui/material';
import { useUser } from 'components/UserContext';
import ProtectedRoute from 'components/ProtectedRoute';  // Import ProtectedRoute

export default function PasswordChange() {
    const { user } = useUser(); 
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Function to check password strength
    const checkPasswordStrength = (password) => {
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
        const mediumPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (password.length < 8) {
            return 'Poor';
        }
        if (strongPasswordRegex.test(password)) {
            return 'Strong';
        }
        if (mediumPasswordRegex.test(password)) {
            return 'Weak';
        }
        return 'Poor';
    };

    // Handle password input change and validate strength
    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setNewPassword(value);
        setPasswordStrength(checkPasswordStrength(value));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (newPassword !== confirmPassword) {
            setError('New password and confirmation do not match.');
            return;
        }

        if (passwordStrength === 'Poor') {
            setError('Password strength is too weak. Ensure it is at least 8 characters and includes upper/lowercase, numbers, and special characters.');
            return;
        }

        setLoading(true); // Disable the button during the API request

        try {
            const response = await fetch(import.meta.env.VITE_PASSWORD_CHANGE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user.email,
                    old_password: oldPassword,
                    password: newPassword,
                    cpassword: confirmPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to change password.');
            }

            setMessage('Password changed successfully.');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false); // Re-enable the button
        }
    };

    return (
        <ProtectedRoute>
            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h1" gutterBottom align="center">
                            Change Password
                        </Typography>

                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Email"
                                variant="outlined"
                                margin="normal"
                                value={user.email}
                                disabled
                            />
                            <TextField
                                fullWidth
                                label="Old Password"
                                type="password"
                                variant="outlined"
                                margin="normal"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                            <TextField
                                fullWidth
                                label="New Password"
                                type="password"
                                variant="outlined"
                                margin="normal"
                                value={newPassword}
                                onChange={handlePasswordChange}
                                required
                                helperText={`Password Strength: ${passwordStrength}`}
                            />
                            <TextField
                                fullWidth
                                label="Confirm New Password"
                                type="password"
                                variant="outlined"
                                margin="normal"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2 }}
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : 'Change Password'}
                            </Button>
                        </form>

                        {/* Show messages */}
                        {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
                        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                    </CardContent>
                </Card>
            </Container>
        </ProtectedRoute>
    );
}
