import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Grid,
} from '@mui/material';
import {
  Receipt,
  Refresh,
  ShoppingCart,
  CheckCircle,
  Cancel,
  PendingActions,
} from '@mui/icons-material';
import { marketplaceService } from '../../services/marketplace.service';

// ✅ FIX: Extend Order type to match backend response
interface OrderExtended {
  id: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  totalPrice: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  listing?: {
    id: string;
    userId: string;
    amount: number;
    pricePerCredit: number;
    status: string;
    createdAt: string;
  };
}

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderExtended[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ✅ FIX: Use correct response type
      const data = await marketplaceService.getMyOrders();
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid orders data format');
      }
      
      // ✅ FIX: Map backend response to frontend format
      const mappedOrders: OrderExtended[] = data.map((order: any) => ({
        id: order.id,
        buyerId: order.buyerId,
        sellerId: order.sellerId,
        amount: order.amount,
        totalPrice: order.totalPrice,
        status: order.status,
        createdAt: order.createdAt,
        listing: order.listing
      }));
      
      setOrders(mappedOrders);
    } catch (err) {
      const error = err as Error;
      console.error('Error loading orders:', error);
      setError(error.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle color="success" />;
      case 'CANCELLED':
        return <Cancel color="error" />;
      case 'PENDING':
        return <PendingActions color="warning" />;
      default:
        return <Receipt color="action" />;
    }
  };

  const getOrderStatusColor = (status: string): "success" | "error" | "warning" | "default" => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
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
            My Orders
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track your carbon credit purchases
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadOrders}
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

      {/* Stats Overview */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2">
                Total Orders
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {orders.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2">
                Completed
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {orders.filter(o => o.status === 'COMPLETED').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2">
                Total Spent
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                ${orders
                  .filter(o => o.status === 'COMPLETED')
                  .reduce((sum, o) => sum + o.totalPrice, 0)
                  .toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Orders Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Order History
          </Typography>

          {orders.length === 0 ? (
            <Box textAlign="center" py={8}>
              <ShoppingCart sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No orders yet
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Start purchasing carbon credits from the marketplace
              </Typography>
              <Button variant="contained" href="/buyer/marketplace">
                Browse Marketplace
              </Button>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Order ID</strong></TableCell>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell><strong>Quantity</strong></TableCell>
                    <TableCell><strong>Price/Unit</strong></TableCell>
                    <TableCell><strong>Total Amount</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          #{order.id.slice(0, 8)}...
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="500">
                          {order.amount} credits
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          ${order.listing ? order.listing.pricePerCredit.toFixed(2) : 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold" color="primary.main">
                          ${order.totalPrice.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          {getOrderStatusIcon(order.status)}
                          <Chip
                            label={order.status}
                            color={getOrderStatusColor(order.status)}
                            size="small"
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};