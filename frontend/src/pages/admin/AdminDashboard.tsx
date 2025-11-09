import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { People, Receipt, TrendingUp, Nature } from '@mui/icons-material';

export const AdminDashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Platform management and analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <People sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box>
                  <Typography color="text.secondary">Total Users</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    1,245
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Receipt sx={{ fontSize: 40, color: 'success.main' }} />
                <Box>
                  <Typography color="text.secondary">Transactions</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    8,456
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <TrendingUp sx={{ fontSize: 40, color: 'warning.main' }} />
                <Box>
                  <Typography color="text.secondary">Revenue</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    $125K
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Nature sx={{ fontSize: 40, color: 'info.main' }} />
                <Box>
                  <Typography color="text.secondary">Carbon Saved</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    52 tons
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
