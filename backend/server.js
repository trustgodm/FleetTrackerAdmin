const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

// Set default environment variables if not present
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'your-super-secret-jwt-key-here-change-in-production';
  logger.warn('⚠️  JWT_SECRET not set, using default (change in production)');
}
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
  logger.warn('⚠️  NODE_ENV not set, using development');
}

const { sequelize, testConnection } = require('./config/database');
const logger = require('./config/logger');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const vehicleRoutes = require('./routes/vehicles');
const tripRoutes = require('./routes/trips');
const maintenanceRoutes = require('./routes/maintenance');
const departmentRoutes = require('./routes/departments');
const analyticsRoutes = require('./routes/analytics');
const reportsRoutes = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: process.env.SWAGGER_TITLE || 'FleetTracker API',
      version: process.env.SWAGGER_VERSION || '1.0.0',
      description: process.env.SWAGGER_DESCRIPTION || 'API for FleetTracker-Admin system',
    },
    servers: [
      {
        url: `http://${process.env.BACKEND_URL}/api/v1`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js', './models/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL  ,
 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    database: sequelize.authenticate ? 'Connected' : 'Disconnected',
  });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/trips', tripRoutes);
app.use('/api/v1/maintenance', maintenanceRoutes);
app.use('/api/v1/departments', departmentRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/reports', reportsRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server immediately
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`);
  console.log(`📚 API Documentation: http://${process.env.BACKEND_URL}:${PORT}/api-docs`);
  console.log(`❤️  Health check: http://${process.env.BACKEND_URL}:${PORT}/health`);
});

// Test database connection in background (non-blocking)
setTimeout(async () => {
  try {
    const dbConnected = await testConnection();
    
    if (dbConnected && NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Database synchronized.');
    }
  } catch (error) {
    logger.warn('⚠️  Database features are disabled - API endpoints will return mock data');
    logger.warn('To enable database features:');
    logger.warn('1. Install PostgreSQL');
    logger.warn('2. Create a database');
    logger.warn('3. Update your .env file with database credentials');
    logger.warn('4. Restart the server');
  }
}, 1000); // Wait 1 second before testing database

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  try {
    await sequelize.close();
  } catch (error) {
    logger.warn('Database connection already closed');
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  try {
    await sequelize.close();
  } catch (error) {
    logger.warn('Database connection already closed');
  }
  process.exit(0);
});
