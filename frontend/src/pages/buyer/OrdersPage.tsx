import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Chip, CircularProgress, Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { marketplaceService } from '../../services/marketplace.service';
import { Order } from '../../types';
import { format } from 'date-fns';

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await marketplaceService.getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handlePay = async (orderId: string) => {
    console.log('Navigating to payment for order:', orderId);
    navigate(`/buyer/payment?orderId=${orderId}`);
  };

  const columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: 'Date',
      width: 180,
      valueGetter: (params: any) => format(new Date(params.row.createdAt), 'MMM dd, yyyy HH:mm'),
    },
    {
      field: 'quantity',
      headerName: 'Quantity (kg)',
      width: 130,
      type: 'number',
    },
    {
      field: 'totalAmount',
      headerName: 'Total Amount',
      width: 150,
      valueFormatter: (params: any) => `$${params.value?.toFixed(2)}`,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params: any) => {
        const status = params.value as string;
        const color =
          status === 'COMPLETED' ? 'success' :
          status === 'ACCEPTED' ? 'primary' :
          status === 'PENDING' ? 'warning' :
          status === 'REJECTED' ? 'error' : 'default';
        return <Chip label={status} color={color} size="small" />;
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params: any) => {
        const status = params.row.status;
        if (status === 'PENDING') {
          return (
            <Button
              variant="contained"
              size="small"
              onClick={() => handlePay(params.row.id)}
            >
              Pay Now
            </Button>
          );
        }
        return null;
      },
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
        My Orders
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        View your carbon credit purchase history
      </Typography>

      <Card>
        <CardContent>
          <DataGrid
            rows={orders}
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
