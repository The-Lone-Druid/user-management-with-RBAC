# User Management System

A comprehensive user management system with role-based access control (RBAC) built with Node.js, TypeScript, Express, Prisma ORM, and MySQL.

## Features

- User authentication using Passport JWT
- Fine-grained role-based access control
- Permission-based authorization
- User management
- Role management
- Permission management
- API documentation with Swagger/OpenAPI

## Tech Stack

- Node.js & TypeScript
- Express.js
- Prisma ORM
- MySQL
- Passport.js for authentication
- JWT for token-based authentication
- Swagger UI for API documentation

## Prerequisites

- Node.js (v14 or above)
- MySQL database
- npm or yarn package manager

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd user-management-system
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your configuration:

   ```env
   # Environment variables
   NODE_ENV=development
   PORT=8081

   # Database
   DATABASE_URL="mysql://username:password@localhost:3306/user_management_db"

   # Authentication
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRES_IN=1d

   # Swagger Documentation (for production)
   SWAGGER_USER=admin
   SWAGGER_PASSWORD=secure_password_here
   ```

4. Generate Prisma client:

   ```bash
   npm run prisma:generate
   ```

5. Run database migrations:

   ```bash
   npm run prisma:migrate
   ```

6. Seed the database:

   ```bash
   npm run seed
   ```

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

## API Documentation

API documentation is available using Swagger UI at `/api-docs` endpoint.

- Development: [http://localhost:8081/api-docs](http://localhost:8081/api-docs)
- Production: Authentication required using SWAGGER_USER and SWAGGER_PASSWORD credentials

### API Endpoints

#### Authentication

- **Register User**: `POST /api/auth/register`
- **Login User**: `POST /api/auth/login`
- **Logout User**: `POST /api/auth/logout`

#### Users

- **Get All Users**: `GET /api/users`
- **Get User by ID**: `GET /api/users/:id`
- **Create User**: `POST /api/users`
- **Update User**: `PUT /api/users/:id`
- **Delete User**: `DELETE /api/users/:id`
- **Change Password**: `POST /api/users/:id/change-password`

#### Roles

- **Get All Roles**: `GET /api/roles`
- **Get Role by ID**: `GET /api/roles/:id`
- **Create Role**: `POST /api/roles`
- **Update Role**: `PUT /api/roles/:id`
- **Delete Role**: `DELETE /api/roles/:id`
- **Add Permissions to Role**: `POST /api/roles/:id/permissions`
- **Remove Permission from Role**: `DELETE /api/roles/:roleId/permissions/:permissionId`

#### Permissions

- **Get All Permissions**: `GET /api/permissions`
- **Get Permission by ID**: `GET /api/permissions/:id`
- **Get Permissions by Resource**: `GET /api/permissions/resource/:resource`
- **Create Permission**: `POST /api/permissions`
- **Update Permission**: `PUT /api/permissions/:id`
- **Delete Permission**: `DELETE /api/permissions/:id`

## Default Credentials

After seeding the database, you can login with:

- Email: `admin@example.com`
- Password: `Admin@123`

## License

This project is licensed under the MIT License.
