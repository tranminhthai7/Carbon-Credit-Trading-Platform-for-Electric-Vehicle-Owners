import express, { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logging
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Service URLs from environment
const services = {
  user: process.env.USER_SERVICE_URL || 'http://localhost:3001',
  evData: process.env.EV_DATA_SERVICE_URL || 'http://localhost:3002',
  carbonCredit: process.env.CARBON_CREDIT_SERVICE_URL || 'http://localhost:3003',
  marketplace: process.env.MARKETPLACE_SERVICE_URL || 'http://localhost:3004',
  payment: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3005',
  verification: process.env.VERIFICATION_SERVICE_URL || 'http://localhost:3006',
  notification: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3007',
  reporting: process.env.REPORTING_SERVICE_URL || 'http://localhost:3008',
  ai: process.env.AI_SERVICE_URL || 'http://localhost:3009',
};

// Proxy options factory
const createProxyOptions = (target: string): Options => ({
  target,
  changeOrigin: true,
  pathRewrite: (path) => {
    // Remove /api prefix if exists
    return path.replace(/^\/api/, '');
  },
  onError: (err, req, res) => {
    console.error(`Proxy error for ${target}:`, err.message);
    const response = res as express.Response;
    response.status(502).json({
      success: false,
      message: 'Service temporarily unavailable',
      error: err.message
    });
  },
  onProxyReq: (proxyReq, req) => {
    // Log proxy requests
    console.log(`[PROXY] ${req.method} ${req.url} -> ${target}${req.url}`);
  }
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API Gateway is running',
    timestamp: new Date().toISOString(),
    services: {
      user: services.user,
      evData: services.evData,
      carbonCredit: services.carbonCredit,
      marketplace: services.marketplace,
      payment: services.payment,
      verification: services.verification,
      notification: services.notification,
      reporting: services.reporting,
      ai: services.ai
    }
  });
});

// Route: User Service (Authentication, User Management)
app.use('/api/users', createProxyMiddleware(createProxyOptions(services.user)));
app.use('/api/auth', createProxyMiddleware(createProxyOptions(services.user)));

// Route: EV Data Service (Vehicles, Trips, CO2 Calculation)
app.use('/api/vehicles', createProxyMiddleware(createProxyOptions(services.evData)));
app.use('/api/trips', createProxyMiddleware(createProxyOptions(services.evData)));
app.use('/api/co2', createProxyMiddleware(createProxyOptions(services.evData)));

// Route: Carbon Credit Service (Wallet, Credits)
app.use('/api/wallet', createProxyMiddleware(createProxyOptions(services.carbonCredit)));
app.use('/api/credits', createProxyMiddleware(createProxyOptions(services.carbonCredit)));

// Route: Marketplace Service (Listings, Orders, Auctions)
app.use('/api/listings', createProxyMiddleware(createProxyOptions(services.marketplace)));
app.use('/api/orders', createProxyMiddleware(createProxyOptions(services.marketplace)));

// Route: Payment Service
app.use('/api/payments', createProxyMiddleware(createProxyOptions(services.payment)));
app.use('/api/transactions', createProxyMiddleware(createProxyOptions(services.payment)));

// Route: Verification Service (CVA, KYC, Certificates)
app.use('/api/verification', createProxyMiddleware(createProxyOptions(services.verification)));
app.use('/api/kyc', createProxyMiddleware(createProxyOptions(services.verification)));
app.use('/api/certificates', createProxyMiddleware(createProxyOptions(services.verification)));
app.use('/api/issuances', createProxyMiddleware(createProxyOptions(services.verification)));

// Route: Notification Service
app.use('/api/notifications', createProxyMiddleware(createProxyOptions(services.notification)));

// Route: Reporting Service (Analytics, Reports)
app.use('/api/reports', createProxyMiddleware(createProxyOptions(services.reporting)));
app.use('/api/analytics', createProxyMiddleware(createProxyOptions(services.reporting)));

// Route: AI Service (Price Prediction)
app.use('/api/ai', createProxyMiddleware(createProxyOptions(services.ai)));

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.url
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║         🚀 API Gateway Running on Port ${PORT}              ║
╠════════════════════════════════════════════════════════════╣
║  Environment: ${process.env.NODE_ENV || 'development'}                              ║
║  CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}          ║
╠════════════════════════════════════════════════════════════╣
║  📡 Microservices:                                         ║
║    • User Service:         ${services.user.padEnd(25)} ║
║    • EV Data Service:      ${services.evData.padEnd(25)} ║
║    • Carbon Credit Service: ${services.carbonCredit.padEnd(24)} ║
║    • Marketplace Service:  ${services.marketplace.padEnd(25)} ║
║    • Payment Service:      ${services.payment.padEnd(25)} ║
║    • Verification Service: ${services.verification.padEnd(25)} ║
║    • Notification Service: ${services.notification.padEnd(25)} ║
║    • Reporting Service:    ${services.reporting.padEnd(25)} ║
║    • AI Service:           ${services.ai.padEnd(25)} ║
╚════════════════════════════════════════════════════════════╝
  `);
});

export default app;
