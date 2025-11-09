import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { verificationService } from '../../services/verification.service';

export const CVAReportsPage: React.FC = () => {
  const [stats, setStats] = useState({ total: 0, approved: 0, rejected: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await verificationService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

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
        Verification Reports
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        View verification statistics and analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Total Verifications</Typography>
              <Typography variant="h4" fontWeight="bold">
                {stats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Approved</Typography>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {stats.approved}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Rejected</Typography>
              <Typography variant="h4" fontWeight="bold" color="error.main">
                {stats.rejected}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Pending</Typography>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {stats.pending}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Verification Overview
              </Typography>
              <BarChart
                xAxis={[{ scaleType: 'band', data: ['Approved', 'Rejected', 'Pending'] }]}
                series={[{ data: [stats.approved, stats.rejected, stats.pending] }]}
                height={300}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
