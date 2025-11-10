import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Storefront,
  Receipt,
  CardGiftcard,
  ShoppingCart,
  History,
  Download,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { marketplaceService } from '../../services/marketplace.service';
import { reportService } from '../../services/report.service';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { StatsCard } from '../../components/common/StatsCard';
import { useNavigate } from 'react-router-dom';
import { Order, Certificate } from '../../types';

interface BuyerStats {
  totalOrders: number;
  totalSpent: number;
  activeCertificates: number;
  availableListings: number;
}

export const BuyerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<BuyerStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const fetchDashboardData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError('');

      const [ordersData, certificatesData, platformStats] = await Promise.all([
        marketplaceService.getMyOrders(),
        // Note: certificates endpoint might need to be added to service
        Promise.resolve([]), // Placeholder for certificates
        reportService.getPlatformStats(),
      ]);

      setRecentOrders(ordersData.slice(0, 3)); // Get last 3 orders
      setCertificates(certificatesData);

      setStats({
        totalOrders: ordersData.length,
        totalSpent: ordersData
          .filter(order => order.status === 'COMPLETED')
          .reduce((sum, order) => sum + order.totalAmount, 0),
        activeCertificates: certificatesData.length,
        availableListings: platformStats.activeListings,
      });
    } catch (error: any) {
      console.error('Failed to fetch dashboard data:', error);
      setError(error.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchDashboardData} />;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome, {user?.name}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Browse and purchase carbon credits to support sustainable transportation
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Available Listings"
            value={stats?.availableListings || 0}
            icon={<Storefront sx={{ fontSize: 40 }} />}
            color="#2e7d32"
            subtitle="Active carbon credit listings"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="My Orders"
            value={stats?.totalOrders || 0}
            icon={<Receipt sx={{ fontSize: 40 }} />}
            color="#1976d2"
            subtitle="Total purchases made"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Spent"
            value={`$${(stats?.totalSpent || 0).toFixed(2)}`}
            icon={<ShoppingCart sx={{ fontSize: 40 }} />}
            color="#ff9800"
            subtitle="On carbon credits"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Certificates"
            value={stats?.activeCertificates || 0}
            icon={<CardGiftcard sx={{ fontSize: 40 }} />}
            color="#9c27b0"
            subtitle="Carbon credit certificates"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Recent Orders
              </Typography>
              {recentOrders.length > 0 ? (
                <Box sx={{ mt: 2 }}>
                  {recentOrders.map((order) => (
                    <Box
                      key={order.id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 1,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          Order #{order.id.slice(-8)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box textAlign="right">
                        <Typography variant="body2" fontWeight="bold">
                          ${order.totalAmount.toFixed(2)}
                        </Typography>
                        <Chip
                          label={order.status}
                          size="small"
                          color={
                            order.status === 'COMPLETED' ? 'success' :
                            order.status === 'PENDING' ? 'warning' : 'error'
                          }
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  ))}
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<History />}
                      onClick={() => navigate('/buyer/orders')}
                    >
                      View All Orders
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box textAlign="center" py={4}>
                  <Typography color="text.secondary" gutterBottom>
                    No orders yet
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Storefront />}
                    onClick={() => navigate('/buyer/marketplace')}
                    sx={{ mt: 1 }}
                  >
                    Browse Marketplace
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Storefront />}
                  onClick={() => navigate('/buyer/marketplace')}
                  sx={{ justifyContent: 'flex-start', py: 1.5 }}
                >
                  Browse Carbon Credits
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<History />}
                  onClick={() => navigate('/buyer/orders')}
                  sx={{ justifyContent: 'flex-start', py: 1.5 }}
                >
                  View My Orders
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<CardGiftcard />}
                  onClick={() => navigate('/buyer/certificates')}
                  sx={{ justifyContent: 'flex-start', py: 1.5 }}
                >
                  My Certificates
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Download />}
                  onClick={() => navigate('/buyer/certificates')}
                  sx={{ justifyContent: 'flex-start', py: 1.5 }}
                >
                  Download Certificates
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
