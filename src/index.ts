import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';

import { configurePassport } from './config/passport';
import { specs } from './config/swagger';
import { errorHandler } from './middlewares/errorHandler';
import { swaggerAuth } from './middlewares/swaggerAuth';
import authRoutes from './routes/authRoutes';
import permissionRoutes from './routes/permissionRoutes';
import roleRoutes from './routes/roleRoutes';
import userRoutes from './routes/userRoutes';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Configure middleware
app.use(
  helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
  })
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
app.use(passport.initialize());
configurePassport(passport);

// API Documentation with optional authentication in production
app.use(
  '/api-docs',
  swaggerAuth,
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: false,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      filterString: '',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'User Management System API',
  })
);

app.use('/swagger/openapi.json', swaggerAuth, (_req, res) => {
  res.json(specs);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);

// Base route
app.get('/', (_req, res) => {
  res.send('User Management System API - Visit <a href="/api-docs">API Documentation</a>');
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
  if (process.env.NODE_ENV === 'production') {
    console.log('Swagger UI is protected with basic authentication in production mode');
  }
});
