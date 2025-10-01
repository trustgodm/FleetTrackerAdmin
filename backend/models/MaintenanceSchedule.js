const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MaintenanceSchedule = sequelize.define('MaintenanceSchedule', {
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
  maintenance_type: {
    type: DataTypes.ENUM('oil_change', 'tire_rotation', 'brake_service', 'engine_service', 'inspection', 'other'),
    allowNull: false,
    validate: {
      isIn: [['oil_change', 'tire_rotation', 'brake_service', 'engine_service', 'inspection', 'other']],
    },
  },
  Description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
 
  interval_km: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
    },
  },
  interval_months: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
    },
  },
  last_performed_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  next_due_km: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
    },
  },
  next_due_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
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
  tableName: 'maintenance_schedules',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['vehicle_id'],
    },
    {
      fields: ['maintenance_type'],
    },
    {
      fields: ['next_due_date'],
    },
    {
      fields: ['is_active'],
    },
  ],
});

// Instance methods
MaintenanceSchedule.prototype.isOverdue = function() {
  if (!this.next_due_date) return false;
  return new Date() > new Date(this.next_due_date);
};

MaintenanceSchedule.prototype.isDueSoon = function(days = 7) {
  if (!this.next_due_date) return false;
  const dueDate = new Date(this.next_due_date);
  const now = new Date();
  const diffTime = dueDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= days && diffDays >= 0;
};

MaintenanceSchedule.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = MaintenanceSchedule; 