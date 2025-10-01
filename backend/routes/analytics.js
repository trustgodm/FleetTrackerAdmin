const express = require('express');
const { Op } = require('sequelize');
const { Vehicle, Department, User, Trip, MaintenanceSchedule } = require('../models');
const { protect, authorize } = require('../middleware/auth');
const logger = require('../config/logger');

const router = express.Router();

// Test endpoint to check if analytics routes are working
router.get('/test', protect, (req, res) => {
  res.json({
    success: true,
    message: 'Analytics routes are working',
    timestamp: new Date().toISOString()
  });
});

// Helper function to build date range based on filter
const buildDateRange = (filter, start_date, end_date) => {
  const now = new Date();
  
  switch (filter) {
    case 'today':
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return { start: startOfDay, end: now };
    case 'week':
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      return { start: startOfWeek, end: now };
    case 'month':
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return { start: startOfMonth, end: now };
    case 'custom':
      return { start: new Date(start_date), end: new Date(end_date) };
    default:
      return null;
  }
};

// Helper function to calculate analytics metrics
const calculateAnalyticsMetrics = (vehicles, trips, departments, filter) => {
  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter(v => v.status === 'active' || v.status === 'available').length;
  const maintenanceVehicles = vehicles.filter(v => v.status === 'maintenance').length;
  const totalTrips = trips.length;
  const completedTrips = trips.filter(t => t.status === 'completed').length;
  const activeTrips = trips.filter(t => t.status === 'active').length;
  
  // Calculate fuel metrics
  const totalFuelCapacity = vehicles.reduce((sum, v) => sum + (parseFloat(v.fuel_capacity) || 0), 0);
  const avgFuelCapacity = vehicles.length > 0 ? totalFuelCapacity / vehicles.length : 0;
  
  // Calculate department metrics
  const departmentStats = departments.map(dept => {
    const deptVehicles = vehicles.filter(v => v.department_id === dept.id);
    return {
      id: dept.id,
      name: dept.name,
      vehicleCount: deptVehicles.length,
      activeVehicles: deptVehicles.filter(v => v.status === 'active' || v.status === 'available').length,
      maintenanceVehicles: deptVehicles.filter(v => v.status === 'maintenance').length
    };
  });

  return {
    totalVehicles,
    activeVehicles,
    maintenanceVehicles,
    totalTrips,
    completedTrips,
    activeTrips,
    avgFuelCapacity: Math.round(avgFuelCapacity * 100) / 100,
    utilizationRate: totalVehicles > 0 ? Math.round((activeVehicles / totalVehicles) * 100) : 0,
    departmentStats,
    filter
  };
};

/**
 * @swagger
 * /analytics/dashboard:
 *   get:
 *     summary: Get dashboard analytics with date filtering
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum: [all, today, week, month, custom]
 *         description: Date filter type
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for custom range
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for custom range
 *     responses:
 *       200:
 *         description: Dashboard analytics data
 */
