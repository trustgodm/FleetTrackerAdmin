const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Trip = sequelize.define('Trip', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  vehicle_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'vehicles',
      key: 'id',
    },
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  purpose: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  start_location: {
    type: DataTypes.JSONB,
    allowNull: false,
    validate: {
      isValidLocation(value) {
        if (!value || typeof value !== 'object') {
          throw new Error('Start location must be a valid JSON object');
        }
        if (!value.latitude || !value.longitude) {
          throw new Error('Start location must include latitude and longitude');
        }
      },
    },
  },
  end_location: {
    type: DataTypes.JSONB,
    allowNull: true,
    validate: {
      isValidLocation(value) {
        if (value && typeof value === 'object') {
          if (!value.latitude || !value.longitude) {
            throw new Error('End location must include latitude and longitude');
          }
        }
      },
    },
  },
  start_odometer: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  end_odometer: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
    },
  },
  calculated_distance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0,
    },
  },
  fuel_level_start: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 100,
    },
  },
  fuel_level_end: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 100,
    },
  },
  start_time: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'cancelled'),
    allowNull: false,
    defaultValue: 'active',
    validate: {
      isIn: [['active', 'completed', 'cancelled']],
    },
  },
  damage_report: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
 
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'trips',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['vehicle_id'],
    },
    {
      fields: ['user_id'],
    },
    {
      fields: ['status'],
    },
    {
      fields: ['start_time'],
    },
    {
      fields: ['end_time'],
    },
    {
      type: 'GIN',
      fields: ['start_location'],
    },
    {
      type: 'GIN',
      fields: ['end_location'],
    },
  ],
});

// Instance methods
Trip.prototype.getDuration = function() {
  if (!this.start_time || !this.end_time) {
    return null;
  }
  return Math.floor((new Date(this.end_time) - new Date(this.start_time)) / 1000 / 60); // minutes
};

Trip.prototype.getFuelConsumption = function() {
  if (this.fuel_level_start === null || this.fuel_level_end === null) {
    return null;
  }
  return this.fuel_level_start - this.fuel_level_end;
};

Trip.prototype.getDistance = function() {
  if (this.calculated_distance) {
    return this.calculated_distance;
  }
  if (this.start_odometer && this.end_odometer) {
    return this.end_odometer - this.start_odometer;
  }
  return null;
};

Trip.prototype.isActive = function() {
  return this.status === 'active';
};

Trip.prototype.isCompleted = function() {
  return this.status === 'completed';
};

Trip.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = Trip; 