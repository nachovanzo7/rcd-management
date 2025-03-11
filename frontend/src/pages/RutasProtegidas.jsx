import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../pages/context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const RoleBasedRoute = ({ allowedRoles, children }) => {
  const { token, role, loading } = useContext(AuthContext);
  const isLoggedIn = Boolean(token);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isLoggedIn) return <Navigate to="/" />;
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default RoleBasedRoute;
