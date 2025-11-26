import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Chip, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { marketplaceService } from '../../services/marketplace.service';
import { Order } from '../../types';
import { format } from 'date-fns';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await marketplaceService.getSellerOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (order: Order, action: 'ACCEPTED' | 'REJECTED') => {
    setSelectedOrder({ ...order, status: action });
    setActionDialogOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedOrder) return;
    try {
      await marketplaceService.updateOrderStatus(selectedOrder.id, selectedOrder.status);
      await fetchOrders();
      setActionDialogOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Failed to update order:', error);
    }
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
      width: 200,
      renderCell: (params: any) => {
        const order = params.row as Order;
        if (order.status !== 'PENDING') return null;
        return (
          <Box>
            <Button
              size="small"
              variant="contained"
              color="success"
              onClick={() => handleAction(order, 'ACCEPTED')}
              sx={{ mr: 1 }}
            >
              Accept
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => handleAction(order, 'REJECTED')}
            >
              Reject
            </Button>
          </Box>
        );
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
        Manage orders for your carbon credit listings
      </Typography>

      <Card>
        <CardContent>
          <DataGrid
            rows={orders}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10]}
          />
        </CardContent>
      </Card>

      <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {selectedOrder?.status === 'PENDING' ? 'accept' : 'reject'} this order?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmAction} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};