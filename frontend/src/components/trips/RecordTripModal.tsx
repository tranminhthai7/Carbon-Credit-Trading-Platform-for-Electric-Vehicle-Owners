import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Alert,
} from '@mui/material';
import { tripService } from '../../services/trip.service';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated?: (created: any) => void;
}

export const RecordTripModal: React.FC<Props> = ({ open, onClose, onCreated }) => {
  const [distance, setDistance] = useState('');
  const [energy, setEnergy] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setDistance('');
    setEnergy('');
    setStartTime('');
    setEndTime('');
    setStartLocation('');
    setEndLocation('');
    setNotes('');
    setError(null);
    setLoading(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async () => {
    setError(null);
    // basic validation on client to prevent malformed payloads
    if (!startTime || !endTime) {
      setError('Start time and End time are required');
      return;
    }
    if (!distance || Number.isNaN(Number(distance)) || Number(distance) <= 0) {
      setError('Distance must be a positive number');
      return;
    }

    const payload: any = {
      startTime,
      endTime,
      distance: Number(distance),
      energyConsumed: energy ? Number(energy) : undefined,
      startLocation: startLocation ? { address: startLocation } : undefined,
      endLocation: endLocation ? { address: endLocation } : undefined,
      notes: notes || undefined,
    };

    try {
      setLoading(true);
      const created = await tripService.createTrip(payload as any);
      if (onCreated) onCreated(created);
      handleClose();
    } catch (err: any) {
      // Prefer server-side validation response if available
      const serverMsg = err?.response?.data?.message;
      const serverErrors = err?.response?.data?.errors;
      if (Array.isArray(serverErrors) && serverErrors.length > 0) {
        setError(serverErrors.map((e: any) => `${e.field}: ${e.message}`).join('; '));
      } else if (serverMsg) {
        setError(typeof serverMsg === 'string' ? serverMsg : JSON.stringify(serverMsg));
      } else {
        setError(err?.message || 'Failed to create trip');
      }
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Record New Trip</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Distance (km)"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              fullWidth
              type="number"
              inputProps={{ step: 'any' }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Energy Consumed (kWh)"
              value={energy}
              onChange={(e) => setEnergy(e.target.value)}
              fullWidth
              type="number"
              inputProps={{ step: 'any' }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Start Time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              fullWidth
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="End Time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              fullWidth
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Start Location (optional)"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="End Location (optional)"
              value={endLocation}
              onChange={(e) => setEndLocation(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              fullWidth
              multiline
              rows={3}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={onSubmit} variant="contained" disabled={loading}>
          {loading ? 'Saving...' : 'Record Trip'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecordTripModal;
