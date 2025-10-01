const { Sequelize } = require('sequelize');
const logger = require('./logger');

// Database configuration
const config = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'fleet_tracker_dev',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: false, // Disable SSL for local development
        rejectUnauthorized: false,
      },
      connectTimeout: 3000, // 3 second timeout
    },
    logging: (msg) => logger.debug(msg),
    pool: {
      max: 5,
      min: 0,
      acquire: 10000, // Reduced from 30000
      idle: 5000, // Reduced from 10000
    },
  },
  test: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME_TEST || 'fleet_tracker_test',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: false,
        rejectUnauthorized: false,
      },
      connectTimeout: 3000,
    },
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
      connectTimeout: 10000,
    },
    logging: false,
    pool: {
      max: 10,
      min: 2,
      acquire: 15000,
      idle: 10000,
    },
  },
};

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Create Sequelize instance
const sequelize = new Sequelize(
  dbConfig.database || dbConfig.use_env_variable,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    dialectOptions: dbConfig.dialectOptions,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
    retry: {
      max: 1, // Reduced from 3
      timeout: 3000, // Reduced from 5000
    },
  }
);

// Test database connection (but don't crash if it fails)
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Database connection established successfully.');
    return true;
  } catch (err) {
    logger.warn('⚠️  Unable to connect to database:', err.message);
    logger.warn(`Server will start without database connection (${env} mode)`);
    return false;
  }
};

// Only test connection if we're not in a test environment
if (env !== 'test') {
  testConnection();
}

module.exports = {
  sequelize,
  Sequelize,
  config,
  testConnection,
}; 