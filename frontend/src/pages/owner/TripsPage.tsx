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

export const TripsPage: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [vehiclesCount, setVehiclesCount] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

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
            : 'error';
        return <Chip label={status} color={color} size="small" />;
      },
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 150,
      valueGetter: (params) => format(new Date(params.row.createdAt), 'MMM dd, HH:mm'),
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  // If we know the user has zero vehicles, prompt them to create one before allowing recording trips.
  if (trips.length === 0) {
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
          {/* Disable recording a trip when user has no vehicles and show a clear CTA */}
          <div>
            <Button
              variant="contained"
              startIcon={<Add />}
              disabled={vehiclesCount === 0}
              onClick={() => setShowCreateModal(true)}
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
            <Typography variant="body1">Không có chuyến nào.</Typography>
            {vehiclesCount === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Bạn chưa có phương tiện nào — vui lòng tạo phương tiện trước khi ghi nhớ chuyến đi.
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Hãy tạo chuyến đi mới bằng cách bấm "Record New Trip".
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    );
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
        <div>
          <Button
            variant="contained"
            startIcon={<Add />}
            disabled={vehiclesCount === 0}
            onClick={() => setShowCreateModal(true)}
          >
            Record New Trip
          </Button>

          <RecordTripModal
            open={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onCreated={(t) => {
              // Append new trip to the list if returned in the frontend shape
              try {
                if (t) setTrips((prev) => [t, ...prev]);
              } catch (e) {}
            }}
          />
          {vehiclesCount === 0 && (
            <Button variant="outlined" sx={{ ml: 2 }} onClick={() => navigate('/owner/vehicles')}>
              Create vehicle
            </Button>
          )}
        </div>
      </Box>

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
    </Box>
  );
};
