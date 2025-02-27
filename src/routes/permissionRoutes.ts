import express from 'express';
import { body, param } from 'express-validator';
import {
  getAllPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
  getPermissionsByResource,
} from '../controllers/permissionController';
import { validateRequest } from '../middlewares/validateRequest';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';

const router = express.Router();

/**
 * @swagger
 * /permissions:
 *   get:
 *     summary: Get all permissions
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Permission'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get('/', authenticate, authorize('read', 'permissions'), getAllPermissions);

/**
 * @swagger
 * /permissions/resource/{resource}:
 *   get:
 *     summary: Get permissions by resource
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resource
 *         schema:
 *           type: string
 *         required: true
 *         description: Resource name (e.g., users, roles, permissions)
 *     responses:
 *       200:
 *         description: List of permissions for the specified resource
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Permission'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get(
  '/resource/:resource',
  authenticate,
  authorize('read', 'permissions'),
  param('resource').trim().notEmpty().withMessage('Resource is required'),
  validateRequest,
  getPermissionsByResource
);

/**
 * @swagger
 * /permissions/{id}:
 *   get:
 *     summary: Get permission by ID
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Permission ID
 *     responses:
 *       200:
 *         description: Permission details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id',
  authenticate,
  authorize('read', 'permissions'),
  param('id').isUUID().withMessage('Permission ID must be a valid UUID'),
  validateRequest,
  getPermissionById
);

/**
 * @swagger
 * /permissions:
 *   post:
 *     summary: Create a new permission
 *     tags: [Permissions]
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
 *               - resource
 *               - action
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               resource:
 *                 type: string
 *               action:
 *                 type: string
 *                 enum: [create, read, update, delete]
 *     responses:
 *       201:
 *         description: Permission created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *       400:
 *         description: Invalid input or permission already exists
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
  authorize('create', 'permissions'),
  [
    body('name').trim().notEmpty().withMessage('Permission name is required'),
    body('description').optional().trim(),
    body('resource').trim().notEmpty().withMessage('Resource is required'),
    body('action')
      .trim()
      .notEmpty()
      .withMessage('Action is required')
      .isIn(['create', 'read', 'update', 'delete'])
      .withMessage('Action must be one of: create, read, update, delete'),
  ],
  validateRequest,
  createPermission
);

/**
 * @swagger
 * /permissions/{id}:
 *   put:
 *     summary: Update a permission
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Permission ID
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
 *               resource:
 *                 type: string
 *               action:
 *                 type: string
 *                 enum: [create, read, update, delete]
 *     responses:
 *       200:
 *         description: Permission updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:id',
  authenticate,
  authorize('update', 'permissions'),
  param('id').isUUID().withMessage('Permission ID must be a valid UUID'),
  [
    body('name').optional().trim().notEmpty().withMessage('Permission name cannot be empty'),
    body('description').optional().trim(),
    body('resource').optional().trim().notEmpty().withMessage('Resource cannot be empty'),
    body('action')
      .optional()
      .trim()
      .isIn(['create', 'read', 'update', 'delete'])
      .withMessage('Action must be one of: create, read, update, delete'),
  ],
  validateRequest,
  updatePermission
);

/**
 * @swagger
 * /permissions/{id}:
 *   delete:
 *     summary: Delete a permission
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Permission ID
 *     responses:
 *       200:
 *         description: Permission deleted successfully
 *       400:
 *         description: Permission is assigned to roles and cannot be deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Server error
 */
router.delete(
  '/:id',
  authenticate,
  authorize('delete', 'permissions'),
  param('id').isUUID().withMessage('Permission ID must be a valid UUID'),
  validateRequest,
  deletePermission
);

export default router;