router.get('/dashboard', protect, async (req, res) => {
  try {
    const { filter = 'all', start_date, end_date, company_id } = req.query;
    
    // Build date range based on filter
    let dateRange = null;
    if (filter && filter !== 'all') {
      dateRange = buildDateRange(filter, start_date, end_date);
    }
    
    // Build where clause for date filtering
    const whereClause = dateRange ? {
      created_at: {
        [Op.between]: [dateRange.start, dateRange.end]
      }
    } : {};
    
    // Add company ID filtering if provided
    const vehicleWhereClause = company_id ? {
      ...whereClause,
      coyno_id: company_id
    } : whereClause;
    
    // Fetch filtered data with error handling
    let vehicles = [];
    let trips = [];
    let departments = [];
    
    try {
      vehicles = await Vehicle.findAll({
        where: vehicleWhereClause,
        include: [{ model: Department, as: 'department' }]
      });
    } catch (error) {
      logger.error('Error fetching vehicles:', error);
    }
    
    try {
      // Filter trips by company ID if provided
      const tripWhereClause = {};
      if (dateRange) {
        tripWhereClause.start_time = {
          [Op.between]: [dateRange.start, dateRange.end]
        };
      }
      
      trips = await Trip.findAll({
        where: tripWhereClause,
        include: [
          { 
            model: Vehicle, 
            as: 'vehicle',
            where: company_id ? { coyno_id: company_id } : {},
            required: !!company_id
          },
          { model: User, as: 'driver' }
        ]
      });
    } catch (error) {
      logger.error('Error fetching trips:', error);
    }
    
    try {
      // Filter departments by company ID if provided
      const deptWhereClause = company_id ? {
        '$vehicles.coyno_id$': company_id
      } : {};
      
      departments = await Department.findAll({
        where: deptWhereClause,
        include: [{ 
          model: Vehicle, 
          as: 'vehicles',
          where: company_id ? { coyno_id: company_id } : {},
          required: !!company_id
        }]
      });
    } catch (error) {
      logger.error('Error fetching departments:', error);
    }
    
    // Calculate analytics metrics
    const metrics = calculateAnalyticsMetrics(vehicles, trips, departments, filter);
    
    logger.info(`Analytics dashboard accessed with filter: ${filter}, company_id: ${company_id || 'all'}`);
    
    res.json({
      success: true,
      data: {
        metrics,
        vehicles: vehicles.length,
        trips: trips.length,
        departments: departments.length,
        filter: filter || 'all',
        dateRange,
        company_id: company_id || null
      }
    });
  } catch (error) {
    logger.error('Analytics dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @swagger
 * /analytics/vehicles:
 *   get:
 *     summary: Get vehicle analytics with date filtering
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 */
router.get('/vehicles', protect, async (req, res) => {
  try {
    const { filter = 'all', start_date, end_date } = req.query;
    
    let dateRange = null;
    if (filter && filter !== 'all') {
      dateRange = buildDateRange(filter, start_date, end_date);
    }
    
    const whereClause = dateRange ? {
      created_at: {
        [Op.between]: [dateRange.start, dateRange.end]
      }
    } : {};
    
    let vehicles = [];
    try {
      vehicles = await Vehicle.findAll({
        where: whereClause,
        include: [
          { model: Department, as: 'department' },
          { model: User, as: 'assignedDriver' }
        ],
        order: [['created_at', 'DESC']]
      });
    } catch (error) {
      logger.error('Error fetching vehicles for analytics:', error);
    }
    
    // Calculate vehicle analytics
    const vehicleAnalytics = {
      total: vehicles.length,
      byStatus: {
        active: vehicles.filter(v => v.status === 'active' || v.status === 'available').length,
        maintenance: vehicles.filter(v => v.status === 'maintenance').length,
        retired: vehicles.filter(v => v.status === 'retired').length
      },
      byDepartment: vehicles.reduce((acc, vehicle) => {
        const deptName = vehicle.department?.name || 'Unassigned';
        acc[deptName] = (acc[deptName] || 0) + 1;
        return acc;
      }, {}),
      byFuelType: vehicles.reduce((acc, vehicle) => {
        acc[vehicle.fuel_type] = (acc[vehicle.fuel_type] || 0) + 1;
        return acc;
      }, {}),
      filter
    };
    
    res.json({
      success: true,
      data: vehicleAnalytics
    });
  } catch (error) {
    logger.error('Vehicle analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vehicle analytics'
    });
  }
});

/**
 * @swagger
 * /analytics/trips:
 *   get:
 *     summary: Get trip analytics with date filtering
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 */
router.get('/trips', protect, async (req, res) => {
  try {
    const { filter = 'all', start_date, end_date } = req.query;
    
    let dateRange = null;
    if (filter && filter !== 'all') {
      dateRange = buildDateRange(filter, start_date, end_date);
    }
    
    const whereClause = dateRange ? {
      start_time: {
        [Op.between]: [dateRange.start, dateRange.end]
      }
    } : {};
    
    let trips = [];
    try {
      trips = await Trip.findAll({
        where: whereClause,
        include: [
          { model: Vehicle, as: 'vehicle' },
          { model: User, as: 'driver' }
        ],
        order: [['start_time', 'DESC']]
      });
    } catch (error) {
      logger.error('Error fetching trips for analytics:', error);
    }
    
    // Calculate trip analytics
    const tripAnalytics = {
      total: trips.length,
      byStatus: {
        active: trips.filter(t => t.status === 'active').length,
        completed: trips.filter(t => t.status === 'completed').length,
        cancelled: trips.filter(t => t.status === 'cancelled').length
      },
      totalDistance: trips.reduce((sum, trip) => {
        if (trip.end_odometer && trip.start_odometer) {
          return sum + (trip.end_odometer - trip.start_odometer);
        }
        return sum;
      }, 0),
      totalDuration: trips.reduce((sum, trip) => {
        if (trip.start_time && trip.end_time) {
          const duration = new Date(trip.end_time) - new Date(trip.start_time);
          return sum + duration;
        }
        return sum;
      }, 0),
      filter
    };
    
    res.json({
      success: true,
      data: tripAnalytics
    });
  } catch (error) {
    logger.error('Trip analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trip analytics'
    });
  }
});

/**
 * @swagger
 * /analytics/fuel:
 *   get:
 *     summary: Get fuel analytics with date filtering
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 */
router.get('/fuel', protect, async (req, res) => {
  try {
    const { filter = 'all', start_date, end_date } = req.query;
    
    let dateRange = null;
    if (filter && filter !== 'all') {
      dateRange = buildDateRange(filter, start_date, end_date);
    }
    
    const whereClause = dateRange ? {
      created_at: {
        [Op.between]: [dateRange.start, dateRange.end]
      }
    } : {};
    
    let vehicles = [];
    try {
      vehicles = await Vehicle.findAll({
        where: whereClause,
        attributes: ['fuel_type', 'fuel_capacity', 'status']
      });
    } catch (error) {
      logger.error('Error fetching vehicles for fuel analytics:', error);
    }
    
    // Calculate fuel analytics
    const fuelAnalytics = {
      totalVehicles: vehicles.length,
      byFuelType: vehicles.reduce((acc, vehicle) => {
        acc[vehicle.fuel_type] = (acc[vehicle.fuel_type] || 0) + 1;
        return acc;
      }, {}),
      totalFuelCapacity: vehicles.reduce((sum, v) => sum + (parseFloat(v.fuel_capacity) || 0), 0),
      avgFuelCapacity: vehicles.length > 0 ? 
        vehicles.reduce((sum, v) => sum + (parseFloat(v.fuel_capacity) || 0), 0) / vehicles.length : 0,
      filter
    };
    
    res.json({
      success: true,
      data: fuelAnalytics
    });
  } catch (error) {
    logger.error('Fuel analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching fuel analytics'
    });
  }
});

/**
 * @swagger
 * /analytics/maintenance:
 *   get:
 *     summary: Get maintenance analytics with date filtering
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 */
router.get('/maintenance', protect, async (req, res) => {
  try {
    const { filter = 'all', start_date, end_date } = req.query;
    
    let dateRange = null;
    if (filter && filter !== 'all') {
      dateRange = buildDateRange(filter, start_date, end_date);
    }
    
    const whereClause = dateRange ? {
      scheduled_date: {
        [Op.between]: [dateRange.start, dateRange.end]
      }
    } : {};
    
    let maintenance = [];
    try {
      maintenance = await MaintenanceSchedule.findAll({
        where: whereClause,
        include: [{ model: Vehicle, as: 'vehicle' }],
        order: [['scheduled_date', 'DESC']]
      });
    } catch (error) {
      logger.error('Error fetching maintenance for analytics:', error);
    }
    
    // Calculate maintenance analytics
    const maintenanceAnalytics = {
      total: maintenance.length,
      byStatus: {
        scheduled: maintenance.filter(m => m.status === 'scheduled').length,
        inProgress: maintenance.filter(m => m.status === 'in_progress').length,
        completed: maintenance.filter(m => m.status === 'completed').length,
        overdue: maintenance.filter(m => m.status === 'overdue').length
      },
      byType: maintenance.reduce((acc, m) => {
        acc[m.type] = (acc[m.type] || 0) + 1;
        return acc;
      }, {}),
      filter
    };
    
    res.json({
      success: true,
      data: maintenanceAnalytics
    });
  } catch (error) {
    logger.error('Maintenance analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching maintenance analytics'
    });
  }
});

