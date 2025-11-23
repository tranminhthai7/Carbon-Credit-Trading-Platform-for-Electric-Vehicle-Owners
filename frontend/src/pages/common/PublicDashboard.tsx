import React, { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import getDashboardPathForRole from '../../utils/navigation';

const PublicDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // If user exists, redirect to their role dashboard
      const path = getDashboardPathForRole(user.role);
      navigate(path, { replace: true });
    }
  }, [user, navigate]);

  if (user) return null; // redirect in effect

  return (
    <Box sx={{ p: 6, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Welcome to the EV Carbon Platform Dashboard
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Sign in to view your personalized dashboard and access features for EV Owners, Buyers, Verifiers, and Admins.
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button variant="contained" color="primary" href="/login">
          Sign In
        </Button>
        <Button variant="outlined" color="primary" href="/register">
          Sign Up
        </Button>
      </Box>

      <Box sx={{ mt: 6 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Sample data preview
        </Typography>
        <Typography variant="body2">Your dashboard content will appear here after signing in.</Typography>
      </Box>
    </Box>
  );
};

export default PublicDashboard;
