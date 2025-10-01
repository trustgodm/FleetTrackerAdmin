const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserSession = sequelize.define('UserSession', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  session_token: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  ip_address: {
    type: DataTypes.STRING(45), // IPv6 compatible
    allowNull: true,
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
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
  tableName: 'user_sessions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['session_token'],
    },
    {
      fields: ['user_id'],
    },
    {
      fields: ['expires_at'],
    },
    {
      fields: ['is_active'],
    },
  ],
});

// Instance methods
UserSession.prototype.isExpired = function() {
  return new Date() > new Date(this.expires_at);
};

UserSession.prototype.isValid = function() {
  return this.is_active && !this.isExpired();
};

UserSession.prototype.getTimeUntilExpiry = function() {
  const now = new Date();
  const expiry = new Date(this.expires_at);
  return Math.floor((expiry - now) / 1000); // seconds
};

UserSession.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = UserSession; 