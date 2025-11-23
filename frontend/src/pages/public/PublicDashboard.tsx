import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import getDashboardPathForRole from '../../utils/navigation';

const PublicDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const dest = getDashboardPathForRole(user.role);
      navigate(dest, { replace: true });
    }
  }, [user, navigate]);

  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Welcome to EV Carbon Platform
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        This is a public overview of the dashboard. Log in to see personalized data and reports.
      </Typography>
      <Button variant="contained" color="primary" href="/login">
        Sign in
      </Button>
    </Box>
  );
};

export default PublicDashboard;
