import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import vehicleRoutes from './routes/vehicle.routes';
import tripRoutes from './routes/trip.routes';

export function createApp(): Application {
  const app: Application = express();

  app.use(helmet());

  const parseAllowedOrigins = (raw?: string): string[] => (raw || 'http://localhost:5173').split(',').map(s => s.trim()).filter(Boolean);
  const allowedOrigins = parseAllowedOrigins(process.env.CORS_ORIGIN);
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes('*')) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.warn(`Blocked CORS origin: ${origin}. Allowed: ${allowedOrigins.join(', ')}`);
      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
  }));

  // Parse JSON and URL-encoded bodies
  app.use(express.json()); // Parse JSON bodies
  app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

  // Improve developer experience: catch JSON parse errors early and return
  // a structured JSON error response instead of HTML (helps frontend debug)
  app.use((err: any, _req: any, res: any, next: any) => {
    if (err && err instanceof SyntaxError && (err as any).status === 400 && 'body' in err) {
      console.warn('Invalid JSON payload received');
      return res.status(400).json({ success: false, message: 'Invalid JSON payload', error: err.message });
    }
    return next(err);
  });

  // Health check
  app.get('/health', (_req, res) => res.json({ success: true }));

  // API routes
  app.use('/api/vehicles', vehicleRoutes);
  app.use('/api/vehicles', tripRoutes);

  // 404
  app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });

  return app;
}

// Export the factory function (not the app instance) so tests can create multiple instances
// Provide a default app instance for tests and tools that import `app` directly.
// Also keep the factory available for production/servers that want to create multiple instances.
const defaultApp = createApp();
export default defaultApp;
