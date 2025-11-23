import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { createApp } from './app';

// Load environment variables
dotenv.config();

const app = createApp();
const PORT = process.env.PORT || 3002;

const startServer = async () => {
  try {
    await connectDatabase();
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
