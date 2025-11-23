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

  // When user clicks "Record New Trip" we do a quick live-check for vehicles
  // (handles the case where a vehicle was created elsewhere but the page's
  // cached state is stale). If no vehicles exist we redirect to the vehicles
  // page so the user can create one.
  const handleOpenRecordModal = async () => {
    // If we have a count of zero or still null, try to re-fetch live.
    let current = vehiclesCount;
    if (current === null || current === 0) {
      try {
        const vehicles = await tripService.getMyVehicles();
        const len = Array.isArray(vehicles) ? vehicles.length : 0;
        setVehiclesCount(len);
        current = len;
      } catch (err) {
        console.warn('Failed to refresh vehicles before opening record modal', err);
        // assume zero and send user to create vehicle page
        setVehiclesCount(0);
        current = 0;
      }
    }

    if (!current || current === 0) {
      // Help the user create a vehicle first
      navigate('/owner/vehicles');
      return;
    }

    setShowCreateModal(true);
  };

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
                  onClick={handleOpenRecordModal}
                  // keyboard friendly: ensure Enter/Space open modal (fallback if click is blocked)
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      // prevent page scroll on Space
                      e.preventDefault();
                      void handleOpenRecordModal();
                    }
                  }}
                  // pointer down can trigger in some edge cases where click is intercepted
                  onPointerDown={(e) => {
                    // allow normal click to proceed; use pointer down as a best-effort fallback
                    // but only trigger when left mouse button / primary pointer
                    if ((e as any).pointerType === 'mouse' || (e as any).pointerType === undefined) {
                      // do not await — keep UI responsive
                      void handleOpenRecordModal();
                    }
                  }}
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
              onClick={handleOpenRecordModal}
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
