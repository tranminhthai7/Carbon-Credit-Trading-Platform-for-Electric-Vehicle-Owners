import { Request, Response, NextFunction } from 'express';

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = (req as any).user?.role;
    if (!role) {
      return res.status(401).json({ success: false, message: 'No role found' });
    }
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    next();
  };
};
