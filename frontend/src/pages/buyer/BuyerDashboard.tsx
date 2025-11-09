import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { Storefront, Receipt, CardGiftcard } from '@mui/icons-material';

export const BuyerDashboard: React.FC = () => {
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
                    120
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
                    8
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
                    5
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
