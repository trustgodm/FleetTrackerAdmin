const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const VehicleInspection = require('../models/VehicleInspection');
const logger = require('../config/logger');

// Get all trips with associations
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.findAll({
      include: [
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'number_plate', 'model', 'make', 'year']
        },
        {
          model: User,
          as: 'driver',
          attributes: ['id', 'first_name', 'last_name', 'email']
        },
        {
          model: VehicleInspection,
          as: 'inspections',
          attributes: ['id', 'inspection_type', 'all_windows_good', 'all_lights_good', 'all_mirrors_good', 'all_doors_good', 'all_seats_good', 'all_tires_good', 'needs_service', 'notes']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      success: true,
      data: trips
    });
  } catch (error) {
    logger.error('Error fetching trips:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Get trip by ID
router.get('/:id', async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id, {
      include: [
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'number_plate', 'model', 'make', 'year']
        },
        {
          model: User,
          as: 'driver',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ]
    });
    
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }
    
    res.json({
      success: true,
      data: trip
    });
  } catch (error) {
    logger.error('Error fetching trip:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Create new trip
router.post('/', async (req, res) => {
  try {
    const tripData = req.body;
    const trip = await Trip.create(tripData);
    
    const createdTrip = await Trip.findByPk(trip.id, {
      include: [
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'number_plate', 'model', 'make', 'year']
        },
        {
          model: User,
          as: 'driver',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ]
    });
    
    res.status(201).json({
      success: true,
      data: createdTrip
    });
  } catch (error) {
    logger.error('Error creating trip:', error);
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Update trip
router.put('/:id', async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }
    
    await trip.update(req.body);
    
    const updatedTrip = await Trip.findByPk(trip.id, {
      include: [
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'number_plate', 'model', 'make', 'year']
        },
        {
          model: User,
          as: 'driver',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ]
    });
    
    res.json({
      success: true,
      data: updatedTrip
    });
  } catch (error) {
    logger.error('Error updating trip:', error);
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
});

// End trip
router.put('/:id/end', async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }
    
    if (trip.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Trip is already completed'
      });
    }
    
    const endData = {
      ...req.body,
      status: 'completed',
      end_time: new Date()
    };
    
    await trip.update(endData);
    
    const updatedTrip = await Trip.findByPk(trip.id, {
      include: [
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'number_plate', 'model', 'make', 'year']
        },
        {
          model: User,
          as: 'driver',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ]
    });
    
    res.json({
      success: true,
      data: updatedTrip
    });
  } catch (error) {
    logger.error('Error ending trip:', error);
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
});

module.exports = router; 