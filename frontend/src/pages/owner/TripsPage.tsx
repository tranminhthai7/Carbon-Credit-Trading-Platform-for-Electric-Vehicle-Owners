import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add, UploadFile, Edit, Delete } from '@mui/icons-material';
import { tripService } from '../../services/trip.service';
import { useNavigate } from 'react-router-dom';
import { Trip } from '../../types';
import RecordTripModal from '../../components/trips/RecordTripModal';
import { ImportTripsModal } from '../../components/trips/ImportTripsModal';
import { format } from 'date-fns';
import { verificationService } from '../../services/verification.service';
import { useAuth } from '../../context/AuthContext';

export const TripsPage: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [vehiclesCount, setVehiclesCount] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [deleteConfirmTrip, setDeleteConfirmTrip] = useState<{ trip: Trip; vehicleId: string; tripIndex: number } | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

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

  useEffect(() => {
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

  const handleDeleteTrip = async (trip: Trip) => {
    if (!confirm('Bạn có chắc chắn muốn xóa chuyến đi này?')) return;

    try {
      await tripService.deleteTrip(trip.vehicleId, trip.tripIndex);
      // Refresh trips from server to update indices
      await fetchTrips();
      alert('Trip deleted successfully!');
    } catch (error: any) {
      console.error('Delete trip error:', error);
      alert(error.response?.data?.message || 'Failed to delete trip');
    }
  };

  const handleEditTrip = (trip: Trip) => {
    setEditingTrip(trip);
    setShowCreateModal(true);
  };

  const handleUpdateTrip = async (tripData: any) => {
    if (!editingTrip) return;

    try {
      await tripService.updateTrip(editingTrip.vehicleId, editingTrip.tripIndex, tripData);
      
      // Refresh trips list
      await fetchTrips();
      setEditingTrip(null);
      alert('Trip updated successfully!');
    } catch (error) {
      console.error('Failed to update trip:', error);
      alert('Failed to update trip. Please try again.');
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
          <Box>
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleEditTrip(trip)}
              title="Edit trip"
            >
              <Edit fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDeleteTrip(trip)}
              title="Delete trip"
            >
              <Delete fontSize="small" />
            </IconButton>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleSubmitVerification(trip)}
              sx={{ ml: 1 }}
            >
              Verify
            </Button>
          </Box>
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

  const openImportModal = async () => {
    try {
      const vehicles = await tripService.getMyVehicles();
      if (vehicles.length > 0) {
        setSelectedVehicleId(vehicles[0].id);
        setShowImportModal(true);
      } else {
        alert('Bạn cần tạo phương tiện trước khi import trips');
        navigate('/owner/vehicles');
      }
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
      alert('Lỗi khi tải danh sách phương tiện');
    }
  };

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
          <Button
            variant="outlined"
            startIcon={<UploadFile />}
            sx={{ ml: 2 }}
            onClick={openImportModal}
          >
            Import từ File
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
        onClose={() => {
          setShowCreateModal(false);
          setEditingTrip(null);
        }}
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
        editingTrip={editingTrip}
        onUpdated={handleUpdateTrip}
      />
      <ImportTripsModal
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        vehicleId={selectedVehicleId || ''}
        onImported={() => {
          // Refresh trips list after import
          fetchTrips();
        }}
      />
    </Box>
  );
};
