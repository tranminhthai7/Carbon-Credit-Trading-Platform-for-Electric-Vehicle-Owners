import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Button } from '@mui/material';
import { authService } from '../../services/auth.service';
import { getDashboardPathForRole } from '../../utils/navigation';

export const DevLogin: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userParam = params.get('user');
    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        // redirect based on role
        const dest = getDashboardPathForRole(user.role);
        navigate(dest);
      } catch (err) {
        console.error('DevLogin parse error', err);
      }
    }
  }, [navigate]);

  const handleManual = async () => {
    try {
      // For convenience, call backend to get an access token for a pre-created test user
      const response = await authService.login({ email: 'dev@local.test', password: 'Testpass123!' });
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      // redirect to owner's dashboard by default
      navigate(getDashboardPathForRole(response.user.role));
    } catch (err) {
      console.error('Dev manual login failed', err);
      alert('Dev auto login failed. Please login manually.');
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Dev Auto Login
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        This page helps you quickly sign into a local dev account. Use the `token` and `user` query parameters
        to auto-login, e.g. /dev-login?token=&lt;token&gt;&user=&lt;encodedUser&gt;
      </Typography>
      <Button variant="contained" onClick={handleManual}>
        Auto Login (dev@local.test)
      </Button>
    </Box>
  );
};

export default DevLogin;
