import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { tripService } from '../../services/trip.service';
import { apiClient } from '../../services/api';

interface Props {
  open: boolean;
  onClose: () => void;
  vehicleId: string;
  onImported?: () => void;
}

export const ImportTripsModal: React.FC<Props> = ({ open, onClose, vehicleId, onImported }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
        setError('Chỉ chấp nhận file CSV');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
      setSuccess(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const result = await apiClient.post<any>(`/api/vehicles/${vehicleId}/trips/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess(`Đã import thành công ${result.data?.data?.total_trips || 0} chuyến đi`);
      onImported?.();
    } catch (err: any) {
      setError(err?.message || 'Lỗi khi import file');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setError(null);
    setSuccess(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Import Trips từ File CSV</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Upload file CSV chứa dữ liệu hành trình để đồng bộ với xe điện.
        </Typography>

        <Box
          sx={{
            border: '2px dashed #ccc',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            cursor: 'pointer',
            '&:hover': { borderColor: 'primary.main' },
          }}
          onClick={() => document.getElementById('csv-file-input')?.click()}
        >
          <CloudUpload sx={{ fontSize: 48, color: 'action.disabled' }} />
          <Typography variant="h6" sx={{ mt: 1 }}>
            {file ? file.name : 'Click để chọn file CSV'}
          </Typography>
        <Typography variant="body2" color="text.secondary">
          File CSV với cột: start_time, end_time, distance_km, start_lat, start_long, end_lat, end_long, notes
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          <a href="/sample-trips.csv" download target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2' }}>
            📥 Download file mẫu
          </a>
        </Typography>
        </Box>

        <input
          id="csv-file-input"
          type="file"
          accept=".csv"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}

        {loading && (
          <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
            <CircularProgress />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Hủy
        </Button>
        <Button
          onClick={handleImport}
          variant="contained"
          disabled={!file || loading}
        >
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
};