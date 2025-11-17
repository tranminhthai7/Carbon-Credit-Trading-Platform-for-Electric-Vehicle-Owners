import "dotenv/config";
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import notificationRoutes from './routes/notification.routes';
import emailRoutes from "./routes/email.routes";
import { startMQConsumer } from './workers/mq.consumer';

// Nạp biến môi trường từ file .env (nếu có)
dotenv.config();

// Tạo ứng dụng Express
const app = express();

// Middleware để Express hiểu JSON
app.use(express.json());

// Dùng route notification
app.use('/api/notifications', notificationRoutes);

// Cổng chạy server (mặc định 3007)
const PORT = process.env.PORT || 3007;

// Route test
app.get('/', (req: Request, res: Response) => {
  res.send('Notification Service is running 🚀');
});

// Bắt đầu chạy server
app.listen(PORT, () => {
  console.log(`✅ Notification Service is running on port ${PORT}`);
  // Start rabbitmq consumer
  startMQConsumer().catch(err => console.error('Failed to start MQ consumer', err));
});
