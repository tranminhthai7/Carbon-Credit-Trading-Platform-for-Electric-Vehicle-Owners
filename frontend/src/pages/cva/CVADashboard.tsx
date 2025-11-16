import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, Button, List, ListItem, ListItemText, Chip, Snackbar } from '@mui/material';
import { VerifiedUser, Assessment, PendingActions, CheckCircle, Cancel } from '@mui/icons-material';
import { verificationService } from '../../services/verification.service';
import { Verification } from '../../types';

export const CVADashboard: React.FC = () => {
  const [pending, setPending] = useState<Verification[]>([]);
  const [stats, setStats] = useState({ total: 0, approved: 0, rejected: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [pendingList, statsData] = await Promise.all([
        verificationService.getPendingVerifications(),
        verificationService.getStats(),
      ]);
      setPending(pendingList);
      setStats(statsData);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load verification data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await verificationService.approveVerification(id, 'Approved by CVA');
      setSnackbar('Verification approved');
      fetchData();
    } catch (err: any) {
      setSnackbar(err?.response?.data?.message || 'Approve failed');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await verificationService.rejectVerification(id, 'Rejected by CVA');
      setSnackbar('Verification rejected');
      fetchData();
    } catch (err: any) {
      setSnackbar(err?.response?.data?.message || 'Reject failed');
    }
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px"><CircularProgress /></Box>;
  }

  if (error) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="error">{error}</Typography>
        <Button variant="contained" onClick={fetchData} sx={{ mt: 2 }}>Retry</Button>
      </Box>
    );
  }

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
                      {stats.pending || 0}
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
                      {stats.approved || 0}
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
                      {stats.total || 0}
                    </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Pending Queue
              </Typography>
              {pending.length === 0 ? (
                <Typography color="text.secondary">No pending verifications</Typography>
              ) : (
                <List>
                  {pending.slice(0, 8).map((v) => (
                    <ListItem key={v.id} secondaryAction={(
                      <Box display="flex" gap={1}>
                        <Button variant="contained" color="success" startIcon={<CheckCircle />} onClick={() => handleApprove(v.id)}>Approve</Button>
                        <Button variant="outlined" color="error" startIcon={<Cancel />} onClick={() => handleReject(v.id)}>Reject</Button>
                      </Box>
                    )}>
                      <ListItemText primary={`Trip ${v.tripId}`} secondary={`Created: ${new Date(v.createdAt).toLocaleString()}`} />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar open={!!snackbar} autoHideDuration={3000} onClose={() => setSnackbar('')} message={snackbar} />
    </Box>
  );
};
