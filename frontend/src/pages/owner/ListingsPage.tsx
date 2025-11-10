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
  IconButton,
  Alert,
  Snackbar,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add, Cancel, Edit } from '@mui/icons-material';
import { marketplaceService } from '../../services/marketplace.service';
import { Listing } from '../../types';
import { format } from 'date-fns';

export const ListingsPage: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
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

  const handleOpenCreateDialog = () => {
    setIsEditMode(false);
    setFormData({ quantity: '', pricePerUnit: '' });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (listing: Listing) => {
    setIsEditMode(true);
    setSelectedListing(listing);
    setFormData({
      quantity: listing.quantity.toString(),
      pricePerUnit: listing.pricePerUnit.toString(),
    });
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode && selectedListing) {
        await marketplaceService.updateListing(selectedListing.id, {
          pricePerUnit: Number(formData.pricePerUnit),
        });
        setSnackbar({ open: true, message: 'Listing updated successfully!', severity: 'success' });
      } else {
        await marketplaceService.createListing({
          quantity: Number(formData.quantity),
          pricePerUnit: Number(formData.pricePerUnit),
          totalPrice: Number(formData.quantity) * Number(formData.pricePerUnit),
        });
        setSnackbar({ open: true, message: 'Listing created successfully!', severity: 'success' });
      }
      setOpenDialog(false);
      setFormData({ quantity: '', pricePerUnit: '' });
      setSelectedListing(null);
      fetchListings();
    } catch (error) {
      console.error('Failed to save listing:', error);
      setSnackbar({ open: true, message: 'Failed to save listing', severity: 'error' });
    }
  };

  const handleOpenCancelDialog = (listing: Listing) => {
    setSelectedListing(listing);
    setOpenConfirmDialog(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedListing) return;
    try {
      await marketplaceService.cancelListing(selectedListing.id);
      setSnackbar({ open: true, message: 'Listing cancelled successfully!', severity: 'success' });
      setOpenConfirmDialog(false);
      setSelectedListing(null);
      fetchListings();
    } catch (error) {
      console.error('Failed to cancel listing:', error);
      setSnackbar({ open: true, message: 'Failed to cancel listing', severity: 'error' });
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 100,
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 120,
      type: 'number',
      valueFormatter: (params) => `${params.value} kg`,
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
      width: 130,
      renderCell: (params) => {
        const status = params.value as string;
        const color =
          status === 'ACTIVE'
            ? 'success'
            : status === 'SOLD'
            ? 'info'
            : status === 'CANCELLED'
            ? 'error'
            : 'default';
        return <Chip label={status} color={color} size="small" />;
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => {
        if (params.row.status === 'ACTIVE') {
          return (
            <Box display="flex" gap={1}>
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleOpenEditDialog(params.row)}
                title="Edit Price"
              >
                <Edit fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleOpenCancelDialog(params.row)}
                title="Cancel Listing"
              >
                <Cancel fontSize="small" />
              </IconButton>
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            My Listings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your carbon credit listings
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreateDialog}>
          Create New Listing
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

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditMode ? 'Edit Listing Price' : 'Create New Listing'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Quantity (kg CO₂)"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            margin="normal"
            disabled={isEditMode}
            inputProps={{ min: 1 }}
            error={formData.quantity !== '' && Number(formData.quantity) <= 0}
            helperText={
              formData.quantity !== '' && Number(formData.quantity) <= 0
                ? 'Quantity must be greater than 0'
                : ''
            }
          />
          <TextField
            fullWidth
            label="Price per Unit ($)"
            type="number"
            value={formData.pricePerUnit}
            onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
            margin="normal"
            inputProps={{ min: 0.01, step: 0.01 }}
            error={formData.pricePerUnit !== '' && Number(formData.pricePerUnit) <= 0}
            helperText={
              formData.pricePerUnit !== '' && Number(formData.pricePerUnit) <= 0
                ? 'Price must be greater than 0'
                : ''
            }
          />
          {formData.quantity && formData.pricePerUnit && (
            <Typography variant="h6" sx={{ mt: 2 }} color="primary">
              Total: ${(Number(formData.quantity) * Number(formData.pricePerUnit)).toFixed(2)}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              !formData.quantity ||
              !formData.pricePerUnit ||
              Number(formData.quantity) <= 0 ||
              Number(formData.pricePerUnit) <= 0
            }
          >
            {isEditMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Cancel Dialog */}
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>Confirm Cancellation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to cancel this listing?</Typography>
          {selectedListing && (
            <Box mt={2}>
              <Typography variant="body2" color="text.secondary">
                Quantity: {selectedListing.quantity} kg
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Price: ${selectedListing.pricePerUnit.toFixed(2)}/unit
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total: ${selectedListing.totalPrice.toFixed(2)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>No, Keep It</Button>
          <Button onClick={handleConfirmCancel} variant="contained" color="error">
            Yes, Cancel Listing
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
