import React from 'react';
import { Box, Typography, Card, CardContent, Chip } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

export const TransactionsPage: React.FC = () => {
  // Mock data - replace with actual API
  const transactions = [
    {
      id: '1',
      userId: 'user123',
      type: 'EARN',
      amount: 50.0,
      description: 'Carbon credit earned from trip',
      createdAt: '2024-03-01 10:30',
    },
    {
      id: '2',
      userId: 'user456',
      type: 'SPEND',
      amount: 75.0,
      description: 'Carbon credit purchase',
      createdAt: '2024-03-02 14:15',
    },
  ];

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
