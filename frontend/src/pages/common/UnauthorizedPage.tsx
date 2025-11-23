import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <Box sx={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Unauthorized
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          You don't have permission to view this page.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/login')}>Go to login</Button>
      </Box>
    </Container>
  );
};

export default UnauthorizedPage;
