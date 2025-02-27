import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllPermissions = async (_req: Request, res: Response) => {
  try {
    const permissions = await prisma.permission.findMany();
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching permissions', error });
  }
};

export const getPermissionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const permission = await prisma.permission.findUnique({
      where: { id },
    });

    if (!permission) {
      return res.status(404).json({ message: 'Permission not found' });
    }

    return res.json(permission);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching permission', error });
  }
};

export const createPermission = async (req: Request, res: Response) => {
  try {
    const { name, description, resource, action } = req.body;

    // Check if permission already exists
    const existingPermission = await prisma.permission.findUnique({
      where: { name },
    });

    if (existingPermission) {
      return res.status(400).json({ message: 'Permission already exists with this name' });
    }

    // Validate action
    const validActions = ['create', 'read', 'update', 'delete'];
    if (!validActions.includes(action)) {
      return res.status(400).json({
        message: 'Invalid action. Must be one of: create, read, update, delete',
      });
    }

    // Create permission
    const permission = await prisma.permission.create({
      data: {
        name,
        description,
        resource,
        action,
      },
    });

    return res.status(201).json(permission);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating permission', error });
  }
};

export const updatePermission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, resource, action } = req.body;

    // Check if permission exists
    const existingPermission = await prisma.permission.findUnique({
      where: { id },
    });

    if (!existingPermission) {
      return res.status(404).json({ message: 'Permission not found' });
    }

    // Check if name is already taken by another permission
    if (name && name !== existingPermission.name) {
      const nameTaken = await prisma.permission.findUnique({
        where: { name },
      });
      if (nameTaken) {
        return res.status(400).json({ message: 'Permission name is already taken' });
      }
    }

    // Validate action if provided
    if (action) {
      const validActions = ['create', 'read', 'update', 'delete'];
      if (!validActions.includes(action)) {
        return res.status(400).json({
          message: 'Invalid action. Must be one of: create, read, update, delete',
        });
      }
    }

    // Update permission
    const updatedPermission = await prisma.permission.update({
      where: { id },
      data: {
        name: name || undefined,
        description: description || undefined,
        resource: resource || undefined,
        action: action || undefined,
      },
    });

    return res.json(updatedPermission);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating permission', error });
  }
};

export const deletePermission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if permission exists
    const existingPermission = await prisma.permission.findUnique({
      where: { id },
    });

    if (!existingPermission) {
      return res.status(404).json({ message: 'Permission not found' });
    }

    // Check if permission is assigned to any roles
    const rolePermissionsCount = await prisma.rolePermission.count({
      where: { permissionId: id },
    });

    if (rolePermissionsCount > 0) {
      return res.status(400).json({
        message: 'Cannot delete permission that is assigned to roles',
        count: rolePermissionsCount,
      });
    }

    // Delete permission
    await prisma.permission.delete({
      where: { id },
    });

    return res.json({ message: 'Permission deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting permission', error });
  }
};

export const getPermissionsByResource = async (req: Request, res: Response) => {
  try {
    const { resource } = req.params;

    const permissions = await prisma.permission.findMany({
      where: { resource },
    });

    res.json(permissions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching permissions by resource', error });
  }
};
