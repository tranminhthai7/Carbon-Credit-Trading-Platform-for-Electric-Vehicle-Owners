import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import {
  DirectionsCar,
  AccountBalanceWallet,
  Nature,
  TrendingUp,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { reportService } from '../../services/report.service';
import { PersonalStats } from '../../types';

export const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<PersonalStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      try {
        const data = await reportService.getPersonalStats(user.id);
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const statCards = [
    {
      title: 'Total Trips',
      value: stats?.totalTrips || 0,
      icon: <DirectionsCar sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
    },
    {
      title: 'Total Distance',
      value: `${(stats?.totalDistance || 0).toFixed(0)} km`,
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: '#1976d2',
    },
    {
      title: 'Carbon Saved',
      value: `${(stats?.totalCarbonSaved || 0).toFixed(2)} kg`,
      icon: <Nature sx={{ fontSize: 40 }} />,
      color: '#4caf50',
    },
    {
      title: 'Total Earnings',
      value: `$${(stats?.totalEarnings || 0).toFixed(2)}`,
      icon: <AccountBalanceWallet sx={{ fontSize: 40 }} />,
      color: '#ff9800',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Welcome, {user?.name}!
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Track your EV trips and carbon credit earnings
      </Typography>

      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" variant="body2" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {card.value}
                    </Typography>
                  </Box>
                  <Box sx={{ color: card.color }}>{card.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Trip Status
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography color="text.secondary">Verified Trips</Typography>
                  <Typography fontWeight="bold" color="success.main">
                    {stats?.verifiedTrips || 0}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography color="text.secondary">Pending Verification</Typography>
                  <Typography fontWeight="bold" color="warning.main">
                    {stats?.pendingTrips || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Quick Actions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Record a new trip
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Check wallet balance
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Create carbon credit listing
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
