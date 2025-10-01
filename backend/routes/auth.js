const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { User, UserSession } = require('../models');
const { protect } = require('../middleware/auth');
const logger = require('../config/logger');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - coyno_id
 *       properties:
 *         coyno_id:
 *           type: string
 *           description: User's company ID
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - coyno_id
 *         - email
 *         - first_name
 *         - last_name
 *         - user_role
 *       properties:
 *         coyno_id:
 *           type: string
 *           description: Company ID
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           description: Optional password (not required for coyno_id login)
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         phone_number:
 *           type: string
 *         department_id:
 *           type: string
 *           format: uuid
 *         user_role:
 *           type: string
 *           enum: [admin, manager, driver, mechanic]
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/User'
 *             token:
 *               type: string
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid credentials
 *       401:
 *         description: Authentication failed
 */
// Test route to debug model issues
router.get('/test', async (req, res) => {
  try {
    logger.info('Testing User model...');
    const userCount = await User.count();
    logger.info(`User count: ${userCount}`);
    res.json({ success: true, userCount });
  } catch (error) {
    logger.error('Test route error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/login', [
  body('coyno_id').notEmpty().isLength({ min: 1, max: 50 }),
  body('password').notEmpty().isLength({ min: 1, max: 50 }),
], async (req, res) => {
  try {
    const response = await User.findOne({
      where: {
        coyno_id: req.body.coyno_id,
      },
    });
    
    if (!response) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await response.comparePassword(req.body.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: response.id, email: response.email, role: response.user_role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }); 
    res.status(200).json({ success: true, message: 'Login successful', data: { user: response.toJSON(), token } });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/add-admin', async (req, res) => {
  try {
    const {coyno_id, password } = req.body;
    
    // Validate required fields
    if (!coyno_id || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Company ID and password are required' 
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      where: { coyno_id: req.body.coyno_id }
    });

    if (!existingUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'User with this company ID does not exist' 
      });
    }

    // Check if user is already an admin
    if (existingUser.user_role === 'admin') {
      return res.status(409).json({ 
        success: false, 
        message: 'User is already an admin' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Update user to admin
    await User.update({
      password_hash: hashedPassword,
      user_role: 'admin',
    }, {
      where: {
        coyno_id: req.body.coyno_id
      }
    });

    // Get updated user
    const updatedUser = await User.findOne({
      where: { coyno_id: req.body.coyno_id }
    });

    res.status(200).json({ 
      success: true, 
      message: 'User promoted to admin successfully', 
      data: updatedUser.toJSON() 
    });
  } catch (error) {
    logger.error('Add admin error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});




/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error
 *       409:
 *         description: User already exists
 */
router.post('/register', protect, [
  body('coyno_id').notEmpty().isLength({ min: 1, max: 50 }),
  body('email').isEmail().normalizeEmail(),
  body('password').optional().isLength({ min: 6 }),
  body('first_name').notEmpty().isLength({ min: 1, max: 100 }),
  body('last_name').notEmpty().isLength({ min: 1, max: 100 }),
  body('user_role').isIn(['admin', 'manager', 'driver', 'mechanic']),
  body('phone_number').optional().isLength({ max: 20 }),
  body('department_id').optional().isUUID(),
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array(),
      });
    }

    const {
      coyno_id,
      email,
      password,
      first_name,
      last_name,
      phone_number,
      department_id,
      user_role,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { email },
          { coyno_id },
        ],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email or company ID already exists',
      });
    }

    // Create new user
    const user = await User.create({
      coyno_id,
      email,
      password_hash: password || null, // Will be hashed by model hook if provided
      first_name,
      last_name,
      phone_number,
      department_id,
      user_role,
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.user_role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    logger.info(`New user registered: ${user.email}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Not authorized
 */
router.post('/logout', protect, async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    // Deactivate session
    await UserSession.update(
      { is_active: false },
      { where: { session_token: token } }
    );

    logger.info(`User ${req.user.email} logged out`);

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authorized
 */
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          model: require('../models').Department,
          as: 'department',
          attributes: ['id', 'name', 'code'],
        },
      ],
    });

    res.status(200).json({
      success: true,
      data: user.toJSON(),
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

module.exports = router; 