import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Snackbar,
  TextField,
} from '@mui/material';
import { Download, Verified, Share } from '@mui/icons-material';
import certificateService from '../../services/certificate.service';
import { Certificate } from '../../types';

export const CertificatesPage: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [query, setQuery] = useState('');

  const fetchCertificates = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await certificateService.getCertificates();
      setCertificates(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        My Certificates
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Download and manage your carbon credit certificates
      </Typography>

      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <TextField
          size="small"
          placeholder="Search certificate number"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button variant="outlined" onClick={() => {
          const exportCsv = (list: Certificate[]) => {
            const headers = ['Certificate Number', 'Amount', 'Issue Date', 'Status'];
            const rows = list.map(c => [c.certificateNumber, String(c.amount), c.issueDate, c.pdfUrl ? 'VERIFIED' : 'UNKNOWN']);
            const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `certificates-${new Date().toISOString().slice(0,10)}.csv`;
            link.click();
          };
          exportCsv(certificates.filter(c => c.certificateNumber.includes(query)));
        }}>Export CSV</Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box textAlign="center" py={4}>
          <Typography color="error" paragraph>{error}</Typography>
          <Button variant="contained" onClick={fetchCertificates}>Retry</Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
        {certificates
          .filter(c => c.certificateNumber.toLowerCase().includes(query.toLowerCase()))
          .map((cert) => (
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
                <Box display="flex" gap={1}>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={async () => {
                      try {
                        const blob = await certificateService.downloadPdf(cert.id);
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `${cert.certificateNumber}.pdf`;
                        link.click();
                      } catch (err: any) {
                        setSnackbarMessage(err?.response?.data?.message || 'Download failed');
                      }
                    }}
                  >
                    Download PDF
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Share />}
                    onClick={async () => {
                      try {
                        const { shareUrl } = await certificateService.createShareLink(cert.id);
                        await navigator.clipboard.writeText(shareUrl);
                        setSnackbarMessage('Share link copied');
                      } catch (err: any) {
                        setSnackbarMessage(err?.response?.data?.message || 'Share failed');
                      }
                    }}
                  >
                    Share
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
        </Grid>
      )}

      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={3000}
        onClose={() => setSnackbarMessage('')}
        message={snackbarMessage}
      />
    </Box>
  );
};
