import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Skeleton,
} from '@mui/material';
import {
  Download,
  Visibility,
  Refresh,
  CardGiftcard,
  CheckCircle,
  Print,
  Share,
  ErrorOutline,
} from '@mui/icons-material';
import { verificationService } from '../../services/verification.service';
import { Certificate } from '../../types';

export const CertificatesPage: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await verificationService.getMyCertificates();
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid certificates data format received from server');
      }
      
      // ✅ FIX: Map backend snake_case fields to frontend camelCase
      const mappedCertificates = data.map((cert: any) => ({
        ...cert,
        // Backend fields (snake_case) -> Frontend fields (camelCase)
        pdfUrl: cert.certificate_url || '',  // ✅ Backend: certificate_url
        issueDate: cert.issued_at || cert.created_at,  // ✅ Backend: issued_at
        certificateNumber: cert.certificate_number || '',  // ✅ Backend: certificate_number
        creditId: cert.verification_id || cert.creditId || '',  // ✅ Backend: verification_id
        userId: cert.user_id || cert.userId || '',  // ✅ Backend: user_id
      }));
      
      setCertificates(mappedCertificates);
    } catch (err) {
      const error = err as Error;
      console.error('Error loading certificates:', error);
      setError(error.message || 'Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setDetailDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDetailDialogOpen(false);
    setSelectedCertificate(null);
  };

  const handleDownloadPDF = async (certificate: Certificate) => {
    try {
      setDownloadingId(certificate.id);
      
      if (!certificate.pdfUrl || certificate.pdfUrl.trim() === '') {
        throw new Error('Certificate PDF is not available yet. Please contact support.');
      }

      // ✅ FIX: Handle relative/absolute URLs
      let downloadUrl = certificate.pdfUrl;
      if (!downloadUrl.startsWith('http')) {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        downloadUrl = `${baseUrl}${downloadUrl.startsWith('/') ? '' : '/'}${downloadUrl}`;
      }

      const response = await fetch(downloadUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to download certificate: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${certificate.certificateNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const error = err as Error;
      console.error('Error downloading certificate:', error);
      alert(`Failed to download certificate: ${error.message}`);
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async (certificate: Certificate) => {
    const shareData = {
      title: 'Carbon Credit Certificate',
      text: `Certificate No: ${certificate.certificateNumber}\nIssued: ${new Date(certificate.issueDate).toLocaleDateString()}`,
      url: certificate.pdfUrl || window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        copyToClipboard(certificate);
      }
    } else {
      copyToClipboard(certificate);
    }
  };

  const copyToClipboard = (certificate: Certificate) => {
    const text = `Certificate No: ${certificate.certificateNumber}\nIssued: ${new Date(certificate.issueDate).toLocaleDateString()}`;
    navigator.clipboard.writeText(text)
      .then(() => alert('Certificate details copied to clipboard!'))
      .catch(() => alert('Failed to copy to clipboard'));
  };

  if (loading) {
    return (
      <Box>
        <Box mb={4}>
          <Skeleton variant="text" width={300} height={40} />
          <Skeleton variant="text" width={500} height={20} />
        </Box>
        <Skeleton variant="rectangular" height={120} sx={{ mb: 4, borderRadius: 2 }} />
        <Grid container spacing={3}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            My Certificates
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View and download your verified carbon credit certificates
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadCertificates}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats Card */}
      <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)' }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <CardGiftcard sx={{ fontSize: 60, color: 'white' }} />
            <Box>
              <Typography variant="h3" fontWeight="bold" color="white">
                {certificates.length}
              </Typography>
              <Typography variant="h6" color="rgba(255,255,255,0.9)">
                Total Certificates Issued
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Certificates Grid */}
      {certificates.length === 0 ? (
        <Card>
          <CardContent>
            <Box textAlign="center" py={8}>
              <CardGiftcard sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No certificates yet
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Complete your purchases to receive carbon credit certificates
              </Typography>
              <Button variant="contained" href="/buyer/marketplace">
                Browse Marketplace
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {certificates.map((certificate) => (
            <Grid item xs={12} sm={6} md={4} key={certificate.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Certificate Header */}
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <CardGiftcard color="primary" sx={{ fontSize: 40 }} />
                    <Chip
                      icon={<CheckCircle />}
                      label="Verified"
                      color="success"
                      size="small"
                    />
                  </Box>

                  {/* Certificate Number */}
                  <Typography variant="overline" color="text.secondary">
                    Certificate No.
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    fontFamily="monospace"
                    gutterBottom
                    sx={{ wordBreak: 'break-all' }}
                  >
                    {certificate.certificateNumber || 'N/A'}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  {/* Certificate Details */}
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      Issue Date
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {new Date(certificate.issueDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Verification ID
                    </Typography>
                    <Typography
                      variant="body2"
                      fontFamily="monospace"
                      sx={{ wordBreak: 'break-all' }}
                    >
                      {certificate.creditId?.slice(0, 16)}...
                    </Typography>
                  </Box>

                  {/* Warning if PDF not available */}
                  {(!certificate.pdfUrl || certificate.pdfUrl.trim() === '') && (
                    <Box mt={2}>
                      <Chip
                        icon={<ErrorOutline />}
                        label="PDF Pending"
                        color="warning"
                        size="small"
                      />
                    </Box>
                  )}
                </CardContent>

                {/* Actions */}
                <Box sx={{ p: 2, pt: 0 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(certificate)}
                        sx={{ width: '100%' }}
                        title="View Details"
                      >
                        <Visibility />
                      </IconButton>
                    </Grid>
                    <Grid item xs={4}>
                      <IconButton
                        size="small"
                        onClick={() => handleDownloadPDF(certificate)}
                        disabled={downloadingId === certificate.id || !certificate.pdfUrl}
                        sx={{ width: '100%' }}
                        title="Download PDF"
                      >
                        {downloadingId === certificate.id ? (
                          <CircularProgress size={20} />
                        ) : (
                          <Download />
                        )}
                      </IconButton>
                    </Grid>
                    <Grid item xs={4}>
                      <IconButton
                        size="small"
                        onClick={() => handleShare(certificate)}
                        sx={{ width: '100%' }}
                        title="Share"
                      >
                        <Share />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Certificate Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <CardGiftcard color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Certificate Details
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedCertificate && (
            <Box>
              {/* Certificate Badge */}
              <Box
                sx={{
                  p: 3,
                  mb: 3,
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
                  borderRadius: 2,
                }}
              >
                <CheckCircle sx={{ fontSize: 60, color: 'white', mb: 1 }} />
                <Typography variant="h6" color="white" fontWeight="bold">
                  Verified Carbon Credit Certificate
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Certificate Number
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    fontFamily="monospace"
                    sx={{ wordBreak: 'break-all' }}
                  >
                    {selectedCertificate.certificateNumber || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Issue Date
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {new Date(selectedCertificate.issueDate).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Certificate Status
                  </Typography>
                  <Chip
                    icon={<CheckCircle />}
                    label="Verified & Valid"
                    color="success"
                  />
                </Grid>
                {selectedCertificate.pdfUrl && (
                  <>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Document Status
                      </Typography>
                      <Chip
                        icon={<CheckCircle />}
                        label="PDF Available"
                        color="primary"
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          <Button startIcon={<Print />} onClick={handlePrint}>
            Print
          </Button>
          {selectedCertificate && selectedCertificate.pdfUrl && (
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={() => handleDownloadPDF(selectedCertificate)}
              disabled={downloadingId === selectedCertificate.id}
            >
              {downloadingId === selectedCertificate.id ? 'Downloading...' : 'Download PDF'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};