const express = require('express');
const { body, validationResult } = require('express-validator');
const { Vehicle, Department, User, Trip ,VehicleInspection} = require('../models');
const { protect, authorize } = require('../middleware/auth');
const logger = require('../config/logger');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Vehicle:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         number_plate:
 *           type: string
 *         vin:
 *           type: string
 *         make:
 *           type: string
 *         model:
 *           type: string
 *         year:
 *           type: integer
 *         fuel_type:
 *           type: string
 *           enum: [petrol, diesel, electric, hybrid]
 *         fuel_capacity:
 *           type: number
 *         status:
 *           type: string
 *           enum: [active, maintenance, retired, available]
 *         current_odometer:
 *           type: integer
 *         next_service_due:
 *           type: integer
 *         department_id:
 *           type: string
 *           format: uuid
 *         assigned_driver_id:
 *           type: string
 *           format: uuid
 *         is_active:
 *           type: boolean
 *         last_service_date:
 *           type: string
 *           format: date
 *         license_expiry:
 *           type: string
 *           format: date
*/

/**
 * @swagger
 * /vehicles:
 *   get:
 *     summary: Get all vehicles
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by vehicle status
 *       - in: query
 *         name: department_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by department
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of vehicles
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
 *                     $ref: '#/components/schemas/Vehicle'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 */
