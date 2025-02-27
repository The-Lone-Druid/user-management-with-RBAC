import express from 'express';
import { body, param } from 'express-validator';
import { 
  getAllRoles, 
  getRoleById, 
  createRole, 
  updateRole, 
  deleteRole, 
  addPermissionsToRole, 
  removePermissionFromRole 
} from '../controllers/roleController';
import { validateRequest } from '../middlewares/validateRequest';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';

const router = express.Router();

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get(
  '/',
  authenticate,
  authorize('read', 'roles'),
  getAllRoles
);

/**
 * @swagger
 * /roles/{id}:
 *   get:
 *     summary: Get role by ID
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Role ID
 *     responses:
 *       200:
 *         description: Role details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id',
  authenticate,
  authorize('read', 'roles'),
  param('id').isUUID().withMessage('Role ID must be a valid UUID'),
  validateRequest,
  getRoleById
);

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *     responses:
 *       201:
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       400:
 *         description: Invalid input or role already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  authenticate,
  authorize('create', 'roles'),
  [
    body('name').trim().notEmpty().withMessage('Role name is required'),
    body('description').optional().trim(),
    body('permissionIds').optional().isArray().withMessage('Permission IDs must be an array'),
    body('permissionIds.*').optional().isUUID().withMessage('Permission IDs must be valid UUIDs'),
  ],
  validateRequest,
  createRole
);

/**
 * @swagger
 * /roles/{id}:
 *   put:
 *     summary: Update a role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Role ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:id',
  authenticate,
  authorize('update', 'roles'),
  param('id').isUUID().withMessage('Role ID must be a valid UUID'),
  [
    body('name').optional().trim().notEmpty().withMessage('Role name cannot be empty'),
    body('description').optional().trim(),
  ],
  validateRequest,
  updateRole
);

/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     summary: Delete a role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Role ID
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *       400:
 *         description: Role is assigned to users and cannot be deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role not found
 *       500:
 *         description: Server error
 */
router.delete(
  '/:id',
  authenticate,
  authorize('delete', 'roles'),
  param('id').isUUID().withMessage('Role ID must be a valid UUID'),
  validateRequest,
  deleteRole
);

/**
 * @swagger
 * /roles/{id}/permissions:
 *   post:
 *     summary: Add permissions to a role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Role ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permissionIds
 *             properties:
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *     responses:
 *       200:
 *         description: Permissions added to role successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role not found
 *       500:
 *         description: Server error
 */
router.post(
  '/:id/permissions',
  authenticate,
  authorize('update', 'roles'),
  param('id').isUUID().withMessage('Role ID must be a valid UUID'),
  [
    body('permissionIds').isArray().withMessage('Permission IDs must be an array'),
    body('permissionIds.*').isUUID().withMessage('Permission IDs must be valid UUIDs'),
  ],
  validateRequest,
  addPermissionsToRole
);

/**
 * @swagger
 * /roles/{roleId}/permissions/{permissionId}:
 *   delete:
 *     summary: Remove a permission from a role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Role ID
 *       - in: path
 *         name: permissionId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Permission ID
 *     responses:
 *       200:
 *         description: Permission removed from role successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role or permission not found
 *       500:
 *         description: Server error
 */
router.delete(
  '/:roleId/permissions/:permissionId',
  authenticate,
  authorize('update', 'roles'),
  param('roleId').isUUID().withMessage('Role ID must be a valid UUID'),
  param('permissionId').isUUID().withMessage('Permission ID must be a valid UUID'),
  validateRequest,
  removePermissionFromRole
);

export default router;
