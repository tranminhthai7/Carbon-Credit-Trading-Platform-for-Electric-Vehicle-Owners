import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { ShoppingCart, FilterList, Search } from '@mui/icons-material';
import { marketplaceService } from '../../services/marketplace.service';
import { Listing } from '../../types';
import { format } from 'date-fns';
import { LoadingSpinner, EmptyState } from '../../components/common';

export const MarketplacePage: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [quantity, setQuantity] = useState('');
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [priceRange, setPriceRange] = useState<string>('all');

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [listings, searchTerm, sortBy, priceRange]);

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

  const applyFilters = () => {
    let filtered = [...listings];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (l) =>
          l.quantity.toString().includes(searchTerm) ||
          l.pricePerUnit.toString().includes(searchTerm)
      );
    }

    // Price range filter
    if (priceRange !== 'all') {
      filtered = filtered.filter((l) => {
        const price = l.totalPrice;
        if (priceRange === 'low') return price < 50;
        if (priceRange === 'medium') return price >= 50 && price < 200;
        if (priceRange === 'high') return price >= 200;
        return true;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'price-low':
          return a.totalPrice - b.totalPrice;
        case 'price-high':
          return b.totalPrice - a.totalPrice;
        case 'quantity-low':
          return a.quantity - b.quantity;
        case 'quantity-high':
          return b.quantity - a.quantity;
        default:
          return 0;
      }
    });

    setFilteredListings(filtered);
  };

  const handlePurchase = async () => {
    if (!selectedListing) return;
    try {
      await marketplaceService.purchaseListing(selectedListing.id, Number(quantity));
      setSelectedListing(null);
      setQuantity('');
      fetchListings();
      alert('Purchase successful!');
    } catch (error) {
      console.error('Failed to purchase:', error);
      alert('Purchase failed. Please try again.');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading marketplace..." />;
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Marketplace
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Browse and purchase carbon credits
      </Typography>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
            <FilterList color="action" />
            <TextField
              placeholder="Search by quantity or price..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 250 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Sort By</InputLabel>
              <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} label="Sort By">
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
                <MenuItem value="quantity-low">Quantity: Low to High</MenuItem>
                <MenuItem value="quantity-high">Quantity: High to Low</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Price Range</InputLabel>
              <Select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                label="Price Range"
              >
                <MenuItem value="all">All Prices</MenuItem>
                <MenuItem value="low">&lt; $50</MenuItem>
                <MenuItem value="medium">$50 - $200</MenuItem>
                <MenuItem value="high">&gt; $200</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
              {filteredListings.length} listing{filteredListings.length !== 1 ? 's' : ''} found
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <EmptyState
          title="No listings found"
          message="Try adjusting your filters or check back later for new listings."
        />
      ) : (
        <Grid container spacing={3}>
          {filteredListings.map((listing) => (
            <Grid item xs={12} sm={6} md={4} key={listing.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
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
      )}

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
            inputProps={{ max: selectedListing?.quantity }}
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
