import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { CheckCircle, Cancel } from '@mui/icons-material';
import { verificationService } from '../../services/verification.service';
import { Verification } from '../../types';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';

export const VerificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [comments, setComments] = useState('');
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      const data = await verificationService.getPendingVerifications();
      setVerifications(data);
    } catch (error) {
      console.error('Failed to fetch verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!selectedVerification || !action || !user) return;
    try {
      if (action === 'approve') {
        await verificationService.approveVerification(selectedVerification.id, user.id, comments);
      } else {
        await verificationService.rejectVerification(selectedVerification.id, user.id, comments);
      }
      setSelectedVerification(null);
      setComments('');
      setAction(null);
      // Remove the processed verification from the list immediately
      setVerifications(prev => prev.filter(v => v.id !== selectedVerification.id));
      // Try to fetch updated list, but don't fail if it doesn't work
      try {
        await fetchVerifications();
      } catch (fetchError) {
        console.warn('Failed to refresh verifications list:', fetchError);
      }
    } catch (error) {
      console.error('Failed to process verification:', error);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Trip ID',
      width: 200,
      valueGetter: (params: any) => params.row.trip_details?.tripId?.substring(0, 8) + '...' || params.row.id.substring(0, 8) + '...',
    },
    {
      field: 'co2_amount',
      headerName: 'CO2 Saved (kg)',
      width: 130,
      type: 'number',
      valueGetter: (params: any) => {
        const value = params.row.co2_amount;
        return typeof value === 'string' ? parseFloat(value) : value;
      },
      valueFormatter: (params) => {
        try {
          const value = params.value;
          if (value === null || value === undefined) return '0.00';
          const num = typeof value === 'string' ? parseFloat(value) : Number(value);
          return isNaN(num) ? '0.00' : num.toFixed(2);
        } catch (error) {
          console.warn('Error formatting CO2 value:', params.value, error);
          return '0.00';
        }
      },
    },
    {
      field: 'distance',
      headerName: 'Distance (km)',
      width: 120,
      type: 'number',
      valueGetter: (params: any) => {
        const value = params.row.emission_data?.distance;
        return typeof value === 'string' ? parseFloat(value) : value;
      },
      valueFormatter: (params) => {
        try {
          const value = params.value;
          if (value === null || value === undefined) return '0.0';
          const num = typeof value === 'string' ? parseFloat(value) : Number(value);
          return isNaN(num) ? '0.0' : num.toFixed(1);
        } catch (error) {
          console.warn('Error formatting distance value:', params.value, error);
          return '0.0';
        }
      },
    },
    {
      field: 'trips_count',
      headerName: 'Trips',
      width: 80,
      type: 'number',
      valueGetter: (params: any) => params.row.trips_count,
    },
    {
      field: 'created_at',
      headerName: 'Submitted',
      width: 180,
      valueGetter: (params: any) => {
        try {
          return format(new Date(params.row.created_at), 'MMM dd, yyyy HH:mm');
        } catch (error) {
          console.error('Invalid date:', params.row.created_at);
          return 'Invalid date';
        }
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params: any) => {
        const status = params.value as string;
        const color =
          status === 'approved'
            ? 'success'
            : status === 'pending'
            ? 'warning'
            : 'error';
        return <Chip label={status.toUpperCase()} color={color} size="small" />;
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      renderCell: (params: any) => {
        if (params.row.status === 'pending') {
          return (
            <Box display="flex" gap={1}>
              <Button
                size="small"
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                onClick={() => {
                  setSelectedVerification(params.row);
                  setAction('approve');
                }}
              >
                Approve
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                startIcon={<Cancel />}
                onClick={() => {
                  setSelectedVerification(params.row);
                  setAction('reject');
                }}
              >
                Reject
              </Button>
            </Box>
          );
        }
        return null;
      },
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Verifications
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Review and verify carbon credit claims
      </Typography>

      <Card>
        <CardContent>
          <DataGrid
            rows={verifications}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
            autoHeight
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
            }}
          />
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedVerification}
        onClose={() => setSelectedVerification(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {action === 'approve' ? 'Approve' : 'Reject'} Verification
        </DialogTitle>
        <DialogContent>
          {selectedVerification && (
            <Box mb={2}>
              <Typography variant="h6" gutterBottom>
                Trip Details
              </Typography>
              <Typography variant="body2">
                <strong>CO2 Saved:</strong> {(() => {
                  try {
                    const value = selectedVerification.co2_amount;
                    if (value === null || value === undefined) return '0.00';
                    const num = typeof value === 'string' ? parseFloat(value) : Number(value);
                    return isNaN(num) ? '0.00' : num.toFixed(2);
                  } catch (error) {
                    console.warn('Error formatting CO2 in dialog:', selectedVerification.co2_amount, error);
                    return '0.00';
                  }
                })()} kg
              </Typography>
              <Typography variant="body2">
                <strong>Distance:</strong> {(() => {
                  try {
                    const value = selectedVerification.emission_data?.distance;
                    if (value === null || value === undefined) return '0.0';
                    const num = typeof value === 'string' ? parseFloat(value) : Number(value);
                    return isNaN(num) ? '0.0' : num.toFixed(1);
                  } catch (error) {
                    console.warn('Error formatting distance in dialog:', selectedVerification.emission_data?.distance, error);
                    return '0.0';
                  }
                })()} km
              </Typography>
              <Typography variant="body2">
                <strong>Number of Trips:</strong> {selectedVerification.trips_count}
              </Typography>
              <Typography variant="body2">
                <strong>Submitted:</strong> {new Date(selectedVerification.created_at).toLocaleDateString()}
              </Typography>
            </Box>
          )}
          <TextField
            fullWidth
            label="Comments"
            multiline
            rows={4}
            value={comments}
            onChange={(e: any) => setComments(e.target.value)}
            margin="normal"
            required={action === 'reject'}
            helperText={action === 'reject' ? 'Required (minimum 10 characters)' : 'Optional'}
            error={action === 'reject' && comments.length > 0 && comments.length < 10}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedVerification(null)}>Cancel</Button>
          <Button
            onClick={handleAction}
            variant="contained"
            color={action === 'approve' ? 'success' : 'error'}
            disabled={action === 'reject' && (!comments || comments.length < 10)}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
