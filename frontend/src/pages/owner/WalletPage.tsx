import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  Divider,
} from '@mui/material';
import { AccountBalanceWallet, TrendingUp, TrendingDown } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { walletService } from '../../services/wallet.service';
import { Wallet, Transaction } from '../../types';
import { format } from 'date-fns';

export const WalletPage: React.FC = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [walletData, transactionsData] = await Promise.all([
          walletService.getMyWallet(),
          walletService.getTransactions(),
        ]);
        setWallet(walletData);
        setTransactions(transactionsData);
      } catch (error) {
        console.error('Failed to fetch wallet data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: 'Date',
      width: 180,
      valueGetter: (params) => format(new Date(params.row.createdAt), 'MMM dd, yyyy HH:mm'),
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 120,
      renderCell: (params) => {
        const type = params.value as string;
        const icon =
          type === 'EARN' ? (
            <TrendingUp sx={{ color: 'success.main', fontSize: 18 }} />
          ) : (
            <TrendingDown sx={{ color: 'error.main', fontSize: 18 }} />
          );
        return (
          <Box display="flex" alignItems="center" gap={1}>
            {icon}
            {type}
          </Box>
        );
      },
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 130,
      type: 'number',
      valueFormatter: (params) => `$${params.value?.toFixed(2)}`,
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        My Wallet
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Manage your carbon credit earnings and transactions
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <AccountBalanceWallet sx={{ fontSize: 40, color: 'white' }} />
                <Typography variant="h6" color="white">
                  Current Balance
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold" color="white">
                ${wallet?.balance.toFixed(2) || '0.00'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Earned
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                ${wallet?.totalEarned.toFixed(2) || '0.00'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Spent
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="error.main">
                ${wallet?.totalSpent.toFixed(2) || '0.00'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight="bold">
            Transaction History
          </Typography>
          <Button variant="outlined">Export CSV</Button>
        </Box>

        <Card>
          <CardContent>
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
            />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