/**
 * @swagger
 * /analytics/departments:
 *   get:
 *     summary: Get department analytics with date filtering
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 */
router.get('/departments', protect, async (req, res) => {
  try {
    const { filter = 'all', start_date, end_date } = req.query;
    
    let dateRange = null;
    if (filter && filter !== 'all') {
      dateRange = buildDateRange(filter, start_date, end_date);
    }
    
    const whereClause = dateRange ? {
      created_at: {
        [Op.between]: [dateRange.start, dateRange.end]
      }
    } : {};
    
    let departments = [];
    try {
      departments = await Department.findAll({
        where: whereClause,
        include: [
          { model: Vehicle, as: 'vehicles' },
          { model: User, as: 'users' }
        ],
        order: [['created_at', 'DESC']]
      });
    } catch (error) {
      logger.error('Error fetching departments for analytics:', error);
    }
    
    // Calculate department analytics
    const departmentAnalytics = {
      total: departments.length,
      departments: departments.map(dept => ({
        id: dept.id,
        name: dept.name,
        code: dept.code,
        vehicleCount: dept.vehicles?.length || 0,
        userCount: dept.users?.length || 0,
        activeVehicles: dept.vehicles?.filter(v => v.status === 'active' || v.status === 'available').length || 0,
        maintenanceVehicles: dept.vehicles?.filter(v => v.status === 'maintenance').length || 0
      })),
      filter
    };
    
    res.json({
      success: true,
      data: departmentAnalytics
    });
  } catch (error) {
    logger.error('Department analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching department analytics'
    });
  }
});

