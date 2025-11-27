import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import { marketplaceService } from '../../services/marketplace.service';
import { Order, Listing } from '../../types';

export const PaymentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
  });
  const [error, setError] = useState('');

  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (!orderId) {
      navigate('/buyer/orders');
      return;
    }
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    if (!orderId) return;
    console.log('Fetching order for id:', orderId);
    try {
      const foundOrder = await marketplaceService.getOrderById(orderId);
      console.log('Found order:', foundOrder);
      setOrder(foundOrder);
      
      // Fetch listing details
      if (foundOrder.listingId) {
        const listingData = await marketplaceService.getListingById(foundOrder.listingId);
        setListing(listingData);
      }
    } catch (err) {
      console.error('Failed to fetch order:', err);
      setError('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    if (!order) return;
    setPaying(true);
    setError('');
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Call pay API
      await marketplaceService.payOrder(order.id);
      // Redirect to orders
      navigate('/buyer/orders');
    } catch (err) {
      console.error('Payment failed:', err);
      setError('Payment failed. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!order) {
    return (
      <Box>
        <Typography>Order not found</Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth="600px" mx="auto">
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Payment
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Complete your payment for carbon credits
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Order Details
          </Typography>
          <Typography>Quantity: {order.quantity} kg CO₂</Typography>
          <Typography>Total Amount: ${order.totalAmount?.toFixed(2)}</Typography>
          <Typography>Status: {order.status}</Typography>
          {listing && (
            <>
              <Typography>Price per unit: ${listing.pricePerUnit.toFixed(2)}</Typography>
              <Typography>Seller ID: {listing.sellerId}</Typography>
              <Typography>Listing Type: {listing.type}</Typography>
            </>
          )}
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Payment Information
          </Typography>
          <TextField
            fullWidth
            label="Card Number"
            value={paymentData.cardNumber}
            onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
            margin="normal"
            placeholder="1234 5678 9012 3456"
          />
          <Box display="flex" gap={2}>
            <TextField
              label="Expiry Date"
              value={paymentData.expiryDate}
              onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
              placeholder="MM/YY"
              sx={{ flex: 1 }}
            />
            <TextField
              label="CVV"
              value={paymentData.cvv}
              onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
              placeholder="123"
              sx={{ flex: 1 }}
            />
          </Box>
          <TextField
            fullWidth
            label="Cardholder Name"
            value={paymentData.name}
            onChange={(e) => setPaymentData({ ...paymentData, name: e.target.value })}
            margin="normal"
            placeholder="John Doe"
          />
        </CardContent>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box display="flex" gap={2}>
        <Button
          variant="outlined"
          onClick={() => navigate('/buyer/orders')}
          disabled={paying}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handlePay}
          disabled={paying || !paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.name}
          sx={{ flex: 1 }}
        >
          {paying ? <CircularProgress size={20} /> : 'Pay Now'}
        </Button>
      </Box>
    </Box>
  );
};