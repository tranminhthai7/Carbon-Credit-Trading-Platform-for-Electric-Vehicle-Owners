import 'reflect-metadata';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { initializeDatabase } from './config/database';
import { envConfig } from './config/env';
import paymentRoutes from './routes/payment.routes';

const app = express();
const PORT = envConfig.PORT;

// Middleware
const parseAllowedOrigins = (raw?: string): string[] => (raw || 'http://localhost:5173').split(',').map(s => s.trim()).filter(Boolean);
const allowedOrigins = parseAllowedOrigins(process.env.CORS_ORIGIN);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes('*')) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn(`Blocked CORS origin: ${origin}. Allowed: ${allowedOrigins.join(', ')}`);
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    service: 'Payment Service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Error handling
app.use((err: Error, _req: Request, res: Response) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

app.use('*', (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const startServer = async (): Promise<void> => {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Payment Service running on port ${PORT}`);
      console.log(`� Heyalth check: http://localhost:${PORT}/health`);
      console.log(`� API: hhttp://localhost:${PORT}/api/payments`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();