import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { connectDatabase } from './config/database';
import vehicleRoutes from './routes/vehicle.routes';
import tripRoutes from './routes/trip.routes';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(helmet()); // Security headers
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
  credentials: true,
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EV Data Service is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/vehicles', tripRoutes); // Trip routes (Issue #6)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 EV Data Service running on port ${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/health`);
      console.log(`🚗 Vehicles API: http://localhost:${PORT}/api/vehicles`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
