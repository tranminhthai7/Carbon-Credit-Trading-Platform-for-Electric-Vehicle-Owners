import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Box, Button } from '@mui/material';
import {
  DirectionsCar,
  AccountBalanceWallet,
  Nature,
  TrendingUp,
  Add,
  Visibility,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { reportService } from '../../services/report.service';
import { PersonalStats } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { StatsCard } from '../../components/common/StatsCard';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { CarbonSavingsChart } from '../../components/charts/CarbonSavingsChart';
import { EarningsChart } from '../../components/charts/EarningsChart';
import { useNavigate } from 'react-router-dom';

export const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<PersonalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const fetchStats = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError('');
      const data = await reportService.getPersonalStats(user.id);
      setStats(data);
    } catch (error: any) {
      console.error('Failed to fetch stats:', error);
      setError(error.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchStats} />;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome, {user?.name}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your EV trips and carbon credit earnings
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Trips"
            value={stats?.totalTrips || 0}
            icon={<DirectionsCar sx={{ fontSize: 40 }} />}
            color="#2e7d32"
            trend={12.5}
            subtitle="All recorded trips"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Distance"
            value={`${(stats?.totalDistance || 0).toFixed(0)} km`}
            icon={<TrendingUp sx={{ fontSize: 40 }} />}
            color="#1976d2"
            trend={8.3}
            subtitle="Total kilometers driven"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Carbon Saved"
            value={`${(stats?.totalCarbonSaved || 0).toFixed(2)} kg`}
            icon={<Nature sx={{ fontSize: 40 }} />}
            color="#4caf50"
            trend={15.7}
            subtitle="CO₂ emissions avoided"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Earnings"
            value={`$${(stats?.totalEarnings || 0).toFixed(2)}`}
            icon={<AccountBalanceWallet sx={{ fontSize: 40 }} />}
            color="#ff9800"
            trend={20.4}
            subtitle="From carbon credits"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <CarbonSavingsChart 
            data={[
              { month: 'Jan', carbonSaved: 45 },
              { month: 'Feb', carbonSaved: 52 },
              { month: 'Mar', carbonSaved: 61 },
              { month: 'Apr', carbonSaved: 58 },
              { month: 'May', carbonSaved: 70 },
              { month: 'Jun', carbonSaved: stats?.totalCarbonSaved || 75 },
            ]}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <EarningsChart 
            data={[
              { month: 'Jan', earnings: 120 },
              { month: 'Feb', earnings: 150 },
              { month: 'Mar', earnings: 180 },
              { month: 'Apr', earnings: 165 },
              { month: 'May', earnings: 200 },
              { month: 'Jun', earnings: stats?.totalEarnings || 220 },
            ]}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Trip Status
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: 'success.main',
                      }}
                    />
                    <Typography color="text.secondary">Verified Trips</Typography>
                  </Box>
                  <Typography variant="h6" fontWeight="bold" color="success.main">
                    {stats?.verifiedTrips || 0}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: 'warning.main',
                      }}
                    />
                    <Typography color="text.secondary">Pending Verification</Typography>
                  </Box>
                  <Typography variant="h6" fontWeight="bold" color="warning.main">
                    {stats?.pendingTrips || 0}
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
                Quick Actions
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Add />}
                  onClick={() => navigate('/owner/trips')}
                  sx={{ justifyContent: 'flex-start', py: 1.5 }}
                >
                  Record a new trip
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Visibility />}
                  onClick={() => navigate('/owner/wallet')}
                  sx={{ justifyContent: 'flex-start', py: 1.5 }}
                >
                  Check wallet balance
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<DirectionsCar />}
                  onClick={() => navigate('/owner/listings')}
                  sx={{ justifyContent: 'flex-start', py: 1.5 }}
                >
                  Create carbon credit listing
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
