import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
} from '@mui/material';
import { Download, Verified } from '@mui/icons-material';

export const CertificatesPage: React.FC = () => {
  // Mock data - replace with actual API call
  const certificates = [
    {
      id: '1',
      certificateNumber: 'CC-2024-001',
      amount: 50,
      issueDate: '2024-01-15',
      status: 'VERIFIED',
    },
    {
      id: '2',
      certificateNumber: 'CC-2024-002',
      amount: 75,
      issueDate: '2024-02-20',
      status: 'VERIFIED',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        My Certificates
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Download and manage your carbon credit certificates
      </Typography>

      <Grid container spacing={3}>
        {certificates.map((cert) => (
          <Grid item xs={12} md={6} key={cert.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Verified color="success" />
                    <Typography variant="h6" fontWeight="bold">
                      {cert.certificateNumber}
                    </Typography>
                  </Box>
                  <Chip label={cert.status} color="success" size="small" />
                </Box>
                <Typography color="text.secondary" variant="body2">
                  Amount: {cert.amount} kg CO₂
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Issue Date: {cert.issueDate}
                </Typography>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Download />}
                  sx={{ mt: 2 }}
                >
                  Download PDF
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
