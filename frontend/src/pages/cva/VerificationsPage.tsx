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

export const VerificationsPage: React.FC = () => {
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
    if (!selectedVerification || !action) return;
    try {
      if (action === 'approve') {
        await verificationService.approveVerification(selectedVerification.id, comments);
      } else {
        await verificationService.rejectVerification(selectedVerification.id, comments);
      }
      setSelectedVerification(null);
      setComments('');
      setAction(null);
      fetchVerifications();
    } catch (error) {
      console.error('Failed to process verification:', error);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'tripId',
      headerName: 'Trip ID',
      width: 200,
    },
    {
      field: 'createdAt',
      headerName: 'Submitted',
      width: 180,
      valueGetter: (params: any) => format(new Date(params.row.createdAt), 'MMM dd, yyyy HH:mm'),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params: any) => {
        const status = params.value as string;
        const color =
          status === 'APPROVED'
            ? 'success'
            : status === 'PENDING'
            ? 'warning'
            : 'error';
        return <Chip label={status} color={color} size="small" />;
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      renderCell: (params: any) => {
        if (params.row.status === 'PENDING') {
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
          <TextField
            fullWidth
            label="Comments"
            multiline
            rows={4}
            value={comments}
            onChange={(e: any) => setComments(e.target.value)}
            margin="normal"
            required={action === 'reject'}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedVerification(null)}>Cancel</Button>
          <Button
            onClick={handleAction}
            variant="contained"
            color={action === 'approve' ? 'success' : 'error'}
            disabled={action === 'reject' && !comments}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
