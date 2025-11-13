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
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper,
} from '@mui/material';
import {
  Assessment,
  CheckCircle,
  Cancel,
  PendingActions,
  Download,
  Refresh,
  TrendingUp,
  Description,
} from '@mui/icons-material';
import { verificationService } from '../../services/verification.service';
import { useAuth } from '../../context/AuthContext';
import { Verification } from '../../types';

interface VerificationStats {
  total: number;
  approved: number;
  rejected: number;
  pending: number;
  approval_rate: string;
}

interface MonthlyReport {
  month: string;
  totalVerifications: number;
  approved: number;
  rejected: number;
  pending: number;
}

export const CVAReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<VerificationStats>({
    total: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
    approval_rate: '0.00',
  });
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [monthlyReports, setMonthlyReports] = useState<MonthlyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('30');
  const [reportType, setReportType] = useState('summary');

  useEffect(() => {
    loadReportData();
  }, [dateRange]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      setError(null);

      const verificationsData = await verificationService.getMyVerifications();
      setVerifications(verificationsData);

      const statsData = await verificationService.getStats(user?.id);
      setStats({
        total: statsData.total || 0,
        approved: statsData.approved || 0,
        rejected: statsData.rejected || 0,
        pending: statsData.pending || 0,
        approval_rate: statsData.approval_rate || '0.00',
      });

      generateMonthlyReports(verificationsData);
    } catch (err: any) {
      console.error('Error loading report data:', err);
      setError(err.message || 'Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const generateMonthlyReports = (data: Verification[]) => {
    const reports: { [key: string]: MonthlyReport } = {};
    
    data.forEach((verification) => {
      // ✅ FIX: Use created_at (snake_case)
      const date = new Date(verification.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!reports[monthKey]) {
        reports[monthKey] = {
          month: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          totalVerifications: 0,
          approved: 0,
          rejected: 0,
          pending: 0,
        };
      }
      
      reports[monthKey].totalVerifications++;
      
      if (verification.status === 'APPROVED') {
        reports[monthKey].approved++;
      } else if (verification.status === 'REJECTED') {
        reports[monthKey].rejected++;
      } else if (verification.status === 'PENDING') {
        reports[monthKey].pending++;
      }
    });
    
    setMonthlyReports(Object.values(reports).reverse());
  };

  const handleExportReport = () => {
    const reportData = {
      stats,
      monthlyReports,
      verifications,
      generatedAt: new Date().toISOString(),
      verifier: user?.name,
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cva-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle color="success" />;
      case 'REJECTED':
        return <Cancel color="error" />;
      case 'PENDING':
        return <PendingActions color="warning" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string): "success" | "error" | "warning" | "default" => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'error';
      case 'PENDING':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Verification Reports
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View detailed reports of your verification activities
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadReportData}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleExportReport}
          >
            Export Report
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Report Type"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                size="small"
              >
                <MenuItem value="summary">Summary Report</MenuItem>
                <MenuItem value="detailed">Detailed Report</MenuItem>
                <MenuItem value="monthly">Monthly Breakdown</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Date Range"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                size="small"
              >
                <MenuItem value="7">Last 7 days</MenuItem>
                <MenuItem value="30">Last 30 days</MenuItem>
                <MenuItem value="90">Last 90 days</MenuItem>
                <MenuItem value="365">Last year</MenuItem>
                <MenuItem value="all">All time</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <Assessment color="action" />
                <Typography variant="body2" color="text.secondary">
                  Report generated for: <strong>{user?.name}</strong>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Total Verifications
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.total}
                  </Typography>
                </Box>
                <Description color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Approved
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {stats.approved}
                  </Typography>
                </Box>
                <CheckCircle color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Rejected
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="error.main">
                    {stats.rejected}
                  </Typography>
                </Box>
                <Cancel color="error" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Approval Rate
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="primary.main">
                    {stats.approval_rate}%
                  </Typography>
                </Box>
                <TrendingUp color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Monthly Breakdown */}
      {reportType === 'monthly' && monthlyReports.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Monthly Breakdown
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Month</strong></TableCell>
                    <TableCell align="right"><strong>Total</strong></TableCell>
                    <TableCell align="right"><strong>Approved</strong></TableCell>
                    <TableCell align="right"><strong>Rejected</strong></TableCell>
                    <TableCell align="right"><strong>Pending</strong></TableCell>
                    <TableCell align="right"><strong>Approval Rate</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {monthlyReports.map((report, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{report.month}</TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="bold">{report.totalVerifications}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography color="success.main">{report.approved}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography color="error.main">{report.rejected}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography color="warning.main">{report.pending}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={`${report.totalVerifications > 0 
                            ? ((report.approved / report.totalVerifications) * 100).toFixed(1)
                            : 0}%`}
                          color="primary"
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Recent Verifications */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Recent Verifications
          </Typography>
          
          {verifications.length === 0 ? (
            <Box textAlign="center" py={6}>
              <Assessment sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No verifications found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Verifications will appear here once you start reviewing trips
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Verification ID</strong></TableCell>
                    <TableCell><strong>Vehicle ID</strong></TableCell>
                    <TableCell><strong>CO2 Amount</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Created Date</strong></TableCell>
                    <TableCell><strong>Reviewed Date</strong></TableCell>
                    <TableCell><strong>Comments</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {verifications.slice(0, 10).map((verification) => (
                    <TableRow key={verification.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          #{verification.id.slice(0, 8)}...
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {/* ✅ FIX: Use vehicle_id */}
                          #{verification.vehicle_id?.slice(0, 8) || 'N/A'}...
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="500">
                          {/* ✅ FIX: Use co2_amount */}
                          {verification.co2_amount} kg
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          {getStatusIcon(verification.status)}
                          <Chip
                            label={verification.status}
                            color={getStatusColor(verification.status)}
                            size="small"
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {/* ✅ FIX: Use created_at */}
                          {new Date(verification.created_at).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {/* ✅ FIX: Use reviewed_at */}
                          {verification.reviewed_at
                            ? new Date(verification.reviewed_at).toLocaleDateString()
                            : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                          {/* ✅ FIX: Use notes */}
                          {verification.notes || 'No comments'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Paper sx={{ p: 3, mt: 3, background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h6" color="white" fontWeight="bold" gutterBottom>
              Report Summary
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.9)">
              You have verified {stats.total} trips with an approval rate of {stats.approval_rate}%.
              Keep up the great work in maintaining carbon credit integrity!
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                size="large"
                startIcon={<Download />}
                onClick={handleExportReport}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                  },
                }}
              >
                Download Full Report
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};