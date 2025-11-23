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
    const decoded = jwt.verify(token, secret) as any;
    const userId = decoded.userId || decoded.id;
    req.user = { id: userId, email: decoded.email, role: decoded.role } as any;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Authentication failed' });
  }
};
