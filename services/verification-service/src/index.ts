import 'reflect-metadata';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { initializeDatabase } from './config/database';
import { envConfig } from './config/env';
import verificationRoutes from './routes/verification.routes';

const app = express();
const PORT = envConfig.PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/verification', verificationRoutes);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    service: 'Verification Service',
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
      console.log(`🚀 Verification Service running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔍 API: http://localhost:${PORT}/api/verification`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();