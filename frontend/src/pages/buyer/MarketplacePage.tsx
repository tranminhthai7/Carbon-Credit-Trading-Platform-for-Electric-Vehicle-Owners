import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { marketplaceService } from '../../services/marketplace.service';
import { useAuth } from '../../context/AuthContext';
import { Listing } from '../../types';
import { format } from 'date-fns';

export const MarketplacePage: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [quantity, setQuantity] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const data = await marketplaceService.getListings();
      setListings(data.filter((l) => l.status === 'ACTIVE'));
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedListing) return;
    try {
      // backend expects buyerId in body — use current authenticated user id
      if (!user?.id) throw new Error('User not authenticated');
      await marketplaceService.purchaseListing(selectedListing.id, user.id);
      setSelectedListing(null);
      setQuantity('');
      fetchListings();
    } catch (error) {
      console.error('Failed to purchase:', error);
    }
  };

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
        Marketplace
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Browse and purchase carbon credits
      </Typography>

      <Grid container spacing={3}>
        {listings.map((listing) => (
          <Grid item xs={12} sm={6} md={4} key={listing.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight="bold">
                    {listing.quantity} kg CO₂
                  </Typography>
                  <Chip label="ACTIVE" color="success" size="small" />
                </Box>
                <Typography color="text.secondary" variant="body2">
                  Price per unit: ${listing.pricePerUnit.toFixed(2)}
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="primary.main" my={1}>
                  ${listing.totalPrice.toFixed(2)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Listed: {format(new Date(listing.createdAt), 'MMM dd, yyyy')}
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<ShoppingCart />}
                  sx={{ mt: 2 }}
                  onClick={() => setSelectedListing(listing)}
                >
                  Purchase
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={!!selectedListing}
        onClose={() => setSelectedListing(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Purchase Carbon Credits</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            Available: {selectedListing?.quantity} kg CO₂
          </Typography>
          <Typography variant="body2" gutterBottom>
            Price: ${selectedListing?.pricePerUnit.toFixed(2)} per kg
          </Typography>
            <TextField
            fullWidth
            label="Quantity (kg)"
            type="number"
            value={quantity}
            onChange={(e: any) => setQuantity(e.target.value)}
            margin="normal"
              inputProps={{ max: selectedListing?.quantity?.toString?.() }}
          />
          {quantity && selectedListing && (
            <Typography variant="h6" sx={{ mt: 2 }}>
              Total: ${(Number(quantity) * selectedListing.pricePerUnit).toFixed(2)}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedListing(null)}>Cancel</Button>
          <Button
            onClick={handlePurchase}
            variant="contained"
            disabled={!quantity || Number(quantity) > (selectedListing?.quantity || 0)}
          >
            Confirm Purchase
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
