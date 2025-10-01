const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const VehicleInspection = sequelize.define('VehicleInspection', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  trip_id: {
    type: DataTypes.UUID,
    references: {
      model: 'trips',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  vehicle_id: {
    type: DataTypes.UUID,
    references: {
      model: 'vehicles',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  inspection_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  all_windows_good: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  all_mirrors_good: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  all_tires_good: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  needs_service: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'vehicle_inspections',
  timestamps: false,
 
 
  indexes: [
    {
      fields: ['vehicle_id'],
    },
 
    {
      fields: ['inspection_type'],
    },
    {
      fields: ['needs_service'],
    },
  ],
});

// Instance methods
VehicleInspection.prototype.getPassedItems = function() {
  const checklist = [
    'tires_condition', 'brakes_functional', 'lights_working', 'horn_functional',
    'windshield_clean', 'mirrors_adjusted', 'seatbelts_functional', 'engine_sound_normal',
    'transmission_smooth', 'steering_responsive', 'fuel_level_adequate', 'coolant_level_adequate',
    'oil_level_adequate', 'battery_condition'
  ];
  
  return checklist.filter(item => this[item]);
};

VehicleInspection.prototype.getFailedItems = function() {
  const checklist = [
    'tires_condition', 'brakes_functional', 'lights_working', 'horn_functional',
    'windshield_clean', 'mirrors_adjusted', 'seatbelts_functional', 'engine_sound_normal',
    'transmission_smooth', 'steering_responsive', 'fuel_level_adequate', 'coolant_level_adequate',
    'oil_level_adequate', 'battery_condition'
  ];
  
  return checklist.filter(item => !this[item]);
};

VehicleInspection.prototype.getPassRate = function() {
  const checklist = [
    'tires_condition', 'brakes_functional', 'lights_working', 'horn_functional',
    'windshield_clean', 'mirrors_adjusted', 'seatbelts_functional', 'engine_sound_normal',
    'transmission_smooth', 'steering_responsive', 'fuel_level_adequate', 'coolant_level_adequate',
    'oil_level_adequate', 'battery_condition'
  ];
  
  const passed = checklist.filter(item => this[item]).length;
  return (passed / checklist.length) * 100;
};

VehicleInspection.prototype.isPassed = function() {
  return this.getPassRate() >= 90; // 90% pass rate threshold
};

VehicleInspection.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = VehicleInspection; 