/**
 * @swagger
 * /analytics/utilization:
 *   get:
 *     summary: Get vehicle utilization analytics with department and user filtering
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum: [all, today, week, month, custom]
 *         description: Date filter type
 *       - in: query
 *         name: department_id
 *         schema:
 *           type: string
 *         description: Filter by department ID
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for custom range
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for custom range
 *     responses:
 *       200:
 *         description: Vehicle utilization analytics data
 */
router.get('/utilization', protect, async (req, res) => {
  try {
    const { filter = 'all', start_date, end_date, department_id, user_id } = req.query;
    
    let dateRange = null;
    if (filter && filter !== 'all') {
      dateRange = buildDateRange(filter, start_date, end_date);
    }
    
    // Build where clause for trips
    const tripWhereClause = {};
    if (dateRange) {
      tripWhereClause.start_time = {
        [Op.between]: [dateRange.start, dateRange.end]
      };
    }
    if (user_id) {
      tripWhereClause.driver_id = user_id;
    }
    
    // Build where clause for vehicles
    const vehicleWhereClause = {};
    if (department_id) {
      vehicleWhereClause.department_id = department_id;
    }
    
    let trips = [];
    let vehicles = [];
    let departments = [];
    let users = [];
    
    try {
      trips = await Trip.findAll({
        where: tripWhereClause,
        include: [
          { model: Vehicle, as: 'vehicle', where: vehicleWhereClause },
          { model: User, as: 'driver' }
        ],
        order: [['start_time', 'DESC']]
      });
    } catch (error) {
      logger.error('Error fetching trips for utilization analytics:', error);
    }
    
    try {
      vehicles = await Vehicle.findAll({
        where: vehicleWhereClause,
        include: [
          { model: Department, as: 'department' },
          { model: User, as: 'assignedDriver' }
        ]
      });
    } catch (error) {
      logger.error('Error fetching vehicles for utilization analytics:', error);
    }
    
    try {
      departments = await Department.findAll({
        include: [
          { model: Vehicle, as: 'vehicles' },
          { model: User, as: 'users' }
        ]
      });
    } catch (error) {
      logger.error('Error fetching departments for utilization analytics:', error);
    }
    
    try {
      users = await User.findAll({
        include: [
          { model: Department, as: 'department' },
          { model: Trip, as: 'trips', where: dateRange ? {
            start_time: {
              [Op.between]: [dateRange.start, dateRange.end]
            }
          } : {} }
        ]
      });
    } catch (error) {
      logger.error('Error fetching users for utilization analytics:', error);
    }
    
    // Calculate utilization metrics
    const totalVehicles = vehicles.length;
    const activeVehicles = vehicles.filter(v => v.status === 'active' || v.status === 'available').length;
    const totalTrips = trips.length;
    const completedTrips = trips.filter(t => t.status === 'completed').length;
    const activeTrips = trips.filter(t => t.status === 'active').length;
    
    // Calculate total distance and duration
    const totalDistance = trips.reduce((sum, trip) => {
      if (trip.end_odometer && trip.start_odometer) {
        return sum + (trip.end_odometer - trip.start_odometer);
      }
      return sum;
    }, 0);
    
    const totalDuration = trips.reduce((sum, trip) => {
      if (trip.start_time && trip.end_time) {
        const duration = new Date(trip.end_time) - new Date(trip.start_time);
        return sum + duration;
      }
      return sum;
    }, 0);
    
    // Calculate utilization rate
    const utilizationRate = totalVehicles > 0 ? Math.round((activeVehicles / totalVehicles) * 100) : 0;
    
    // Calculate department-wise utilization
    const departmentUtilization = departments.map(dept => {
      const deptVehicles = vehicles.filter(v => v.department_id === dept.id);
      const deptTrips = trips.filter(t => t.vehicle?.department_id === dept.id);
      const deptActiveVehicles = deptVehicles.filter(v => v.status === 'active' || v.status === 'available').length;
      const deptCompletedTrips = deptTrips.filter(t => t.status === 'completed').length;
      
      return {
        id: dept.id,
        name: dept.name,
        totalVehicles: deptVehicles.length,
        activeVehicles: deptActiveVehicles,
        totalTrips: deptTrips.length,
        completedTrips: deptCompletedTrips,
        utilizationRate: deptVehicles.length > 0 ? Math.round((deptActiveVehicles / deptVehicles.length) * 100) : 0,
        avgTripsPerVehicle: deptVehicles.length > 0 ? Math.round(deptTrips.length / deptVehicles.length) : 0
      };
    });
    
    // Calculate user-wise utilization
    const userUtilization = users.map(user => {
      const userTrips = trips.filter(t => t.driver_id === user.id);
      const userCompletedTrips = userTrips.filter(t => t.status === 'completed').length;
      const userActiveTrips = userTrips.filter(t => t.status === 'active').length;
      
      const userTotalDistance = userTrips.reduce((sum, trip) => {
        if (trip.end_odometer && trip.start_odometer) {
          return sum + (trip.end_odometer - trip.start_odometer);
        }
        return sum;
      }, 0);
      
      const userTotalDuration = userTrips.reduce((sum, trip) => {
        if (trip.start_time && trip.end_time) {
          const duration = new Date(trip.end_time) - new Date(trip.start_time);
          return sum + duration;
        }
        return sum;
      }, 0);
      
      return {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        department: user.department?.name || 'Unassigned',
        totalTrips: userTrips.length,
        completedTrips: userCompletedTrips,
        activeTrips: userActiveTrips,
        totalDistance: userTotalDistance,
        totalDuration: userTotalDuration,
        avgTripDuration: userTrips.length > 0 ? Math.round(userTotalDuration / userTrips.length / (1000 * 60)) : 0, // minutes
        avgTripDistance: userTrips.length > 0 ? Math.round(userTotalDistance / userTrips.length) : 0
      };
    });
    
    // Calculate weekly utilization data
    const weeklyUtilization = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    
    days.forEach((day, index) => {
      const dayStart = new Date(startOfWeek);
      dayStart.setDate(startOfWeek.getDate() + index);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayStart.getDate() + 1);
      
      const dayTrips = trips.filter(trip => {
        const tripDate = new Date(trip.start_time);
        return tripDate >= dayStart && tripDate < dayEnd;
      });
      
      const dayDistance = dayTrips.reduce((sum, trip) => {
        if (trip.end_odometer && trip.start_odometer) {
          return sum + (trip.end_odometer - trip.start_odometer);
        }
        return sum;
      }, 0);
      
      const dayDuration = dayTrips.reduce((sum, trip) => {
        if (trip.start_time && trip.end_time) {
          const duration = new Date(trip.end_time) - new Date(trip.start_time);
          return sum + duration;
        }
        return sum;
      }, 0);
      
      weeklyUtilization.push({
        day,
        trips: dayTrips.length,
        distance: dayDistance,
        duration: Math.round(dayDuration / (1000 * 60 * 60)), // hours
        activeVehicles: vehicles.filter(v => {
          const vehicleTrips = dayTrips.filter(t => t.vehicle_id === v.id);
          return vehicleTrips.length > 0;
        }).length
      });
    });
    
    const utilizationAnalytics = {
      overview: {
        totalVehicles,
        activeVehicles,
        totalTrips,
        completedTrips,
        activeTrips,
        totalDistance,
        totalDuration: Math.round(totalDuration / (1000 * 60 * 60)), // hours
        utilizationRate,
        avgTripsPerVehicle: totalVehicles > 0 ? Math.round(totalTrips / totalVehicles) : 0,
        avgDistancePerTrip: totalTrips > 0 ? Math.round(totalDistance / totalTrips) : 0,
        avgDurationPerTrip: totalTrips > 0 ? Math.round(totalDuration / totalTrips / (1000 * 60)) : 0 // minutes
      },
      byDepartment: departmentUtilization,
      byUser: userUtilization,
      weekly: weeklyUtilization,
      filter: {
        type: filter,
        department_id: department_id || null,
        user_id: user_id || null,
        dateRange
      }
    };
    
    logger.info(`Utilization analytics accessed with filter: ${filter}, department: ${department_id}, user: ${user_id}`);
    
    res.json({
      success: true,
      data: utilizationAnalytics
    });
  } catch (error) {
    logger.error('Utilization analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching utilization analytics'
    });
  }
});

module.exports = router; 