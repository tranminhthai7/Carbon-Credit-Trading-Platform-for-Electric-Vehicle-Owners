import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { CheckCircle, Cancel, Info } from '@mui/icons-material';
import { verificationService } from '../../services/verification.service';
import { Verification } from '../../types';
import { format } from 'date-fns';
import { LoadingSpinner, EmptyState } from '../../components/common';
import { VerificationDialog } from '../../components/dialogs/VerificationDialog';

export const VerificationsPage: React.FC = () => {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      const data = await verificationService.getPendingVerifications();
      setVerifications(data);
    } catch (error) {
      console.error('Failed to fetch verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (comments: string) => {
    if (!selectedVerification || !action) return;
    
    if (action === 'approve') {
      await verificationService.approveVerification(selectedVerification.id, comments);
    } else {
      await verificationService.rejectVerification(selectedVerification.id, comments);
    }
    
    setSelectedVerification(null);
    setAction(null);
    fetchVerifications();
  };

  const openDialog = (verification: Verification, actionType: 'approve' | 'reject') => {
    setSelectedVerification(verification);
    setAction(actionType);
  };

  const closeDialog = () => {
    setSelectedVerification(null);
    setAction(null);
  };

  const filteredVerifications = verifications.filter((v) => {
    if (tabValue === 0) return v.status === 'PENDING';
    if (tabValue === 1) return v.status === 'APPROVED';
    if (tabValue === 2) return v.status === 'REJECTED';
    return true;
  });

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
                onClick={() => openDialog(params.row, 'approve')}
              >
                Approve
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                startIcon={<Cancel />}
                onClick={() => openDialog(params.row, 'reject')}
              >
                Reject
              </Button>
            </Box>
          );
        }
        return (
          <Button
            size="small"
            startIcon={<Info />}
            onClick={() => {
              setSelectedVerification(params.row);
              setAction(null);
            }}
          >
            View Details
          </Button>
        );
      },
    },
  ];

  if (loading) {
    return <LoadingSpinner message="Loading verifications..." />;
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
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
            <Tab
              label={`Pending (${verifications.filter((v) => v.status === 'PENDING').length})`}
            />
            <Tab
              label={`Approved (${verifications.filter((v) => v.status === 'APPROVED').length})`}
            />
            <Tab
              label={`Rejected (${verifications.filter((v) => v.status === 'REJECTED').length})`}
            />
          </Tabs>
        </Box>

        <CardContent>
          {filteredVerifications.length === 0 ? (
            <EmptyState
              title={`No ${tabValue === 0 ? 'pending' : tabValue === 1 ? 'approved' : 'rejected'} verifications`}
              message="There are no verifications in this category at the moment."
            />
          ) : (
            <DataGrid
              rows={filteredVerifications}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10, 25]}
              disableRowSelectionOnClick
              autoHeight
              sx={{
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
              }}
            />
          )}
        </CardContent>
      </Card>

      <VerificationDialog
        open={action !== null}
        verification={selectedVerification}
        action={action}
        onClose={closeDialog}
        onConfirm={handleAction}
      />
    </Box>
  );
};
