import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Chip, CircularProgress, Alert } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface Transaction {
  id: string;
  userId: string;
  type: 'EARN' | 'SPEND';
  amount: number;
  description: string;
  createdAt: string;
}

export const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/admin/transactions');
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
        const data = await response.json();
        if (data.success) {
          // Transform API data to match component expectations
          const transformedTransactions = data.data.map((transaction: any) => ({
            id: transaction.id,
            userId: transaction.userId,
            type: transaction.type,
            amount: transaction.amount,
            description: transaction.description,
            createdAt: transaction.createdAt
          }));
          setTransactions(transformedTransactions);
        } else {
          throw new Error('API returned error');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: 'Date',
      width: 180,
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          All Transactions
        </Typography>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
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
  );
};
