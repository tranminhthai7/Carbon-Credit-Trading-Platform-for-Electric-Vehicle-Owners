import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add } from '@mui/icons-material';
import { tripService } from '../../services/trip.service';
import { useNavigate } from 'react-router-dom';
import { Trip } from '../../types';
import RecordTripModal from '../../components/trips/RecordTripModal';
import { format } from 'date-fns';
import { verificationService } from '../../services/verification.service';
import { useAuth } from '../../context/AuthContext';

export const TripsPage: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [vehiclesCount, setVehiclesCount] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await tripService.getMyTrips();
        setTrips(data);
        // attempt to detect whether user owns vehicles so we can prevent creating trips when none exist
        try {
          const vehicles = await tripService.getMyVehicles();
          setVehiclesCount(Array.isArray(vehicles) ? vehicles.length : 0);
        } catch (vehErr) {
          // if fetching vehicles fails, we still proceed — default to 0 so UI guides user
          console.warn('Failed to fetch vehicles for trips page:', vehErr);
          setVehiclesCount(0);
        }
      } catch (error: any) {
        // Show helpful message for common errors (no vehicles / unauthorized)
        console.error('Failed to fetch trips:', error);
        // optionally we could set an error state to display in UI
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const handleSubmitVerification = async (trip: Trip) => {
    if (!user) return;
    try {
      await verificationService.submitVerification({
        user_id: user.id,
        vehicle_id: trip.vehicleId,
        co2_amount: trip.carbonSaved,
        trips_count: 1, // Assuming one trip per submission, but could aggregate
        emission_data: {
          distance: trip.distance,
          energyConsumed: trip.energyConsumed,
        },
        trip_details: {
          tripId: trip.id,
          startTime: trip.startTime,
          endTime: trip.endTime,
        },
      });
      // Update the trip status to PENDING
      setTrips(prev => prev.map(t => 
        t.id === trip.id ? { ...t, verificationStatus: 'PENDING' } : t
      ));
      alert('Verification submitted successfully!');
    } catch (error) {
      console.error('Failed to submit verification:', error);
      alert('Failed to submit verification. Please try again.');
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'startTime',
      headerName: 'Date',
      width: 150,
      valueGetter: (params) => {
        try {
          return format(new Date(params.row.startTime), 'MMM dd, yyyy');
        } catch {
          return 'Invalid Date';
        }
      },
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
      valueGetter: (params) => params.row.energyConsumed?.toString() || '-',
    },
    {
      field: 'carbonSaved',
      headerName: 'Carbon Saved (kg)',
      width: 150,
      type: 'number',
      valueFormatter: (params) => params.value?.toFixed(2),
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
            : status === 'REJECTED'
            ? 'error'
            : 'default'; // for UNVERIFIED
        return <Chip label={status} color={color} size="small" />;
      },
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 150,
      valueGetter: (params) => {
        try {
          return format(new Date(params.row.createdAt), 'MMM dd, HH:mm');
        } catch {
          return 'Invalid Date';
        }
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => {
        const trip = params.row;
        if (trip.verificationStatus === 'VERIFIED') {
          return <Chip label="Verified" color="success" size="small" />;
        }
        if (trip.verificationStatus === 'PENDING') {
          return <Chip label="Pending Verification" color="warning" size="small" />;
        }
        return (
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleSubmitVerification(trip)}
          >
            Submit for Verification
          </Button>
        );
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

  // Open the modal for recording a new trip. Keep logic intentionally simple
  // for this change: the modal itself will validate (eg — enforce vehicle
  // selection) and show errors when submission is attempted.
  const openRecordModal = () => setShowCreateModal(true);

  // If we know the user has zero vehicles, prompt them to create one before allowing recording trips.
  const hasNoTrips = trips.length === 0;

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
        <div>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={openRecordModal}
          >
            Record New Trip
          </Button>
          {vehiclesCount === 0 && (
            <Button
              variant="outlined"
              sx={{ ml: 2 }}
              onClick={() => navigate('/owner/vehicles')}
            >
              Create vehicle
            </Button>
          )}
        </div>
      </Box>
      <Card>
        <CardContent>
          {hasNoTrips ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {vehiclesCount === 0
                ? 'Bạn chưa có phương tiện nào — vui lòng tạo phương tiện trước khi ghi nhớ chuyến đi.'
                : 'Hãy tạo chuyến đi mới bằng cách bấm "Record New Trip".'}
            </Typography>
          ) : (
            <DataGrid
              rows={trips}
              columns={columns}
              getRowId={(row) => row.id || row.createdAt || `${row.vehicleId}-${row.startTime}`}
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
          )}
        </CardContent>
      </Card>
      <RecordTripModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={(t) => {
          // Append new trip to the list if returned in the frontend shape
          try {
            if (t) {
              // Ensure the trip has an id for DataGrid
              if (!t.id) {
                t.id = t.createdAt || `${t.vehicleId}-${t.startTime}`;
              }
              setTrips((prev) => [t, ...prev]);
            }
          } catch (e) {}
        }}
      />
    </Box>
  );
};
