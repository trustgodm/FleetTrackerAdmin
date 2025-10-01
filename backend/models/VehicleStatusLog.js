const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const VehicleStatusLog = sequelize.define('VehicleStatusLog', {
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
  previous_status: {
    type: DataTypes.ENUM('active', 'maintenance', 'retired', 'available'),
    allowNull: false,
    validate: {
      isIn: [['active', 'maintenance', 'retired', 'available']],
    },
  },
  new_status: {
    type: DataTypes.ENUM('active', 'maintenance', 'retired', 'available'),
    allowNull: false,
    validate: {
      isIn: [['active', 'maintenance', 'retired', 'available']],
    },
  },
  changed_by: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  odometer_reading: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
    },
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'vehicle_status_log',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false, // This table doesn't have updated_at
  indexes: [
    {
      fields: ['vehicle_id'],
    },
    {
      fields: ['changed_by'],
    },
    {
      fields: ['new_status'],
    },
    {
      fields: ['created_at'],
    },
  ],
});

// Instance methods
VehicleStatusLog.prototype.getStatusChange = function() {
  return `${this.previous_status} → ${this.new_status}`;
};

VehicleStatusLog.prototype.isStatusUpgrade = function() {
  const statusHierarchy = {
    'retired': 0,
    'maintenance': 1,
    'available': 2,
    'active': 3,
  };
  
  return statusHierarchy[this.new_status] > statusHierarchy[this.previous_status];
};

VehicleStatusLog.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = VehicleStatusLog; 