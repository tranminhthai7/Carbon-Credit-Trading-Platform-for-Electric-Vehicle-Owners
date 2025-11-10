import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Alert,
} from '@mui/material';
import { DirectionsCar } from '@mui/icons-material';
import { tripService } from '../../services/trip.service';

interface TripFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  distance: string;
  energyConsumed: string;
  startTime: string;
  endTime: string;
  startLocation: string;
  endLocation: string;
}

interface FormErrors {
  distance?: string;
  energyConsumed?: string;
  startTime?: string;
  endTime?: string;
}

export const TripFormDialog: React.FC<TripFormDialogProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<FormData>({
    distance: '',
    energyConsumed: '',
    startTime: '',
    endTime: '',
    startLocation: '',
    endLocation: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate distance
    const distance = parseFloat(formData.distance);
    if (!formData.distance) {
      newErrors.distance = 'Distance is required';
    } else if (isNaN(distance) || distance <= 0) {
      newErrors.distance = 'Distance must be greater than 0';
    } else if (distance > 1000) {
      newErrors.distance = 'Distance seems too large (max 1000 km)';
    }

    // Validate energy
    const energy = parseFloat(formData.energyConsumed);
    if (!formData.energyConsumed) {
      newErrors.energyConsumed = 'Energy consumed is required';
    } else if (isNaN(energy) || energy <= 0) {
      newErrors.energyConsumed = 'Energy must be greater than 0';
    } else if (energy > 200) {
      newErrors.energyConsumed = 'Energy seems too large (max 200 kWh)';
    }

    // Validate times
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }
    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    // Validate time order
    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      if (end <= start) {
        newErrors.endTime = 'End time must be after start time';
      }
      if (end > new Date()) {
        newErrors.endTime = 'End time cannot be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setSubmitting(true);
      setErrorMessage('');

      await tripService.createTrip({
        distance: parseFloat(formData.distance),
        energyConsumed: parseFloat(formData.energyConsumed),
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
      });

      // Reset form
      setFormData({
        distance: '',
        energyConsumed: '',
        startTime: '',
        endTime: '',
        startLocation: '',
        endLocation: '',
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating trip:', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to create trip. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      onClose();
      // Reset form after close animation
      setTimeout(() => {
        setFormData({
          distance: '',
          energyConsumed: '',
          startTime: '',
          endTime: '',
          startLocation: '',
          endLocation: '',
        });
        setErrors({});
        setErrorMessage('');
      }, 200);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" display="flex" alignItems="center" gap={1}>
          <DirectionsCar /> Record New Trip
        </Typography>
      </DialogTitle>
      <DialogContent>
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Distance"
              type="number"
              value={formData.distance}
              onChange={handleChange('distance')}
              error={!!errors.distance}
              helperText={errors.distance || 'Enter distance in kilometers'}
              InputProps={{
                endAdornment: <Typography color="text.secondary">km</Typography>,
              }}
              inputProps={{
                min: 0,
                step: 0.1,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Energy Consumed"
              type="number"
              value={formData.energyConsumed}
              onChange={handleChange('energyConsumed')}
              error={!!errors.energyConsumed}
              helperText={errors.energyConsumed || 'Energy used in kilowatt-hours'}
              InputProps={{
                endAdornment: <Typography color="text.secondary">kWh</Typography>,
              }}
              inputProps={{
                min: 0,
                step: 0.1,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Start Time"
              type="datetime-local"
              value={formData.startTime}
              onChange={handleChange('startTime')}
              error={!!errors.startTime}
              helperText={errors.startTime}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="End Time"
              type="datetime-local"
              value={formData.endTime}
              onChange={handleChange('endTime')}
              error={!!errors.endTime}
              helperText={errors.endTime}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Start Location (Optional)"
              value={formData.startLocation}
              onChange={handleChange('startLocation')}
              placeholder="e.g., Home, Office"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="End Location (Optional)"
              value={formData.endLocation}
              onChange={handleChange('endLocation')}
              placeholder="e.g., Shopping Mall, Park"
            />
          </Grid>

          <Grid item xs={12}>
            <Alert severity="info" sx={{ mt: 1 }}>
              <Typography variant="caption">
                <strong>Note:</strong> Your trip will be submitted for verification by a CVA
                (Carbon Verification Agent). Verified trips will earn carbon credits.
              </Typography>
            </Alert>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting}
          startIcon={<DirectionsCar />}
        >
          {submitting ? 'Creating Trip...' : 'Record Trip'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
