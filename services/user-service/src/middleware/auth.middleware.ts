import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'No token provided' });
      return;
    }
    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET || 'default-secret';
    const decoded = jwt.verify(token, jwtSecret) as { userId?: string; id?: string; email: string; role: string };
    // Accept either userId or id in the token payload for compatibility
    const userId = (decoded as any).userId || (decoded as any).id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Invalid token' });
      return;
    }
    req.user = { id: userId, email: decoded.email, role: decoded.role } as any;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Authentication failed' });
  }
};
