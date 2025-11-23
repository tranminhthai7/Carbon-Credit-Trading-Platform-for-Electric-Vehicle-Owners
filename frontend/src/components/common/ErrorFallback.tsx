import React from 'react';
import { Box, Typography, Button } from '@mui/material';

export const ErrorFallback: React.FC<{ error?: Error | null }> = ({ error }) => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">Something went wrong</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{error?.message}</Typography>
      <Button variant="contained" sx={{ mt: 2 }} onClick={() => window.location.reload()}>Reload</Button>
    </Box>
  );
};

export default ErrorFallback;
