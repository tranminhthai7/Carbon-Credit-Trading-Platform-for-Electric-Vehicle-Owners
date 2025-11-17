"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const database_1 = require("./config/database");
const vehicle_routes_1 = __importDefault(require("./routes/vehicle.routes"));
const trip_routes_1 = __importDefault(require("./routes/trip.routes"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3002;
// Middleware
app.use((0, helmet_1.default)()); // Security headers
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
}));
app.use(express_1.default.json()); // Parse JSON bodies
app.use(express_1.default.urlencoded({ extended: true })); // Parse URL-encoded bodies
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'EV Data Service is running',
        timestamp: new Date().toISOString(),
    });
});
// API Routes
app.use('/api/vehicles', vehicle_routes_1.default);
app.use('/api/vehicles', trip_routes_1.default); // Trip routes (Issue #6)
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
        await (0, database_1.connectDatabase)();
        // Start listening
        app.listen(PORT, () => {
            console.log(`🚀 EV Data Service running on port ${PORT}`);
            console.log(`📡 Health check: http://localhost:${PORT}/health`);
            console.log(`🚗 Vehicles API: http://localhost:${PORT}/api/vehicles`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
