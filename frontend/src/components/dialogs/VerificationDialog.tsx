import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Divider,
  Alert,
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import { Verification } from '../../types';
import { format } from 'date-fns';

interface VerificationDialogProps {
  open: boolean;
  verification: Verification | null;
  action: 'approve' | 'reject' | null;
  onClose: () => void;
  onConfirm: (comments: string) => Promise<void>;
}

export const VerificationDialog: React.FC<VerificationDialogProps> = ({
  open,
  verification,
  action,
  onClose,
  onConfirm,
}) => {
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await onConfirm(comments);
      setComments('');
      onClose();
    } catch (error) {
      console.error('Failed to process verification:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!verification) return null;

  const isApprove = action === 'approve';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          {isApprove ? (
            <CheckCircle color="success" />
          ) : (
            <Cancel color="error" />
          )}
          <Typography variant="h6">
            {isApprove ? 'Approve' : 'Reject'} Verification
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Alert severity={isApprove ? 'success' : 'warning'} sx={{ mb: 2 }}>
          {isApprove
            ? 'This will approve the trip and generate carbon credits.'
            : 'This will reject the trip. Please provide a reason.'}
        </Alert>

        <Typography variant="subtitle2" gutterBottom>
          Trip Details
        </Typography>
        <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1, mb: 2 }}>
          <Typography variant="body2">
            <strong>Trip ID:</strong> {verification.tripId}
          </Typography>
          <Typography variant="body2">
            <strong>Submitted:</strong>{' '}
            {format(new Date(verification.createdAt), 'MMM dd, yyyy HH:mm')}
          </Typography>
          <Typography variant="body2">
            <strong>Status:</strong> {verification.status}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <TextField
          fullWidth
          multiline
          rows={4}
          label={isApprove ? 'Comments (optional)' : 'Rejection Reason (required)'}
          placeholder={
            isApprove
              ? 'Add any notes about this verification...'
              : 'Please explain why this trip is being rejected...'
          }
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          required={!isApprove}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color={isApprove ? 'success' : 'error'}
          disabled={submitting || (!isApprove && !comments.trim())}
          startIcon={isApprove ? <CheckCircle /> : <Cancel />}
        >
          {submitting ? 'Processing...' : isApprove ? 'Approve' : 'Reject'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
