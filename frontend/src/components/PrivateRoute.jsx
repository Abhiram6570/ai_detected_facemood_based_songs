// PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from 'components/UserContext'; // Adjust path as needed

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useUser(); // Get user data from context

  if (allowedRoles && !allowedRoles.includes(user.type)) {
    return <Navigate to="/not-authorized" />;
  }

  return children; // Render the protected component
};

export default PrivateRoute;