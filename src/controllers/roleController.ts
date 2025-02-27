import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllRoles = async (_req: Request, res: Response) => {
  try {
    const roles = await prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
    return res.json(roles);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching roles', error });
  }
};

export const getRoleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    return res.json(role);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching role', error });
  }
};

export const createRole = async (req: Request, res: Response) => {
  try {
    const { name, description, permissionIds } = req.body;

    // Check if role already exists
    const existingRole = await prisma.role.findUnique({
      where: { name },
    });

    if (existingRole) {
      return res.status(400).json({ message: 'Role already exists with this name' });
    }

    // Create role
    const role = await prisma.role.create({
      data: {
        name,
        description,
        permissions: {
          create:
            permissionIds?.map((permissionId: string) => ({
              permission: { connect: { id: permissionId } },
            })) || [],
        },
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return res.status(201).json(role);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating role', error });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Check if role exists
    const existingRole = await prisma.role.findUnique({
      where: { id },
    });

    if (!existingRole) {
      return res.status(404).json({ message: 'Role not found' });
    }

    // Check if name is already taken by another role
    if (name && name !== existingRole.name) {
      const nameTaken = await prisma.role.findUnique({
        where: { name },
      });
      if (nameTaken) {
        return res.status(400).json({ message: 'Role name is already taken' });
      }
    }

    // Update role
    const updatedRole = await prisma.role.update({
      where: { id },
      data: {
        name: name || undefined,
        description: description || undefined,
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return res.json(updatedRole);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating role', error });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if role exists
    const existingRole = await prisma.role.findUnique({
      where: { id },
    });

    if (!existingRole) {
      return res.status(404).json({ message: 'Role not found' });
    }

    // Check if role is assigned to any users
    const usersWithRole = await prisma.user.count({
      where: { roleId: id },
    });

    if (usersWithRole > 0) {
      return res.status(400).json({
        message: 'Cannot delete role that is assigned to users',
        count: usersWithRole,
      });
    }

    // Delete role
    await prisma.role.delete({
      where: { id },
    });

    return res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting role', error });
  }
};

export const addPermissionsToRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { permissionIds } = req.body;

    // Check if role exists
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        permissions: true,
      },
    });

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    // Add permissions
    const updatedRole = await prisma.role.update({
      where: { id },
      data: {
        permissions: {
          create: permissionIds.map((permissionId: string) => ({
            permission: { connect: { id: permissionId } },
          })),
        },
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return res.json(updatedRole);
  } catch (error) {
    return res.status(500).json({ message: 'Error adding permissions to role', error });
  }
};

export const removePermissionFromRole = async (req: Request, res: Response) => {
  try {
    const { roleId, permissionId } = req.params;

    // Check if role exists
    const role = await prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    // Check if permission is assigned to the role
    const rolePermission = await prisma.rolePermission.findFirst({
      where: {
        roleId,
        permissionId,
      },
    });

    if (!rolePermission) {
      return res.status(404).json({ message: 'Permission not assigned to this role' });
    }

    // Remove permission from role
    await prisma.rolePermission.delete({
      where: { id: rolePermission.id },
    });

    return res.json({ message: 'Permission removed from role successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error removing permission from role', error });
  }
};
