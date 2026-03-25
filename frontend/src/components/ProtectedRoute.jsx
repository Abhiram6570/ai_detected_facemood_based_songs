import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from 'components/UserContext';
import { validateToken } from './ValidateToken';  // Ensure validateToken is imported

const ProtectedRoute = ({ children }) => {
  const { user, login } = useUser();  // Access user and login from UserContext
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        if (user) {
          // User is already authenticated
          setLoading(false);
          return;
        }

        // If no user, validate token
        const validatedUser = await validateToken();

        if (validatedUser) {
          login(validatedUser); // Save validated user to context
        } else {
          console.error('[ERROR] Invalid or expired token.');
        }
      } catch (error) {
        console.error('[ERROR] Token validation failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, [user, login]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children; // Render protected route
};

export default ProtectedRoute;
