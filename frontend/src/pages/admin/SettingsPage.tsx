import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Save } from '@mui/icons-material';

export const SettingsPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        System Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Configure platform settings and parameters
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Carbon Credit Pricing
              </Typography>
              <TextField
                fullWidth
                label="Base Price per kg CO₂"
                type="number"
                defaultValue="10.00"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Commission Rate (%)"
                type="number"
                defaultValue="5"
                margin="normal"
              />
              <Button variant="contained" startIcon={<Save />} sx={{ mt: 2 }}>
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Verification Settings
              </Typography>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Auto-approve verified trips"
              />
              <TextField
                fullWidth
                label="Min. Trip Distance (km)"
                type="number"
                defaultValue="5"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Verification Timeout (days)"
                type="number"
                defaultValue="7"
                margin="normal"
              />
              <Button variant="contained" startIcon={<Save />} sx={{ mt: 2 }}>
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Notification Settings
              </Typography>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Email notifications enabled"
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Push notifications enabled"
              />
              <FormControlLabel
                control={<Switch />}
                label="SMS notifications enabled"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
