"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./config/database");
const env_1 = require("./config/env");
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const app = (0, express_1.default)();
const PORT = env_1.envConfig.PORT;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/payments', payment_routes_1.default);
// Health check
app.get('/health', (_req, res) => {
    res.json({
        service: 'Payment Service',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});
// Error handling
app.use((err, _req, res) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});
app.use('*', (_req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});
const startServer = async () => {
    try {
        await (0, database_1.initializeDatabase)();
        app.listen(PORT, () => {
            console.log(`🚀 Payment Service running on port ${PORT}`);
            console.log(`� Heyalth check: http://localhost:${PORT}/health`);
            console.log(`� API: hhttp://localhost:${PORT}/api/payments`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
