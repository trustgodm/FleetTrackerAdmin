const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Vehicle = sequelize.define('Vehicle', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100],
    },
  },
  number_plate: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [1, 20],
    },
  },
  vin: {
    type: DataTypes.STRING(17),
    allowNull: true,
    unique: true,
    validate: {
      len: [0, 17],
    },
  },
  qr_code: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true,
  },
  make: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 50],
    },
  },
  model: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 50],
    },
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1900,
      max: new Date().getFullYear() + 1,
    },
  },
  fuel_type: {
    type: DataTypes.ENUM('petrol', 'diesel', 'electric', 'hybrid'),
    allowNull: false,
    defaultValue: 'petrol',
    validate: {
      isIn: [['petrol', 'diesel', 'electric', 'hybrid']],
    },
  },
  fuel_capacity: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  status: {
    type: DataTypes.ENUM('active', 'maintenance', 'retired', 'available'),
    allowNull: false,
    defaultValue: 'available',
    validate: {
      isIn: [['active', 'maintenance', 'retired', 'available']],
    },
  },
  current_odometer: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },
  next_service_due: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  license_expiry:{
    type: DataTypes.DATE,
    allowNull: true,
  },
  insurance_expiry:{
    type: DataTypes.DATE,
    allowNull: true,
  },
  last_service_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  photo_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  
  department_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'departments',
      key: 'id',
    },
  },
  
  assigned_driver_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
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
  tableName: 'vehicles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['number_plate'],
    },
    {
      unique: true,
      fields: ['vin'],
    },
    {
      unique: true,
      fields: ['qr_code'],
    },
    {
      fields: ['department_id'],
    },
    {
      fields: ['status'],
    },

  ],
});

// Instance methods
Vehicle.prototype.getFullName = function() {
  return `${this.year} ${this.make} ${this.model}`;
};

Vehicle.prototype.isAvailable = function() {
  return this.status === 'available';
};

Vehicle.prototype.needsService = function() {
  return this.current_odometer >= (this.next_service_due || 0);
};

Vehicle.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = Vehicle; 