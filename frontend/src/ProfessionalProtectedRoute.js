import React, { createContext, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthCheck from './hooks/useAuthCheck';
import { NotificationProvider } from './contexts/NotificationContext';
import { CircularProgress, Box } from '@mui/material';

// ✅ Create context for professional authentication
const ProfessionalAuthContext = createContext();

// ✅ Custom hook to use this context
export const useProfessionalAuth = () => useContext(ProfessionalAuthContext);

const ProfessionalProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuthCheck();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress size={60} thickness={5} sx={{ color: '#FDBE00' }} />
      </Box>
    );
  }

  if (!isAuthenticated) return <Navigate to="/pro/enter" />;

  return (
    <NotificationProvider userId={user.profId} userType="professional">
      <ProfessionalAuthContext.Provider value={{ user, isAuthenticated }}>
        {children}
      </ProfessionalAuthContext.Provider>
    </NotificationProvider>
  );
};

export default ProfessionalProtectedRoute;
