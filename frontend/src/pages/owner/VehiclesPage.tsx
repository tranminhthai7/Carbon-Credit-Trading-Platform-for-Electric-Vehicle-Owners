import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add } from '@mui/icons-material';
import { vehicleService } from '../../services/trip.service';
import { Vehicle } from '../../types';

export const VehiclesPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<Partial<Vehicle>>({ make: '', model: '', year: undefined, batteryCapacity: undefined, registrationNumber: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const data = await vehicleService.getMyVehicles();
        // the backend may return either an array or an object { success, count, data }
        // debug: log the raw response so we can inspect shapes in the browser console
        // (helps diagnosing the blank UI in some dev/test envs)
        // eslint-disable-next-line no-console
        console.debug('[VehiclesPage] vehicleService.getMyVehicles() returned', data);

        if (Array.isArray(data)) setVehicles(data);
        else if (data && Array.isArray((data as any).data)) setVehicles((data as any).data);
        else setVehicles([]);
      } catch (err) {
        console.error('Failed to load vehicles', err);
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const columns: GridColDef[] = [
    { field: 'make', headerName: 'Make', width: 150 },
    { field: 'model', headerName: 'Model', width: 150 },
    { field: 'year', headerName: 'Year', width: 110, type: 'number' },
    { field: 'batteryCapacity', headerName: 'Battery (kWh)', width: 150, type: 'number' },
    { field: 'registrationNumber', headerName: 'Registration', width: 180 },
    { field: 'createdAt', headerName: 'Added', width: 200 },
  ];

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setForm((prev) => ({ ...prev, [field]: field === 'year' || field === 'batteryCapacity' ? (v === '' ? undefined : Number(v)) : v }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Basic client-side validation (mirror server constraints)
      const nextErrors: Record<string, string> = {};
      if (!form.make || (form.make as string).trim() === '') nextErrors.make = 'Make is required';
      if (!form.model || (form.model as string).trim() === '') nextErrors.model = 'Model is required';
      const year = Number(form.year);
      const currentYear = new Date().getFullYear();
      if (!form.year || Number.isNaN(year)) nextErrors.year = 'Year is required';
      else if (year < 2000 || year > currentYear + 1) nextErrors.year = `Year must be between 2000 and ${currentYear + 1}`;

      const battery = Number(form.batteryCapacity);
      if (!form.batteryCapacity || Number.isNaN(battery)) nextErrors.batteryCapacity = 'Battery capacity is required';
      else if (battery < 10 || battery > 200) nextErrors.batteryCapacity = 'Battery capacity must be between 10 and 200 kWh';

      if (!form.registrationNumber || (form.registrationNumber as string).trim() === '') nextErrors.registrationNumber = 'License plate is required';

      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        throw new Error('validation');
      }

      const created = await vehicleService.registerVehicle({
        make: (form.make || '').toString(),
        model: (form.model || '').toString(),
        year: Number(form.year),
        batteryCapacity: Number(form.batteryCapacity),
        registrationNumber: form.registrationNumber || '',
      });

      // Defensive: normalize server wrapper -> ensure we always add a Vehicle object with `id`
      const createdObj = (created && (created as any).data) ? (created as any).data : created;
      const normalized = {
        id: (createdObj as any).id ?? (createdObj as any)._id,
        userId: (createdObj as any).userId ?? (createdObj as any).user_id,
        make: (createdObj as any).make,
        model: (createdObj as any).model,
        year: (createdObj as any).year,
        batteryCapacity: (createdObj as any).battery_capacity ?? (createdObj as any).batteryCapacity,
        registrationNumber: (createdObj as any).license_plate ?? (createdObj as any).registrationNumber,
        createdAt: (createdObj as any).created_at ?? (createdObj as any).createdAt,
        ...(createdObj || {}),
      } as Vehicle;

      setVehicles((prev) => [normalized, ...prev]);
      setForm({ make: '', model: '', year: undefined, batteryCapacity: undefined, registrationNumber: '' });
      setErrors({});
      handleClose();
    } catch (err: any) {
      // Log as a warning — validation failures like duplicate license plates
      // are expected in user flows and shouldn't be treated as fatal errors.
      console.warn('Failed to register vehicle', err?.message ?? err);

      // If server returned a 409 conflict (license plate duplicate) surface
      // the message as a field-level validation error instead of an alert.
      if (err?.status === 409 || /license plate|already registered|registration/i.test(err?.message)) {
        setErrors((prev) => ({ ...prev, registrationNumber: err?.message || 'License plate already registered' }));
      } else {
        // Fallback: show a friendlier formatted message from the api helper
        // (which extracts server message if present)
        // show the server-provided message when available
        alert(err?.message || 'Failed to create vehicle');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            My Vehicles
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage vehicles that can be used for recording trips and generating carbon credits.
          </Typography>
        </Box>
        <div>
          <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
            Register Vehicle
          </Button>
        </div>
      </Box>

      <Card>
        <CardContent>
          {vehicles.length === 0 ? (
            <Typography variant="body1">Bạn chưa có phương tiện nào. Hãy thêm phương tiện mới.</Typography>
          ) : (
            <div style={{ width: '100%' }}>
              <DataGrid
                rows={vehicles}
                columns={columns}
                getRowId={(r) => r.id}
                initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                pageSizeOptions={[5, 10, 25]}
                autoHeight
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Register Vehicle</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Make"
                value={form.make ?? ''}
                onChange={handleChange('make')}
                fullWidth
                error={Boolean(errors.make)}
                helperText={errors.make}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Model"
                value={form.model ?? ''}
                onChange={handleChange('model')}
                fullWidth
                error={Boolean(errors.model)}
                helperText={errors.model}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Year"
                type="number"
                value={form.year ?? ''}
                onChange={handleChange('year')}
                fullWidth
                error={Boolean(errors.year)}
                helperText={errors.year}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Battery kWh"
                type="number"
                value={form.batteryCapacity ?? ''}
                onChange={handleChange('batteryCapacity')}
                fullWidth
                error={Boolean(errors.batteryCapacity)}
                helperText={errors.batteryCapacity}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="License plate"
                value={form.registrationNumber ?? ''}
                onChange={handleChange('registrationNumber')}
                fullWidth
                error={Boolean(errors.registrationNumber)}
                helperText={errors.registrationNumber}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={submitting}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={submitting}>{submitting ? 'Creating…' : 'Create Vehicle'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VehiclesPage;
