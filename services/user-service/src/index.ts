import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/error.middleware';
// import { connectDatabase } from './config/database';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration: only allow origins specified by env CORS_ORIGIN (comma-separated)
const parseAllowedOrigins = (raw?: string): string[] => (raw || 'http://localhost:5173').split(',').map(s => s.trim()).filter(Boolean);
const allowedOrigins = parseAllowedOrigins(process.env.CORS_ORIGIN);

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server, CLI, curl requests without an Origin
    if (!origin) return callback(null, true);
    // If wildcard '*' configured, allow but return specific origin (see note)
    if (allowedOrigins.includes('*')) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn(`Blocked CORS origin: ${origin}. Allowed: ${allowedOrigins.join(', ')}`);
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// cookie parser for refresh token cookies
app.use(cookieParser());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'user-service'
  });
});

// Routes - mount at root since API Gateway already handled /api/users prefix
app.use('/', authRoutes);

// Error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Skip database connection for now
    // await connectDatabase();
    
    app.listen(PORT, () => {
      console.log(`✅ User Service running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
