import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add, Download } from '@mui/icons-material';
import { tripService } from '../../services/trip.service';
import { Trip } from '../../types';
import { format } from 'date-fns';
import { TripFormDialog } from '../../components/forms/TripFormDialog';
import { LoadingSpinner, EmptyState } from '../../components/common';

export const TripsPage: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const data = await tripService.getMyTrips();
      setTrips(data);
    } catch (error) {
      console.error('Failed to fetch trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    // Export trips to CSV
    const headers = ['Date', 'Distance (km)', 'Energy (kWh)', 'Carbon Saved (kg)', 'Status'];
    const csvData = trips.map(trip => [
      format(new Date(trip.startTime), 'yyyy-MM-dd'),
      trip.distance,
      trip.energyConsumed,
      trip.carbonSaved?.toFixed(2) || '0',
      trip.verificationStatus,
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trips-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const columns: GridColDef[] = [
    {
      field: 'startTime',
      headerName: 'Date',
      width: 150,
      valueGetter: (params) => format(new Date(params.row.startTime), 'MMM dd, yyyy'),
    },
    {
      field: 'distance',
      headerName: 'Distance (km)',
      width: 130,
      type: 'number',
    },
    {
      field: 'energyConsumed',
      headerName: 'Energy (kWh)',
      width: 130,
      type: 'number',
    },
    {
      field: 'carbonSaved',
      headerName: 'Carbon Saved (kg)',
      width: 150,
      type: 'number',
      valueFormatter: (params) => params.value?.toFixed(2) || '0.00',
    },
    {
      field: 'verificationStatus',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => {
        const status = params.value as string;
        const color =
          status === 'VERIFIED'
            ? 'success'
            : status === 'PENDING'
            ? 'warning'
            : 'error';
        return <Chip label={status} color={color} size="small" />;
      },
    },
    {
      field: 'createdAt',
      headerName: 'Recorded At',
      width: 150,
      valueGetter: (params) => format(new Date(params.row.createdAt), 'MMM dd, HH:mm'),
    },
  ];

  if (loading) {
    return <LoadingSpinner message="Loading trips..." />;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            My Trips
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View and manage your electric vehicle trips
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportCSV}
            disabled={trips.length === 0}
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenForm(true)}
          >
            Record New Trip
          </Button>
        </Box>
      </Box>

      {trips.length === 0 ? (
        <EmptyState
          title="No trips yet"
          message="Start recording your EV trips to earn carbon credits!"
          actionLabel="Record Your First Trip"
          onAction={() => setOpenForm(true)}
        />
      ) : (
        <Card>
          <CardContent>
            <DataGrid
              rows={trips}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10, 25]}
              checkboxSelection
              disableRowSelectionOnClick
              autoHeight
              sx={{
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
              }}
            />
          </CardContent>
        </Card>
      )}

      <TripFormDialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSuccess={() => {
          fetchTrips();
          // Show success message (you can add Snackbar later)
        }}
      />
    </Box>
  );
};
