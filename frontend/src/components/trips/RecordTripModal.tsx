import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | undefined>(undefined);

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
    setVehicles([]);
    setSelectedVehicleId(undefined);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async () => {
    setError(null);
    if (!selectedVehicleId) {
      setError('Please select a vehicle for this trip');
      return;
    }
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
      vehicleId: selectedVehicleId,
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

  // Load user's vehicles when modal opens so we can show a dropdown
  useEffect(() => {
    if (!open) return;
    let mounted = true;
    const load = async () => {
      try {
        const items = await tripService.getMyVehicles();
        if (!mounted) return;
        setVehicles(items || []);
        if (Array.isArray(items) && items.length === 1) {
          setSelectedVehicleId(items[0].id);
        }
      } catch (err) {
        console.warn('Failed to load vehicles for record modal', err);
        setVehicles([]);
        setSelectedVehicleId(undefined);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [open]);

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
            <FormControl fullWidth sx={{ mb: 1 }}>
              <InputLabel id="vehicle-select-label">Vehicle</InputLabel>
              <Select
                labelId="vehicle-select-label"
                label="Vehicle"
                value={selectedVehicleId ?? ''}
                onChange={(e) => setSelectedVehicleId(e.target.value as string)}
              >
                {vehicles.length === 0 ? (
                  <MenuItem value="">No vehicles</MenuItem>
                ) : (
                  vehicles.map((v) => (
                    <MenuItem key={v.id} value={v.id}>{`${v.make || ''} ${v.model || ''} — ${v.registrationNumber || (v.license_plate ?? '')}`}</MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
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
