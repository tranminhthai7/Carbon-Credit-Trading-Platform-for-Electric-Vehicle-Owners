import React from 'react';
import { Container, Box, Typography, Paper, Button } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Profile</Typography>
        <Box>
          <Typography variant="subtitle1">Name: {user.name}</Typography>
          <Typography variant="subtitle1">Email: {user.email}</Typography>
          <Typography variant="subtitle1">Role: {user.role}</Typography>
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" onClick={() => navigate(-1)}>Back</Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
