const express = require('express');
const { body, validationResult } = require('express-validator');
const { MaintenanceSchedule, Vehicle} = require('../models');
const { protect, authorize } = require('../middleware/auth');
const logger = require('../config/logger');
const { Op } = require('sequelize');

const router = express.Router();

// Test endpoint to check if everything is working
router.get('/test', async (req, res) => {
  try {
    //console.log('🧪 Testing maintenance endpoint...');
    
    // Test database connection
    const vehicleCount = await Vehicle.count();
    const maintenanceCount = await MaintenanceSchedule.count();
    
    //console.log(`📊 Database stats - Vehicles: ${vehicleCount}, Maintenance: ${maintenanceCount}`);
    
    res.json({
      success: true,
      message: 'Maintenance test endpoint working',
      data: {
        vehicles: vehicleCount,
        maintenance: maintenanceCount,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    //console.error('❌ Test endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Test failed',
      error: error.message
    });
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     MaintenanceSchedule:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         vehicle_id:
 *           type: string
 *           format: uuid
 *         maintenance_type:
 *           type: string
 *           enum: [oil_change, tire_rotation, brake_service, engine_service, inspection, other]
 *         description:
 *           type: string
 *         interval_km:
 *           type: integer
 *         interval_months:
 *           type: integer
 *         last_performed_at:
 *           type: string
 *           format: date-time
 *         last_service_odometer:
 *           type: integer
 *         next_due_date:
 *           type: string
 *           format: date-time
 *         next_due_odometer:
 *           type: integer
 *         estimated_cost:
 *           type: number
 *         is_active:
 *           type: boolean
 */

/**
 * @swagger
 * /maintenance:
 *   get:
 *     summary: Get all maintenance schedules
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status (overdue, due_soon, scheduled)
 *       - in: query
 *         name: vehicle_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by vehicle
 *       - in: query
 *         name: maintenance_type
 *         schema:
 *           type: string
 *         description: Filter by maintenance type
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
 *         description: List of maintenance schedules
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
 *                     $ref: '#/components/schemas/MaintenanceSchedule'
 *                 pagination:
 *                   type: object
 */
router.get('/', async (req, res) => {
  try {
    //console.log('🔧 Maintenance GET route accessed');
    //console.log('📋 Headers:', req.headers);
    //console.log('🔑 Authorization header:', req.headers.authorization);
    
    const {
      status,
      vehicle_id,
      maintenance_type,
      page = 1,
      limit = 10,
    } = req.query;

    const where = { is_active: true };
    if (vehicle_id) where.vehicle_id = vehicle_id;
    if (maintenance_type) where.maintenance_type = maintenance_type;

    const offset = (page - 1) * limit;

    const { count, rows: schedules } = await MaintenanceSchedule.findAndCountAll({
      where,
      include: [
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'number_plate', 'make', 'model', 'year', 'current_odometer'],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['next_due_date', 'ASC']],
    });

    // Apply status filter after fetching
    let filteredSchedules = schedules;
    if (status) {
      const now = new Date();
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      filteredSchedules = schedules.filter(schedule => {
        if (!schedule.next_due_date) return false;
        
        switch (status) {
          case 'overdue':
            return new Date(schedule.next_due_date) < now;
          case 'due_soon':
            const dueDate = new Date(schedule.next_due_date);
            return dueDate >= now && dueDate <= sevenDaysFromNow;
          case 'scheduled':
            return new Date(schedule.next_due_date) > sevenDaysFromNow;
          default:
            return true;
        }
      });
    }

    const totalPages = Math.ceil(count / limit);

    //console.log(`✅ Returning ${filteredSchedules.length} maintenance schedules`);

    res.status(200).json({
      success: true,
      data: filteredSchedules,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: totalPages,
      },
    });
  } catch (error) {
    //console.error('❌ Maintenance GET error:', error);
    logger.error('Get maintenance schedules error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

/**
 * @swagger
 * /maintenance/{id}:
 *   get:
 *     summary: Get maintenance schedule by ID
 *     tags: [Maintenance]
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
 *         description: Maintenance schedule details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/MaintenanceSchedule'
 *       404:
 *         description: Maintenance schedule not found
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await MaintenanceSchedule.findByPk(id, {
      include: [
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'number_plate', 'make', 'model', 'year', 'current_odometer'],
        },
      ],
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance schedule not found',
      });
    }

    res.status(200).json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    logger.error('Get maintenance schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

/**
 * @swagger
 * /maintenance:
 *   post:
 *     summary: Create new maintenance schedule
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicle_id
 *               - maintenance_type
 *             properties:
 *               vehicle_id:
 *                 type: string
 *                 format: uuid
 *               maintenance_type:
 *                 type: string
 *                 enum: [oil_change, tire_rotation, brake_service, engine_service, inspection, other]
 *               description:
 *                 type: string
 *               interval_km:
 *                 type: integer
 *               interval_months:
 *                 type: integer
 *               next_due_date:
 *                 type: string
 *                 format: date-time
 *               next_due_odometer:
 *                 type: integer
 *               estimated_cost:
 *                 type: number
 *     responses:
 *       201:
 *         description: Maintenance schedule created successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Vehicle not found
 */
router.post('/', [
  body('vehicle_id').isUUID().withMessage('Valid vehicle ID is required'),
  body('maintenance_type').isIn(['oil_change', 'tire_rotation', 'brake_service', 'engine_service', 'inspection', 'other']),
  body('description').optional().isString(),
  body('interval_km').optional().isInt({ min: 0 }),
  body('interval_months').optional().isInt({ min: 0 }),
  body('next_due_date').optional().isISO8601(),
  body('next_due_odometer').optional().isInt({ min: 0 }),
  body('estimated_cost').optional().isFloat({ min: 0 }),
], async (req, res) => {
  try {
    //console.log('🔧 Maintenance POST route accessed');
    //console.log('📋 Request body:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array(),
      });
    }

    const {
      vehicle_id,
      maintenance_type,
      description,
      interval_km,
      interval_months,
      next_due_date,
      next_due_odometer,
      estimated_cost,
    } = req.body;

    // Check if vehicle exists
    const vehicle = await Vehicle.findByPk(vehicle_id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    // Create maintenance schedule
    const schedule = await MaintenanceSchedule.create({
      vehicle_id,
      maintenance_type,
      description,
      interval_km,
      interval_months,
      next_due_date: next_due_date ? new Date(next_due_date) : null,
      next_due_odometer,
      estimated_cost,
    });

    // Fetch the created schedule with vehicle details
    const createdSchedule = await MaintenanceSchedule.findByPk(schedule.id, {
      include: [
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'number_plate', 'make', 'model', 'year', 'current_odometer'],
        },
      ],
    });

    logger.info(`New maintenance schedule created for vehicle: ${vehicle.number_plate}`);

    res.status(201).json({
      success: true,
      message: 'Maintenance schedule created successfully',
      data: createdSchedule,
    });
  } catch (error) {
    //  console.error('❌ Maintenance POST error:', error);
    logger.error('Create maintenance schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

/**
 * @swagger
 * /maintenance/{id}:
 *   put:
 *     summary: Update maintenance schedule
 *     tags: [Maintenance]
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
 *               maintenance_type:
 *                 type: string
 *               description:
 *                 type: string
 *               interval_km:
 *                 type: integer
 *               interval_months:
 *                 type: integer
 *               next_due_date:
 *                 type: string
 *                 format: date-time
 *               next_due_odometer:
 *                 type: integer
 *               estimated_cost:
 *                 type: number
 *     responses:
 *       200:
 *         description: Maintenance schedule updated successfully
 *       404:
 *         description: Maintenance schedule not found
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const schedule = await MaintenanceSchedule.findByPk(id);
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance schedule not found',
      });
    }

    await schedule.update(updateData);

    const updatedSchedule = await MaintenanceSchedule.findByPk(id, {
      include: [
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'number_plate', 'make', 'model', 'year', 'current_odometer'],
        },
      ],
    });

    logger.info(`Maintenance schedule updated: ${id}`);

    res.status(200).json({
      success: true,
      message: 'Maintenance schedule updated successfully',
      data: updatedSchedule,
    });
  } catch (error) {
    logger.error('Update maintenance schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

//get overdue,total,due soon,and completed scheduled maintenance
router.get('/stats/dashboard', async (req, res) => {
  try {
    const Total = await MaintenanceSchedule.findAndCountAll({
      where: { is_active: true },

    });
    const overdue = await MaintenanceSchedule.findAndCountAll({
      where: { is_active: true, next_due_date: { [Op.lt]: new Date() } },
    });
    const dueSoon = await MaintenanceSchedule.findAndCountAll({
      where: { is_active: true, next_due_date: { [Op.gt]: new Date(), [Op.lt]: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000) } },
    });
    const completed = await MaintenanceSchedule.findAndCountAll({
      where: { is_active: false },
    });
    const stats = {
      total: Total.count,
      overdue: overdue.count,
      dueSoon: dueSoon.count,
      completed: completed.count,
    };
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error('Get maintenance stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

/**
 * @swagger
 * /maintenance/{id}:
 *   delete:
 *     summary: Delete maintenance schedule (soft delete)
 *     tags: [Maintenance]
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
 *         description: Maintenance schedule deleted successfully
 *       404:
 *         description: Maintenance schedule not found
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await MaintenanceSchedule.findByPk(id);
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance schedule not found',
      });
    }

    // Soft delete
    await schedule.update({ is_active: false });

    logger.info(`Maintenance schedule deleted: ${id}`);

    res.status(200).json({
      success: true,
      message: 'Maintenance schedule deleted successfully',
    });
  } catch (error) {
    logger.error('Delete maintenance schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

/**
 * @swagger
 * /maintenance/{id}/complete:
 *   put:
 *     summary: Mark maintenance as completed
 *     tags: [Maintenance]
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
 *               actual_cost:
 *                 type: number
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Maintenance completed successfully
 *       404:
 *         description: Maintenance schedule not found
 */
router.put('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const { actual_cost, notes } = req.body;

    const schedule = await MaintenanceSchedule.findByPk(id);
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance schedule not found',
      });
    }

    // Update with completion data
    const updateData = {
      last_performed_at: new Date(),
      last_service_odometer: schedule.vehicle?.current_odometer || 0,
    };

    // Calculate next due date based on intervals
    if (schedule.interval_months) {
      const nextDueDate = new Date();
      nextDueDate.setMonth(nextDueDate.getMonth() + schedule.interval_months);
      updateData.next_due_date = nextDueDate;
    }

    if (schedule.interval_km && schedule.vehicle?.current_odometer) {
      updateData.next_due_odometer = schedule.vehicle.current_odometer + schedule.interval_km;
    }

    await schedule.update(updateData);

    const updatedSchedule = await MaintenanceSchedule.findByPk(id, {
      include: [
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'number_plate', 'make', 'model', 'year', 'current_odometer'],
        },
      ],
    });

    logger.info(`Maintenance completed: ${id}`);

    res.status(200).json({
      success: true,
      message: 'Maintenance completed successfully',
      data: updatedSchedule,
    });
  } catch (error) {
    logger.error('Complete maintenance error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

module.exports = router; 