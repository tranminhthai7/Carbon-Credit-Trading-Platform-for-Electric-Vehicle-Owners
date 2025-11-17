"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDatabase = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ev_data_db';
        await mongoose_1.default.connect(mongoUri);
        console.log('✅ MongoDB connected successfully');
        console.log(`📦 Database: ${mongoose_1.default.connection.db?.databaseName || 'ev_data_db'}`);
    }
    catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        process.exit(1);
    }
};
exports.connectDatabase = connectDatabase;
// Handle connection events
mongoose_1.default.connection.on('error', (error) => {
    console.error('MongoDB error:', error);
});
mongoose_1.default.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});
// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose_1.default.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
});
