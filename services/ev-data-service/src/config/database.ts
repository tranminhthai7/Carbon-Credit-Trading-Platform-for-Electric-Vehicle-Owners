import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ev_data_db';

  // Retry loop parameters (can be tuned using env vars)
  const maxAttempts = Number(process.env.MONGO_CONNECT_RETRY_ATTEMPTS || 15);
  const delayMs = Number(process.env.MONGO_CONNECT_RETRY_DELAY_MS || 2000);

  let attempt = 0;
  while (attempt < maxAttempts) {
    try {
      attempt++;
      console.log(`🔌 MongoDB connect attempt ${attempt}/${maxAttempts} to ${mongoUri}`);
      await mongoose.connect(mongoUri);
      console.log('✅ MongoDB connected successfully');
      console.log(`📦 Database: ${mongoose.connection.db?.databaseName || 'ev_data_db'}`);
      return;
    } catch (error: any) {
      console.error(`❌ MongoDB connection failed (attempt ${attempt}):`, error.message || error);
      if (attempt >= maxAttempts) {
        console.error('❌ Reached max MongoDB retries. Giving up.');
        // Exit non-zero keeps old behavior; comment out if you'd prefer to keep the service alive
        process.exit(1);
      }
      // Wait before next attempt
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
};

// Handle connection events
mongoose.connection.on('error', (error) => {
  console.error('MongoDB error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});
