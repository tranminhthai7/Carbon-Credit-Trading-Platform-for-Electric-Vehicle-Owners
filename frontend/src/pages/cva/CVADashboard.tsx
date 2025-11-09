import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { VerifiedUser, Assessment, PendingActions } from '@mui/icons-material';

export const CVADashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        CVA Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Carbon Verification Authority - Verify EV trips and carbon credits
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <PendingActions sx={{ fontSize: 40, color: 'warning.main' }} />
                <Box>
                  <Typography color="text.secondary">Pending Verifications</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    24
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
                <VerifiedUser sx={{ fontSize: 40, color: 'success.main' }} />
                <Box>
                  <Typography color="text.secondary">Verified This Month</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    156
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
                <Assessment sx={{ fontSize: 40, color: 'info.main' }} />
                <Box>
                  <Typography color="text.secondary">Total Verified</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    1,248
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
