import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.rolePermission.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  console.log('Existing data cleared');

  // Create basic permissions
  const permissions = await Promise.all([
    // User permissions
    prisma.permission.create({
      data: {
        name: 'user:create',
        description: 'Create users',
        resource: 'users',
        action: 'create',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'user:read',
        description: 'Read users',
        resource: 'users',
        action: 'read',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'user:update',
        description: 'Update users',
        resource: 'users',
        action: 'update',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'user:delete',
        description: 'Delete users',
        resource: 'users',
        action: 'delete',
      },
    }),

    // Role permissions
    prisma.permission.create({
      data: {
        name: 'role:create',
        description: 'Create roles',
        resource: 'roles',
        action: 'create',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'role:read',
        description: 'Read roles',
        resource: 'roles',
        action: 'read',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'role:update',
        description: 'Update roles',
        resource: 'roles',
        action: 'update',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'role:delete',
        description: 'Delete roles',
        resource: 'roles',
        action: 'delete',
      },
    }),

    // Permission permissions
    prisma.permission.create({
      data: {
        name: 'permission:create',
        description: 'Create permissions',
        resource: 'permissions',
        action: 'create',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'permission:read',
        description: 'Read permissions',
        resource: 'permissions',
        action: 'read',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'permission:update',
        description: 'Update permissions',
        resource: 'permissions',
        action: 'update',
      },
    }),
    prisma.permission.create({
      data: {
        name: 'permission:delete',
        description: 'Delete permissions',
        resource: 'permissions',
        action: 'delete',
      },
    }),
  ]);

  console.log('Basic permissions created');

  // Create roles
  const adminRole = await prisma.role.create({
    data: {
      name: 'Admin',
      description: 'System administrator with full access',
    },
  });

  const userRole = await prisma.role.create({
    data: {
      name: 'User',
      description: 'Regular user with limited access',
    },
  });

  console.log('Basic roles created');

  // Assign all permissions to admin role
  await Promise.all(
    permissions.map((permission) =>
      prisma.rolePermission.create({
        data: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      })
    )
  );

  // Assign only read permissions to user role
  await Promise.all(
    permissions
      .filter((p) => p.action === 'read')
      .map((permission) =>
        prisma.rolePermission.create({
          data: {
            roleId: userRole.id,
            permissionId: permission.id,
          },
        })
      )
  );

  console.log('Permissions assigned to roles');

  // Create admin user
  const passwordHash = await bcrypt.hash('Admin@123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      roleId: adminRole.id,
    },
  });

  console.log('Admin user created');

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
