const express = require('express');
const { body, validationResult } = require('express-validator');
const { Department, User, Vehicle } = require('../models');
const { protect, authorize } = require('../middleware/auth');
const logger = require('../config/logger');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Department:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         code:
 *           type: string
 *         description:
 *           type: string
 *         is_active:
 *           type: boolean
 */

/**
 * @swagger
 * /departments:
 *   get:
 *     summary: Get all departments
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of departments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Department'
 */
router.get('/', async (req, res) => {
  try {
    //console.log('🏢 Departments GET route accessed');
    
    const departments = await Department.findAll({
      where: { is_active: true },
      include: [
        {
          model: User,
          as: 'users',
          attributes: ['id', 'first_name', 'last_name', 'email', 'user_role'],
        },
        {
          model: Vehicle,
          as: 'vehicles',
          attributes: ['id', 'number_plate', 'make', 'model', 'status'],
        },
      ],
      order: [['name', 'ASC']],
    });

    //console.log(`✅ Returning ${departments.length} departments`);

    res.status(200).json({
      success: true,
      data: departments,
    });
  } catch (error) {
    //console.error('❌ Departments GET error:', error);
    logger.error('Get departments error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

/**
 * @swagger
 * /departments/{id}:
 *   get:
 *     summary: Get department by ID
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Department details
 *       404:
 *         description: Department not found
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findByPk(id, {
      include: [
        {
          model: User,
          as: 'users',
          attributes: ['id', 'first_name', 'last_name', 'email', 'user_role'],
        },
        {
          model: Vehicle,
          as: 'vehicles',
          attributes: ['id', 'number_plate', 'make', 'model', 'status'],
        },
      ],
    });

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }

    res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error) {
    logger.error('Get department error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

/**
 * @swagger
 * /departments:
 *   post:
 *     summary: Create new department
 *     tags: [Departments]
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
 *               - code
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Department created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', protect, authorize('admin'), [
  body('name').notEmpty().isLength({ min: 1, max: 100 }),
  body('code').notEmpty().isLength({ min: 1, max: 20 }),
  body('description').optional().isString(),
], async (req, res) => {
  try {
    //console.log('🏢 Creating department...');
    //console.log('📋 Request body:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array(),
      });
    }

    const { name, code, description } = req.body;

    // Check if department with code already exists
    const existingDepartment = await Department.findOne({
      where: { code },
    });

    if (existingDepartment) {
      return res.status(409).json({
        success: false,
        message: 'Department with this code already exists',
      });
    }

    // Create department
    const department = await Department.create({
      name,
      code,
      description,
    });

    logger.info(`New department created: ${department.name}`);

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: department,
    });
  } catch (error) {
    //console.error('❌ Department POST error:', error);
    logger.error('Create department error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

/**
 * @swagger
 * /departments/{id}:
 *   put:
 *     summary: Update department
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Department updated successfully
 *       404:
 *         description: Department not found
 */
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const department = await Department.findByPk(id);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }

    await department.update(updateData);

    logger.info(`Department updated: ${department.name}`);

    res.status(200).json({
      success: true,
      message: 'Department updated successfully',
      data: department,
    });
  } catch (error) {
    logger.error('Update department error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

/**
 * @swagger
 * /departments/{id}:
 *   delete:
 *     summary: Delete department (soft delete)
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Department deleted successfully
 *       404:
 *         description: Department not found
 */
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findByPk(id);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }

    // Soft delete
    await department.update({ is_active: false });

    logger.info(`Department deleted: ${department.name}`);

    res.status(200).json({
      success: true,
      message: 'Department deleted successfully',
    });
  } catch (error) {
    logger.error('Delete department error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

module.exports = router; 