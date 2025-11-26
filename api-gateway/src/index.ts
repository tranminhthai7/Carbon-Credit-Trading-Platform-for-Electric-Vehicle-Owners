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
const parseAllowedOrigins = (raw?: string): string[] => (raw || 'http://localhost:5173').split(',').map(s => s.trim()).filter(Boolean);
const allowedOrigins = parseAllowedOrigins(process.env.CORS_ORIGIN);

app.use(cors({
  origin: (origin, callback) => {
    // If no origin (e.g., server-to-server requests, CLI calls), allow it
    if (!origin) return callback(null, true);
    // Allow wildcard
    if (allowedOrigins.includes('*')) return callback(null, true);
    // Allow if origin is in configured list
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn(`Blocked CORS origin: ${origin}. Allowed: ${allowedOrigins.join(', ')}`);
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true
}));
// NOTE: DO NOT use express.json() - proxy needs to forward raw body stream

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
interface ProxyOptionsExt extends Options {
  stripServicePath?: boolean; // if false, only strip '/api' and preserve servicePath for forwarding
  preserveOriginalPath?: boolean; // if true, do not rewrite the original request path
}

const createProxyOptions = (target: string, servicePath: string, opts?: { stripServicePath?: boolean, preserveOriginalPath?: boolean }): ProxyOptionsExt => {
  const isStripServicePath = opts?.stripServicePath !== undefined ? opts!.stripServicePath : true;
  const debugLog = (...args: any[]) => {
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROXY === 'true') {
      // Use console.debug to keep standard console.log for general logs intact
      console.debug(...args);
    }
  };
  debugLog(`[PROXY OPTIONS] target=${target}, servicePath=${servicePath}, stripServicePath=${isStripServicePath}`);
  return ({
  // Debug: report if stripServicePath is set
  target,
  changeOrigin: true,
  timeout: 120000, // 120 seconds timeout
  proxyTimeout: 120000,
  ws: true, // WebSocket support
  logLevel: 'debug', // Debug logging
  pathRewrite: (path) => {
    if (opts?.preserveOriginalPath) {
      debugLog(`[PROXY] Preserving original path: ${path}`);
      return path; // forward original path to upstream without rewrite
    }

    const rewritten = isStripServicePath
      ? path.replace(new RegExp(`^/api${servicePath}`), '')
      : path.replace(new RegExp(`^/api`), '');
    debugLog(`[PROXY] Rewriting: ${path} -> ${rewritten} (stripServicePath=${isStripServicePath})`);
    return rewritten;
  },
  onProxyReq: (proxyReq, req, res) => {
    debugLog(`\n=== PROXY REQUEST ===`);
    debugLog(`Original: ${req.method} ${req.url}`);
    debugLog(`Target: ${proxyReq.method} ${proxyReq.path}`);
    debugLog(`Headers:`, proxyReq.getHeaders());
    debugLog(`Content-Type: ${req.headers['content-type']}`);
    debugLog(`Content-Length: ${req.headers['content-length']}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    debugLog(`\n=== PROXY RESPONSE ===`);
    debugLog(`Status: ${proxyRes.statusCode}`);
    debugLog(`Time: ${Date.now()}ms`);
    // Remove any upstream CORS headers so the API gateway's own CORS middleware
    // controls the Access-Control-* headers returned to the browser. This avoids
    // cases where upstream services set a wildcard '*' and break credentialed requests.
    try {
      if (proxyRes.headers) {
        // For diagnostics: log if upstream set any cookies (refresh token)
        if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROXY === 'true') {
          debugLog('Proxy response headers (sample):', {
            'set-cookie': proxyRes.headers['set-cookie']?.slice?.(0, 5) || proxyRes.headers['set-cookie'],
          });
        }

        // Remove any upstream CORS headers so the API gateway's own CORS middleware
        // controls the Access-Control-* headers returned to the browser. This avoids
        // cases where upstream services set a wildcard '*' and break credentialed requests.
        delete proxyRes.headers['access-control-allow-origin'];
        delete proxyRes.headers['access-control-allow-credentials'];
      }
    } catch (e) {
      debugLog('Error cleaning proxy response headers', e);
    }
  },
  onError: (err, req, res) => {
    console.error(`Proxy error for ${target}:`, err.message);
    const response = res as express.Response;
    response.status(502).json({
      success: false,
      message: 'Service temporarily unavailable',
      error: err.message
    });
  }
  });
}

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
app.use('/api/users', createProxyMiddleware(createProxyOptions(services.user, '/users')));
app.use('/api/auth', createProxyMiddleware(createProxyOptions(services.user, '/auth')));

// Route: Admin User Management (get all users) - updated
app.use('/api/admin/users', createProxyMiddleware(createProxyOptions(services.reporting, '/admin', { stripServicePath: false })));

// Route: Admin Transactions (get all transactions)
app.use('/api/admin/transactions', createProxyMiddleware(createProxyOptions(services.reporting, '/admin', { stripServicePath: false })));

// Route: Analytics (revenue, users, carbon stats)
app.use('/api/analytics', createProxyMiddleware(createProxyOptions(services.reporting, '/analytics', { stripServicePath: false })));

// Route: System Settings
app.use('/api/settings', createProxyMiddleware(createProxyOptions(services.reporting, '/settings', { stripServicePath: false })));

// Route: EV Data Service (Vehicles, Trips, CO2 Calculation)
app.use('/api/vehicles', createProxyMiddleware(createProxyOptions(services.evData, '/vehicles', { preserveOriginalPath: true })));
app.use('/api/trips', createProxyMiddleware(createProxyOptions(services.evData, '/trips', { preserveOriginalPath: true })));
app.use('/api/co2', createProxyMiddleware(createProxyOptions(services.evData, '/co2', { preserveOriginalPath: true })));

// Route: Carbon Credit Service (Wallet, Credits)
// For carbon credit service, preserve the '/wallet' and '/credits' service path when proxied
app.use('/api/wallet', createProxyMiddleware(createProxyOptions(services.carbonCredit, '/wallet', { stripServicePath: false })));
app.use('/api/credits', createProxyMiddleware(createProxyOptions(services.carbonCredit, '/credits', { stripServicePath: false })));

// Route: Marketplace Service (Listings, Orders, Auctions)
// For marketplace service, preserve '/listings' and '/orders' paths
app.use('/api/listings', createProxyMiddleware(createProxyOptions(services.marketplace, '/listings', { stripServicePath: false })));
app.use('/api/orders', createProxyMiddleware(createProxyOptions(services.marketplace, '/orders', { stripServicePath: false })));

// Route: Payment Service
app.use('/api/payments', createProxyMiddleware(createProxyOptions(services.payment, '/payments')));
app.use('/api/transactions', createProxyMiddleware(createProxyOptions(services.payment, '/transactions')));

// Route: Verification Service (CVA, KYC, Certificates)
app.use('/api/verifications', createProxyMiddleware(createProxyOptions(services.verification, '/verifications', { preserveOriginalPath: true })));
app.use('/api/kyc', createProxyMiddleware(createProxyOptions(services.verification, '/kyc')));
app.use('/api/certificates', createProxyMiddleware(createProxyOptions(services.verification, '/certificates')));
app.use('/api/issuances', createProxyMiddleware(createProxyOptions(services.verification, '/issuances')));

// Route: Notification Service
app.use('/api/notifications', createProxyMiddleware(createProxyOptions(services.notification, '/notifications')));

// Route: Reporting Service (Analytics, Reports) - preserve '/reports' path so the service can mount '/reports'
app.use('/api/reports', createProxyMiddleware(createProxyOptions(services.reporting, '/reports', { stripServicePath: true })));
app.use('/api/admin', createProxyMiddleware(createProxyOptions(services.reporting, '/admin', { stripServicePath: false })));

// Route: AI Service (Price Prediction)
app.use('/api/ai', createProxyMiddleware(createProxyOptions(services.ai, '/ai')));

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
