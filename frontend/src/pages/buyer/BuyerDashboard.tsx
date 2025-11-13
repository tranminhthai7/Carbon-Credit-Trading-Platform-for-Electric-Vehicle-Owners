import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import {
  ShoppingCart,
  Receipt,
  TrendingUp,
  Storefront,
  CardGiftcard,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { marketplaceService } from '../../services/marketplace.service';
import { walletService } from '../../services/wallet.service';
import { Listing, Order } from '../../types';

interface DashboardStats {
  totalOrders: number;
  totalSpent: number;
  activeListings: number;
  certificatesOwned: number;
}

interface ApiError {
  message: string;
  details?: string[];
}

export const BuyerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalSpent: 0,
    activeListings: 0,
    certificatesOwned: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<ApiError[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setErrors([]);

      const results = await Promise.allSettled([
        marketplaceService.getMyOrders(),
        marketplaceService.getListings(),
        walletService.getMyWallet(),
      ]);

      const apiErrors: ApiError[] = [];
      
      const [ordersResult, listingsResult, walletResult] = results;

      // ✅ FIX: Backend trả về array trực tiếp từ endpoint /api/orders/buyer/:buyerId
      let ordersData: Order[] = [];
      if (ordersResult.status === 'fulfilled') {
        ordersData = Array.isArray(ordersResult.value) ? ordersResult.value : [];
      } else {
        apiErrors.push({ 
          message: 'Failed to load orders', 
          details: [ordersResult.reason?.message || 'Unknown error'] 
        });
      }

      let listingsData: Listing[] = [];
      if (listingsResult.status === 'fulfilled') {
        listingsData = Array.isArray(listingsResult.value) ? listingsResult.value : [];
      } else {
        apiErrors.push({ 
          message: 'Failed to load marketplace listings', 
          details: [listingsResult.reason?.message || 'Unknown error'] 
        });
      }

      let walletData = null;
      if (walletResult.status === 'fulfilled') {
        walletData = walletResult.value;
      } else {
        console.warn('Wallet data unavailable:', walletResult.reason);
      }

      // ✅ FIX 1: Check totalPrice exists before using
      const completedOrders = ordersData.filter(o => o.status === 'COMPLETED');
      const totalSpent = completedOrders.reduce((sum, order) => {
        return sum + (order.totalPrice || 0); // ✅ Handle undefined
      }, 0);

      // ✅ FIX 2: Update Listing type check for 'ACTIVE' status
      const activeListings = listingsData.filter(l => 
        l.status === 'ACTIVE' || l.status === 'SOLD' // Backend uses ACTIVE/SOLD not OPEN
      );

      setStats({
        totalOrders: ordersData.length,
        totalSpent,
        activeListings: activeListings.length,
        certificatesOwned: completedOrders.length,
      });

      setRecentOrders(ordersData.slice(0, 5));
      
      // ✅ FIX 3: Filter for ACTIVE status instead of OPEN
      setFeaturedListings(
        listingsData
          .filter(l => l.status === 'ACTIVE')
          .slice(0, 5)
      );

      if (apiErrors.length > 0) {
        setErrors(apiErrors);
      }

    } catch (err: any) {
      console.error('Dashboard critical error:', err);
      setErrors([{ 
        message: 'Failed to load dashboard', 
        details: [err.message || 'Please try refreshing the page'] 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
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
      {/* Welcome Section */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Welcome back, {user?.name}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your carbon credit purchases and certificates
        </Typography>
      </Box>

      {/* Display Errors */}
      {errors.length > 0 && (
        <Box mb={3}>
          {errors.map((error, index) => (
            <Alert key={index} severity="warning" sx={{ mb: 1 }}>
              <Typography variant="body2" fontWeight="bold">
                {error.message}
              </Typography>
              {error.details && error.details.map((detail, i) => (
                <Typography key={i} variant="caption" display="block">
                  {detail}
                </Typography>
              ))}
            </Alert>
          ))}
        </Box>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Total Orders
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.totalOrders}
                  </Typography>
                </Box>
                <Receipt color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Total Spent
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    ${stats.totalSpent.toFixed(2)}
                  </Typography>
                </Box>
                <TrendingUp color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Active Listings
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.activeListings}
                  </Typography>
                </Box>
                <Storefront color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Certificates
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.certificatesOwned}
                  </Typography>
                </Box>
                <CardGiftcard color="secondary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Orders */}
        <Grid item xs={12} lg={7}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Recent Orders
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/buyer/orders')}
                >
                  View All
                </Button>
              </Box>

              {recentOrders.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <ShoppingCart sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                  <Typography color="text.secondary">
                    No orders yet. Start shopping in the marketplace!
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/buyer/marketplace')}
                  >
                    Browse Marketplace
                  </Button>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow key={order.id} hover>
                          <TableCell>#{order.id.slice(0, 8)}</TableCell>
                          <TableCell>{order.amount || order.quantity || 0} credits</TableCell>
                          <TableCell>
                            {/* ✅ FIX 4: Handle undefined totalPrice */}
                            ${(order.totalPrice ?? order.totalAmount ?? 0).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={order.status}
                              color={getOrderStatusColor(order.status) as any}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Featured Listings */}
        <Grid item xs={12} lg={5}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Featured Listings
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/buyer/marketplace')}
                >
                  View All
                </Button>
              </Box>

              {featuredListings.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <Storefront sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                  <Typography color="text.secondary">
                    No listings available at the moment
                  </Typography>
                </Box>
              ) : (
                <Box>
                  {featuredListings.map((listing) => (
                    <Paper
                      key={listing.id}
                      sx={{
                        p: 2,
                        mb: 2,
                        '&:hover': {
                          boxShadow: 3,
                          cursor: 'pointer',
                        },
                      }}
                      onClick={() => navigate('/buyer/marketplace')}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {/* ✅ FIX 5: Handle undefined amount */}
                            {listing.amount ?? listing.quantity ?? 0} Carbon Credits
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {/* ✅ FIX 6: Handle undefined pricePerCredit */}
                            ${(listing.pricePerCredit ?? listing.pricePerUnit ?? 0).toFixed(2)} per credit
                          </Typography>
                        </Box>
                        <Box textAlign="right">
                          <Typography variant="h6" color="primary" fontWeight="bold">
                            {/* ✅ FIX 7: Safe calculation */}
                            ${((listing.amount ?? listing.quantity ?? 0) * 
                               (listing.pricePerCredit ?? listing.pricePerUnit ?? 0)).toFixed(2)}
                          </Typography>
                          <Chip label={listing.status} color="success" size="small" />
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box mt={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Storefront />}
                  onClick={() => navigate('/buyer/marketplace')}
                >
                  Browse Marketplace
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Receipt />}
                  onClick={() => navigate('/buyer/orders')}
                >
                  View Orders
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<CardGiftcard />}
                  onClick={() => navigate('/buyer/certificates')}
                >
                  My Certificates
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};