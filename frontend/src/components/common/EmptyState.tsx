import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Inbox } from '@mui/icons-material';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  fullHeight?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon,
  actionLabel,
  onAction,
  fullHeight = true,
}) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight={fullHeight ? '400px' : 'auto'}
      p={3}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: 'center',
          maxWidth: 400,
          bgcolor: 'background.default',
        }}
      >
        {icon || <Inbox sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />}
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {message}
        </Typography>
        {actionLabel && onAction && (
          <Button variant="contained" onClick={onAction} sx={{ mt: 2 }}>
            {actionLabel}
          </Button>
        )}
      </Paper>
    </Box>
  );
};