// Test endpoint to check database connection
router.get('/test', async (req, res) => {
  try {
    //console.log('🧪 Vehicles test endpoint accessed');
    
    // Test basic database connection
    const count = await Vehicle.count();
    //console.log(`📊 Found ${count} vehicles in database`);
    
    res.status(200).json({
      success: true,
      message: 'Vehicles test endpoint working',
      data: {
        vehicleCount: count,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    //console.error('❌ Vehicles test error:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

router.get('/', protect, async (req, res) => {
  try {
  
    
    const {
      status,
      department_id,
 
    } = req.query;

    const where = {};
    if (status) where.status = status;
    if (department_id) where.department_id = department_id;

  

    //console.log('🔍 Building query with where:', where);
    
    // Get vehicles without associations first
    const { count, rows: vehicles } = await Vehicle.findAndCountAll({
      where,
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name', 'code'],
        },
      ],
      
      order: [['created_at', 'DESC']],
    });
    
    //console.log(`✅ Found ${vehicles.length} vehicles out of ${count} total`);


    res.status(200).json({
      success: true,
      data: vehicles,
    });
    
  } catch (error) {
    //console.error('❌ Vehicles GET error:', error);
    //console.error('❌ Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

/**
 * @swagger
 * /vehicles/{id}:
 *   get:
 *     summary: Get vehicle by ID
 *     tags: [Vehicles]
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
 *         description: Vehicle details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Vehicle'
 *       404:
 *         description: Vehicle not found
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findByPk(id, {
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name', 'code'],
        },
        {
          model: User,
          as: 'assignedDriver',
          attributes: ['id', 'first_name', 'last_name', 'email'],
        },
      ],
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    logger.error('Get vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

/**
 * @swagger
 * /vehicles:
 *   post:
 *     summary: Create new vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - number_plate
 *               - make
 *               - model
 *               - year
 *               - fuel_type
 *               - fuel_capacity
 *             properties:
 *               number_plate:
 *                 type: string
 *               vin:
 *                 type: string
 *               make:
 *                 type: string
 *               model:
 *                 type: string
 *               year:
 *                 type: integer
 *               fuel_type:
 *                 type: string
 *                 enum: [petrol, diesel, electric, hybrid]
 *               fuel_capacity:
 *                 type: number
 *               department_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Vehicle created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Vehicle with this number plate already exists
 */
router.post('/', protect, authorize('admin', 'manager'), [
  body('name').notEmpty().isLength({ min: 1, max: 100 }),
  body('number_plate').notEmpty().isLength({ min: 1, max: 20 }),
  body('make').notEmpty().isLength({ min: 1, max: 50 }),
  body('model').notEmpty().isLength({ min: 1, max: 50 }),
  body('year').isInt({ min: 1900, max: new Date().getFullYear() + 1 }),
  body('fuel_type').isIn(['petrol', 'diesel', 'electric', 'hybrid']),
  body('fuel_capacity').isFloat({ min: 0 }),
  body('vin').optional().isLength({ max: 17 }).custom((value) => {
    if (value && value.length > 0 && value.length > 17) {
      throw new Error('VIN must be 17 characters or less');
    }
    return true;
  }),
  body('department_id').optional().isUUID(),
  body('last_service_date').optional().isDate(),
  body('license_expiry').optional().isDate(),
  body('next_service_date').optional().isDate(),
], async (req, res) => {
  try {
    //console.log('📋 Received vehicle data:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array(),
      });
    }

    const {
      name,
      number_plate,
      vin,
      make,
      model,
      year,
      fuel_type,
      fuel_capacity,
      department_id,
      last_service_date,
      license_expiry,
      next_service_date,
    } = req.body;

    // Check if vehicle with number plate already exists
    const existingVehicle = await Vehicle.findOne({
      where: { number_plate },
    });

    if (existingVehicle) {
      return res.status(409).json({
        success: false,
        message: 'Vehicle with this number plate already exists',
      });
    }

    // Generate QR code for the vehicle
    const qrCodeData = `${number_plate}-${make}-${model}`;
    const qrCode = Buffer.from(qrCodeData).toString('base64').substring(0, 255);

    // Create vehicle with all required fields
    const vehicle = await Vehicle.create({
      name,
      number_plate,
      vin,
      qr_code: qrCode,
      make,
      model,
      year,
      fuel_type,
      fuel_capacity,
      department_id,
      last_service_date,
      license_expiry,
      next_service_date,
      insurance_expiry: null, // Explicitly set to null
      status: 'available', // Set default status
      current_odometer: 0, // Set default odometer
      photo_url: null, // Explicitly set to null
      assigned_driver_id: null, // Explicitly set to null
    });

    logger.info(`New vehicle created: ${vehicle.number_plate}`);

    res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      data: vehicle,
    });
  } catch (error) {
    logger.error('Create vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @swagger
 * /vehicles/{id}:
 *   put:
 *     summary: Update vehicle
 *     tags: [Vehicles]
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
 *               make:
 *                 type: string
 *               model:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, maintenance, retired, available]
 *               current_odometer:
 *                 type: integer
 *               department_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *       404:
 *         description: Vehicle not found
 */
router.put('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const vehicle = await Vehicle.findByPk(id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    await vehicle.update(updateData);

    logger.info(`Vehicle updated: ${vehicle.number_plate}`);

    res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully',
      data: vehicle,
    });
  } catch (error) {
    logger.error('Update vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

/**
 * @swagger
 * /vehicles/{id}:
 *   delete:
 *     summary: Delete vehicle (soft delete)
 *     tags: [Vehicles]
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
 *         description: Vehicle deleted successfully
 *       404:
 *         description: Vehicle not found
 */
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findByPk(id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    // Soft delete
    await vehicle.update({ is_active: false });

    logger.info(`Vehicle deleted: ${vehicle.number_plate}`);

    res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully',
    });
  } catch (error) {
    logger.error('Delete vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

//get vehicle history
router.get('/history/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const history = await Trip.findAll({
      where: { vehicle_id: id },
      include: [
        {
          model: User,
          as: 'driver',
            attributes: ['id', 'first_name', 'last_name', 'email'],
        },
      {
        model: VehicleInspection,
        as: 'inspections',
        attributes: ['id', 'inspection_type', 'all_windows_good', 'all_mirrors_good', 'all_tires_good', 'needs_service', 'notes', 'created_at']
      },
       
      
      ],
    });

    res.status(200).json({
      success: true,
      data: {
        history,
       
      },
    });
    
  } catch (error) {
    logger.error('Get vehicle history error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

module.exports = router; 