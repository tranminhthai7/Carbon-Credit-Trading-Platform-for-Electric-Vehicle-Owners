import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import reportRoutes from "./routes/report.routes";

dotenv.config();

const app = express();
// CORS: allow multiple origins via comma-separated env var
const parseAllowedOrigins = (raw?: string): string[] => (raw || 'http://localhost:5173').split(',').map(s => s.trim()).filter(Boolean);
const allowedOrigins = parseAllowedOrigins(process.env.CORS_ORIGIN);
app.use(express.json());
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

// Routes
// Mount reporting routes under '/reports' (API Gateway will forward '/api/reports/*' -> '/reports/*')
// Mount both '/reports' and root '/' to support different gateway rewrite strategies
app.use('/reports', reportRoutes);
app.use('/', reportRoutes);

// MongoDB connect
mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://localhost:27017/reporting-service")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 3008;
app.listen(PORT, () => {
  console.log(`✅ Reporting Service is running on port ${PORT}`);
});
