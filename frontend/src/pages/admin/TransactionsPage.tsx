import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Chip, CircularProgress, Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import adminService from '../../services/admin.service';
import { format } from 'date-fns';

export const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: 'Date',
      width: 180,
      valueGetter: (params: any) => format(new Date(params.row.createdAt), 'MMM dd, yyyy HH:mm'),
    },
    {
      field: 'userId',
      headerName: 'User ID',
      width: 150,
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 120,
      renderCell: (params: any) => {
        const color = params.value === 'EARN' ? 'success' : 'error';
        return <Chip label={params.value} color={color} size="small" />;
      },
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 130,
      valueFormatter: (params: any) => `$${params.value?.toFixed(2)}`,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
    },
  ];

  useEffect(() => { fetchTransactions(); }, []);

  async function fetchTransactions() {
    setLoading(true); setError('');
    try {
      const data = await adminService.getTransactions();
      setTransactions(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load transactions');
    } finally { setLoading(false); }
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        All Transactions
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Platform-wide transaction history
      </Typography>

      <Card>
        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px"><CircularProgress /></Box>
          ) : error ? (
            <Box textAlign="center"><Typography color="error">{error}</Typography><Button variant="contained" onClick={fetchTransactions}>Retry</Button></Box>
          ) : (
          <DataGrid
            rows={transactions}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
            autoHeight
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
            }}
          />)}
        </CardContent>
      </Card>
    </Box>
  );
};
