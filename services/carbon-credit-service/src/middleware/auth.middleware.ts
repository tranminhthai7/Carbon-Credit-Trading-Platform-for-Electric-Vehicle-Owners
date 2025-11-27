import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: { id?: string; email?: string; role?: string };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'No token provided' });
      return;
    }
    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET || 'default-secret';
    try {
      // Try to decode as JWT first (user token)
      const decoded = jwt.verify(token, secret) as any;
      const userId = decoded.userId || decoded.id;
      req.user = { id: userId, email: decoded.email, role: decoded.role } as any;
    } catch (jwtErr) {
      // If JWT verification fails, fall back to API secret key usage for service-to-service calls
      const apiKey = process.env.API_SECRET_KEY || '';
      if (token === apiKey) {
        // Treat as system/service account
        req.user = { id: 'system', email: 'system@internal', role: 'service' } as any;
      } else {
        res.status(401).json({ success: false, message: 'Authentication failed' });
        return;
      }
    }
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Authentication failed' });
  }
};
