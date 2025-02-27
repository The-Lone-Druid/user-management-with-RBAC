import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: Error, user: any, info: any) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({
        message: info ? info.message : 'Authentication required',
      });
    }

    // Attach user to request object
    req.user = user;
    return next();
  })(req, res, next);
};
