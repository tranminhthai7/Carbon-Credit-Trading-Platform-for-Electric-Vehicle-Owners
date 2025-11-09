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
import { Add, Cancel } from '@mui/icons-material';
import { marketplaceService } from '../../services/marketplace.service';
import { Listing } from '../../types';
import { format } from 'date-fns';

export const ListingsPage: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    quantity: '',
    pricePerUnit: '',
  });

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const data = await marketplaceService.getMyListings();
      setListings(data);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateListing = async () => {
    try {
      await marketplaceService.createListing({
        quantity: Number(formData.quantity),
        pricePerUnit: Number(formData.pricePerUnit),
        totalPrice: Number(formData.quantity) * Number(formData.pricePerUnit),
      });
      setOpenDialog(false);
      setFormData({ quantity: '', pricePerUnit: '' });
      fetchListings();
    } catch (error) {
      console.error('Failed to create listing:', error);
    }
  };

  const handleCancelListing = async (listingId: string) => {
    try {
      await marketplaceService.cancelListing(listingId);
      fetchListings();
    } catch (error) {
      console.error('Failed to cancel listing:', error);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 120,
      type: 'number',
    },
    {
      field: 'pricePerUnit',
      headerName: 'Price/Unit',
      width: 130,
      valueFormatter: (params) => `$${params.value?.toFixed(2)}`,
    },
    {
      field: 'totalPrice',
      headerName: 'Total Price',
      width: 130,
      valueFormatter: (params) => `$${params.value?.toFixed(2)}`,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => {
        const status = params.value as string;
        const color =
          status === 'ACTIVE'
            ? 'success'
            : status === 'SOLD'
            ? 'info'
            : 'default';
        return <Chip label={status} color={color} size="small" />;
      },
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 180,
      valueGetter: (params) => format(new Date(params.row.createdAt), 'MMM dd, yyyy HH:mm'),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 130,
      renderCell: (params) => {
        if (params.row.status === 'ACTIVE') {
          return (
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<Cancel />}
              onClick={() => handleCancelListing(params.row.id)}
            >
              Cancel
            </Button>
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            My Listings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your carbon credit listings
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Create Listing
        </Button>
      </Box>

      <Card>
        <CardContent>
          <DataGrid
            rows={listings}
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Listing</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Quantity (kg CO₂)"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Price per Unit ($)"
            type="number"
            value={formData.pricePerUnit}
            onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
            margin="normal"
          />
          {formData.quantity && formData.pricePerUnit && (
            <Typography variant="h6" sx={{ mt: 2 }}>
              Total: ${(Number(formData.quantity) * Number(formData.pricePerUnit)).toFixed(2)}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateListing}
            variant="contained"
            disabled={!formData.quantity || !formData.pricePerUnit}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
