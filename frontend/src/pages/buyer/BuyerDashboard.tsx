import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import { Storefront, Receipt, CardGiftcard } from '@mui/icons-material';
import { marketplaceService } from '../../services/marketplace.service';
import { verificationService } from '../../services/verification.service';

export const BuyerDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    listings: 0,
    orders: 0,
    certificates: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [listings, orders, certificates] = await Promise.all([
        marketplaceService.getListings(),
        marketplaceService.getMyOrders(),
        verificationService.getMyCertificates(),
      ]);

      setStats({
        listings: listings.length,
        orders: orders.length,
        certificates: certificates.length,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
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
        Buyer Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Browse and purchase carbon credits
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Storefront sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box>
                  <Typography color="text.secondary">Available Listings</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.listings}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Receipt sx={{ fontSize: 40, color: 'success.main' }} />
                <Box>
                  <Typography color="text.secondary">My Orders</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.orders}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <CardGiftcard sx={{ fontSize: 40, color: 'warning.main' }} />
                <Box>
                  <Typography color="text.secondary">Certificates</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.certificates}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
