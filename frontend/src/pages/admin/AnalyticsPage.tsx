import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';

export const AnalyticsPage: React.FC = () => {
  // Mock data for charts
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const userData = [100, 150, 200, 280, 350, 400];
  const revenueData = [5000, 7500, 12000, 18000, 25000, 32000];

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Platform Analytics
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Comprehensive platform statistics and trends
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                User Growth
              </Typography>
              <LineChart
                xAxis={[{ scaleType: 'band', data: months }]}
                series={[{ data: userData, label: 'Users' }]}
                height={300}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Revenue Trend
              </Typography>
              <BarChart
                xAxis={[{ scaleType: 'band', data: months }]}
                series={[{ data: revenueData, label: 'Revenue ($)' }]}
                height={300}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Key Metrics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Typography color="text.secondary">Avg. Trip Distance</Typography>
                  <Typography variant="h5" fontWeight="bold">
                    45.2 km
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography color="text.secondary">Avg. Carbon/Trip</Typography>
                  <Typography variant="h5" fontWeight="bold">
                    5.8 kg
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography color="text.secondary">Marketplace Activity</Typography>
                  <Typography variant="h5" fontWeight="bold">
                    89%
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography color="text.secondary">Verification Rate</Typography>
                  <Typography variant="h5" fontWeight="bold">
                    92%
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
