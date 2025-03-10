import React from 'react';
import { Navigate } from 'react-router-dom';
import useClientAuthCheck from './hooks/useClientAuthCheck';
import { NotificationProvider } from './contexts/NotificationContext';
import { CircularProgress, Box } from '@mui/material';


const ClientProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useClientAuthCheck();


  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh', // Full height for centering
        }}
      >
        <CircularProgress size={60} thickness={5} sx={{ color: '#FDBE00' }} />
      </Box>
    );
  }

  if (!isAuthenticated) return <Navigate to="/sign-in" />;

  return (
    <NotificationProvider userId={user.id} userType="client">
      {React.cloneElement(children, { user, isAuthenticated })}
    </NotificationProvider>
  );
};

export default ClientProtectedRoute;
