import React, { useMemo, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Stack, Button, TextField, FormControlLabel, Switch, Divider } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { useQuery } from '@tanstack/react-query';
import { analyticsService, DateRange } from '../../services/analytics.service';

export const AnalyticsPage: React.FC = () => {
  const [range, setRange] = useState<DateRange>(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 29);
    const toIso = (d: Date) => d.toISOString().slice(0, 10);
    return { startDate: toIso(start), endDate: toIso(end) };
  });
  const [live, setLive] = useState<boolean>(true);

  const queryOpts = {
    refetchOnWindowFocus: false,
    refetchInterval: live ? 30000 : false,
  } as const;

  const { data: revenue } = useQuery({
    queryKey: ['analytics', 'revenue', range],
    queryFn: () => analyticsService.getRevenue(range),
    ...queryOpts,
  });
  const { data: users } = useQuery({
    queryKey: ['analytics', 'users', range],
    queryFn: () => analyticsService.getUsers(range),
    ...queryOpts,
  });
  const { data: carbon } = useQuery({
    queryKey: ['analytics', 'carbon', range],
    queryFn: () => analyticsService.getCarbon(range),
    ...queryOpts,
  });

  const revenueXAxis = useMemo(() => (revenue?.points || []).map(p => p.date), [revenue]);
  const revenueSeries = useMemo(() => [{ data: (revenue?.points || []).map(p => p.amount), label: 'Revenue' }], [revenue]);

  const usersXAxis = useMemo(() => (users?.points || []).map(p => p.date), [users]);
  const activeUsersSeries = useMemo(() => [{ data: (users?.points || []).map(p => p.activeUsers), label: 'Active Users' }], [users]);
  const newUsersSeries = useMemo(() => [{ data: (users?.points || []).map(p => p.newUsers), label: 'New Users' }], [users]);
  const sessionsSeries = useMemo(() => [{ data: (users?.points || []).map(p => p.sessions), label: 'Sessions' }], [users]);

  const carbonPie = useMemo(() => ([
    { id: 0, value: carbon?.minted || 0, label: 'Minted' },
    { id: 1, value: carbon?.sold || 0, label: 'Sold' },
    { id: 2, value: carbon?.expired || 0, label: 'Expired' },
  ]), [carbon]);

  // Defensive helpers for chart rendering — some chart libraries will throw
  // if provided with non-iterable values.
  const isSeriesSafe = (s: any) => Array.isArray(s) && s.every((item: any) => item && Array.isArray(item.data) && item.data.length > 0);
  const isXaxisSafe = (x: any) => Array.isArray(x) && x.every((axis: any) => Array.isArray(axis.data) && axis.data.length > 0);

  const onExportJSON = () => {
    const payload = { range, revenue, users, carbon };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_${range.startDate}_${range.endDate}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onExportCSV = () => {
    const rows: string[] = [];
    rows.push('Section,Date,Metric,Value');
    (revenue?.points || []).forEach(p => rows.push(`Revenue,${p.date},amount,${p.amount}`));
    (users?.points || []).forEach(p => {
      rows.push(`Users,${p.date},activeUsers,${p.activeUsers}`);
      rows.push(`Users,${p.date},newUsers,${p.newUsers}`);
      rows.push(`Users,${p.date},sessions,${p.sessions}`);
    });
    if (carbon) {
      rows.push(`Carbon,${range.endDate || ''},minted,${carbon.minted}`);
      rows.push(`Carbon,${range.endDate || ''},sold,${carbon.sold}`);
      rows.push(`Carbon,${range.endDate || ''},expired,${carbon.expired}`);
      rows.push(`Carbon,${range.endDate || ''},totalCredits,${carbon.totalCredits}`);
    }
    const csv = rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_${range.startDate}_${range.endDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Platform Analytics
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Comprehensive platform statistics and trends
      </Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <TextField
                label="Start date"
                type="date"
                size="small"
                value={range.startDate || ''}
                onChange={(e) => setRange(r => ({ ...r, startDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End date"
                type="date"
                size="small"
                value={range.endDate || ''}
                onChange={(e) => setRange(r => ({ ...r, endDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
              <FormControlLabel control={<Switch checked={live} onChange={(_, c) => setLive(c)} />} label="Live updates" />
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={onExportCSV}>Export CSV</Button>
              <Button variant="contained" onClick={onExportJSON}>Export JSON</Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Revenue Over Time
              </Typography>
              {isXaxisSafe([{ scaleType: 'band', data: revenueXAxis }]) && isSeriesSafe(revenueSeries) ? (
                <LineChart xAxis={[{ scaleType: 'band', data: revenueXAxis }]} series={revenueSeries} height={300} />
              ) : (
                <Typography color="text.secondary">No revenue data for the selected range</Typography>
              )}
              <Divider sx={{ mt: 2 }} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Total: {revenue?.total?.toLocaleString() || 0} {revenue?.currency || ''}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                User Behavior
              </Typography>
              {isXaxisSafe([{ scaleType: 'band', data: usersXAxis }]) && isSeriesSafe(activeUsersSeries) ? (
                <LineChart xAxis={[{ scaleType: 'band', data: usersXAxis }]} series={activeUsersSeries} height={220} />
              ) : (
                <Typography color="text.secondary">No user activity data available</Typography>
              )}

              {isXaxisSafe([{ scaleType: 'band', data: usersXAxis }]) && isSeriesSafe(newUsersSeries) ? (
                <BarChart xAxis={[{ scaleType: 'band', data: usersXAxis }]} series={newUsersSeries} height={220} />
              ) : null}

              {isXaxisSafe([{ scaleType: 'band', data: usersXAxis }]) && isSeriesSafe(sessionsSeries) ? (
                <LineChart xAxis={[{ scaleType: 'band', data: usersXAxis }]} series={sessionsSeries} height={220} />
              ) : null}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Carbon Credit Statistics
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  {Array.isArray(carbonPie) && carbonPie.length > 0 ? (
                    <PieChart height={320} series={[{ data: carbonPie }]} />
                  ) : (
                    <Typography color="text.secondary">No carbon stats available</Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography color="text.secondary">Total Credits</Typography>
                  <Typography variant="h5" fontWeight="bold">{(carbon?.totalCredits || 0).toLocaleString()}</Typography>
                  <Typography color="text.secondary" sx={{ mt: 2 }}>Minted</Typography>
                  <Typography variant="h6">{(carbon?.minted || 0).toLocaleString()}</Typography>
                  <Typography color="text.secondary" sx={{ mt: 2 }}>Sold</Typography>
                  <Typography variant="h6">{(carbon?.sold || 0).toLocaleString()}</Typography>
                  <Typography color="text.secondary" sx={{ mt: 2 }}>Expired</Typography>
                  <Typography variant="h6">{(carbon?.expired || 0).toLocaleString()}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
      
    </Box>
  );
};
