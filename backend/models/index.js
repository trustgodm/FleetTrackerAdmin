const { sequelize } = require('../config/database');

// Import models
const User = require('./User');
const Department = require('./Department');
const Vehicle = require('./Vehicle');
const Trip = require('./Trip');
const MaintenanceSchedule = require('./MaintenanceSchedule');
const VehicleInspection = require('./VehicleInspection');
const VehicleStatusLog = require('./VehicleStatusLog');
const UserSession = require('./UserSession');

// Define associations
const defineAssociations = () => {
  // User associations
  User.belongsTo(Department, {
    foreignKey: 'department_id',
    as: 'department',
  });
  User.hasMany(Vehicle, {
    foreignKey: 'assigned_driver_id',
    as: 'assignedVehicles',
  });

  // Department associations
  Department.hasMany(User, {
    foreignKey: 'department_id',
    as: 'users',
  });
  Department.hasMany(Vehicle, {
    foreignKey: 'department_id',
    as: 'vehicles',
  });

  // Vehicle associations
  Vehicle.belongsTo(Department, {
    foreignKey: 'department_id',
    as: 'department',
  });
  Vehicle.belongsTo(User, {
    foreignKey: 'assigned_driver_id',
    as: 'assignedDriver',
  });
  Vehicle.hasMany(Trip, {
    foreignKey: 'vehicle_id',
    as: 'trips',
  });
  Vehicle.hasMany(MaintenanceSchedule, {
    foreignKey: 'vehicle_id',
    as: 'maintenanceSchedules',
  });
  Vehicle.hasMany(VehicleInspection, {
    foreignKey: 'vehicle_id',
    as: 'inspections',
  });
  Vehicle.hasMany(VehicleStatusLog, {
    foreignKey: 'vehicle_id',
    as: 'statusLogs',
  });

  // Trip associations
  Trip.belongsTo(Vehicle, {
    foreignKey: 'vehicle_id',
    as: 'vehicle',
  });
  Trip.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'driver',
  });
  Trip.hasMany(VehicleInspection, {
    foreignKey: 'trip_id',
    as: 'inspections',
  });

  // MaintenanceSchedule associations
  MaintenanceSchedule.belongsTo(Vehicle, {
    foreignKey: 'vehicle_id',
    as: 'vehicle',
  });

  // VehicleInspection associations
  VehicleInspection.belongsTo(Trip, {
    foreignKey: 'trip_id',
    as: 'trip',
  });
  VehicleInspection.belongsTo(Vehicle, {
    foreignKey: 'vehicle_id',
    as: 'vehicle',
  });
  VehicleInspection.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'inspector',
  });

  // VehicleStatusLog associations
  VehicleStatusLog.belongsTo(Vehicle, {
    foreignKey: 'vehicle_id',
    as: 'vehicle',
  });
  VehicleStatusLog.belongsTo(User, {
    foreignKey: 'changed_by',
    as: 'changedBy',
  });

  // UserSession associations
  UserSession.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
  });
};

// Initialize associations
defineAssociations();

module.exports = {
  sequelize,
  User,
  Department,
  Vehicle,
  Trip,
  MaintenanceSchedule,
  VehicleInspection,
  VehicleStatusLog,
  UserSession,
}; 