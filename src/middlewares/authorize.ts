import { Request, Response, NextFunction } from 'express';

export const authorize = (action: string, resource: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if user exists on the request
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const user = req.user as any;

      // Check if user has role with permissions
      if (!user.role || !user.role.permissions) {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }

      // Check if user has the required permission
      const hasPermission = user.role.permissions.some(
        (rp: any) =>
          rp.permission &&
          rp.permission.action === action &&
          rp.permission.resource === resource
      );

      if (!hasPermission) {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: 'Authorization error', error });
    }
    
    return; // Explicitly return undefined to satisfy TypeScript
  };
};
