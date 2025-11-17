"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const mq_consumer_1 = require("./workers/mq.consumer");
// Nạp biến môi trường từ file .env (nếu có)
dotenv_1.default.config();
// Tạo ứng dụng Express
const app = (0, express_1.default)();
// Middleware để Express hiểu JSON
app.use(express_1.default.json());
// Dùng route notification
app.use('/api/notifications', notification_routes_1.default);
// Cổng chạy server (mặc định 3007)
const PORT = process.env.PORT || 3007;
// Route test
app.get('/', (req, res) => {
    res.send('Notification Service is running 🚀');
});
// Bắt đầu chạy server
app.listen(PORT, () => {
    console.log(`✅ Notification Service is running on port ${PORT}`);
    // Start rabbitmq consumer
    (0, mq_consumer_1.startMQConsumer)().catch(err => console.error('Failed to start MQ consumer', err));
});
