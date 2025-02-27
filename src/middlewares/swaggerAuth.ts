import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

export const swaggerAuth = (req: Request, res: Response, next: NextFunction) => {
  // Only apply authentication to Swagger UI in production
  if (process.env.NODE_ENV === 'production') {
    const auth = {
      username: process.env.SWAGGER_USER || 'admin',
      password: process.env.SWAGGER_PASSWORD || 'admin',
    };
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [username, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    if (!username || !password || username !== auth.username || password !== auth.password) {
      res.set('WWW-Authenticate', 'Basic realm="Swagger Documentation"');
      res.status(401).send('Authentication required for API documentation');
    }
  }

  next();
};
