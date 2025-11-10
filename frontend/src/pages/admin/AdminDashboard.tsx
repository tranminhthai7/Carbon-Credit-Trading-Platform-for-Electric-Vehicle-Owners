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
  Alert,
} from '@mui/material';
import {
  People,
  Receipt,
  TrendingUp,
  Nature,
  AdminPanelSettings,
  BarChart,
  Settings,
  VerifiedUser,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { reportService } from '../../services/report.service';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { StatsCard } from '../../components/common/StatsCard';
import { useNavigate } from 'react-router-dom';
import { PlatformStats } from '../../types';

interface AdminDashboardData extends PlatformStats {
  pendingVerifications: number;
  systemHealth: 'GOOD' | 'WARNING' | 'CRITICAL';
}

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const platformStats = await reportService.getPlatformStats();

      // Mock additional admin data (would come from admin-specific endpoints)
      const adminData: AdminDashboardData = {
        ...platformStats,
        pendingVerifications: 23, // Mock data
        systemHealth: 'GOOD', // Mock data
      };

      setStats(adminData);
    } catch (error: any) {
      console.error('Failed to fetch admin dashboard data:', error);
      setError(error.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading admin dashboard..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchDashboardData} />;
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'GOOD': return 'success';
      case 'WARNING': return 'warning';
      case 'CRITICAL': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Platform management and system oversight
          </Typography>
        </Box>
        <Chip
          label={`System: ${stats?.systemHealth || 'UNKNOWN'}`}
          color={getHealthColor(stats?.systemHealth || 'UNKNOWN')}
          variant="filled"
          icon={<AdminPanelSettings />}
        />
      </Box>

      {stats?.systemHealth === 'CRITICAL' && (
        <Alert severity="error" sx={{ mb: 3 }}>
          System health is critical. Please check system logs and resolve issues immediately.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon={<People sx={{ fontSize: 40 }} />}
            color="#1976d2"
            subtitle="Registered platform users"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Transactions"
            value={stats?.totalTransactions || 0}
            icon={<Receipt sx={{ fontSize: 40 }} />}
            color="#2e7d32"
            subtitle="All platform transactions"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Platform Revenue"
            value={`$${(stats?.totalRevenue || 0).toLocaleString()}`}
            icon={<TrendingUp sx={{ fontSize: 40 }} />}
            color="#ff9800"
            subtitle="Total revenue generated"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Carbon Saved"
            value={`${(stats?.totalCarbonSaved || 0).toFixed(1)} tons`}
            icon={<Nature sx={{ fontSize: 40 }} />}
            color="#4caf50"
            subtitle="CO₂ emissions avoided"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Platform Overview
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <VerifiedUser sx={{ color: 'warning.main' }} />
                    <Typography color="text.secondary">Pending Verifications</Typography>
                  </Box>
                  <Typography variant="h6" fontWeight="bold" color="warning.main">
                    {stats?.pendingVerifications || 0}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <BarChart sx={{ color: 'info.main' }} />
                    <Typography color="text.secondary">Active Listings</Typography>
                  </Box>
                  <Typography variant="h6" fontWeight="bold" color="info.main">
                    {stats?.activeListings || 0}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={1}>
                    <People sx={{ color: 'success.main' }} />
                    <Typography color="text.secondary">Verified Trips</Typography>
                  </Box>
                  <Typography variant="h6" fontWeight="bold" color="success.main">
                    {stats?.totalTrips || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Admin Actions
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<People />}
                  onClick={() => navigate('/admin/users')}
                  sx={{ justifyContent: 'flex-start', py: 1.5 }}
                >
                  Manage Users
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Receipt />}
                  onClick={() => navigate('/admin/transactions')}
                  sx={{ justifyContent: 'flex-start', py: 1.5 }}
                >
                  View Transactions
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<BarChart />}
                  onClick={() => navigate('/admin/analytics')}
                  sx={{ justifyContent: 'flex-start', py: 1.5 }}
                >
                  Platform Analytics
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Settings />}
                  onClick={() => navigate('/admin/settings')}
                  sx={{ justifyContent: 'flex-start', py: 1.5 }}
                >
                  System Settings
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Recent Activity
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Alert severity="info">
                  Recent system activities will be displayed here. This includes user registrations,
                  large transactions, verification approvals, and system events.
                </Alert>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
