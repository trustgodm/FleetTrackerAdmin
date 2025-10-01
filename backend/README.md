# FleetTracker Backend API

A comprehensive REST API for the FleetTracker-Admin system built with Node.js, Express, Sequelize, and PostgreSQL.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Database Management**: Sequelize ORM with PostgreSQL (NeonDB)
- **API Documentation**: Swagger/OpenAPI documentation
- **Security**: Helmet, CORS, rate limiting, input validation
- **Logging**: Winston logger with file and console output
- **Error Handling**: Comprehensive error handling middleware
- **Validation**: Express-validator for request validation

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database (NeonDB recommended)
- npm or yarn package manager

## 🛠 Installation

1. **Clone the repository and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=3000

   # Database Configuration (NeonDB PostgreSQL)
   DB_HOST=your-neon-db-host.neon.tech
   DB_PORT=5432
   DB_NAME=your-database-name
   DB_USER=your-database-user
   DB_PASSWORD=your-database-password
   DATABASE_URL=postgresql://user:password@host:port/database

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=24h

   # API Configuration
   API_VERSION=v1
   CORS_ORIGIN=http://localhost:8086

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100

   # Logging
   LOG_LEVEL=info
   LOG_FILE=logs/app.log

   # Swagger Configuration
   SWAGGER_TITLE=FleetTracker API
   SWAGGER_VERSION=1.0.0
   SWAGGER_DESCRIPTION=API for FleetTracker-Admin system
   ```

4. **Create logs directory**
   ```bash
   mkdir logs
   ```

## 🗄 Database Setup

### Option 1: Using NeonDB (Recommended)

1. Create a NeonDB account at [neon.tech](https://neon.tech)
2. Create a new project
3. Get your connection string and update the `.env` file
4. The database will be automatically created when you first run the application

### Option 2: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database named `fleet_tracker`
3. Update the `.env` file with local connection details

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Database Operations
```bash
# Run migrations
npm run db:migrate

# Seed the database
npm run db:seed

# Reset database (drop, create, migrate, seed)
npm run db:reset
```

## 📚 API Documentation

Once the server is running, you can access the API documentation at:
- **Swagger UI**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles
- `admin`: Full access to all features
- `manager`: Can manage vehicles, trips, and users
- `driver`: Can view and update trip information
- `mechanic`: Can manage maintenance schedules

## 📁 Project Structure

```
backend/
├── config/
│   ├── database.js      # Database configuration
│   └── logger.js        # Winston logger setup
├── middleware/
│   ├── auth.js          # JWT authentication middleware
│   └── errorHandler.js  # Global error handling
├── models/
│   ├── index.js         # Model associations
│   ├── User.js          # User model
│   ├── Department.js    # Department model
│   ├── Vehicle.js       # Vehicle model
│   ├── Trip.js          # Trip model
│   ├── MaintenanceSchedule.js
│   ├── VehicleInspection.js
│   ├── VehicleStatusLog.js
│   └── UserSession.js
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── users.js         # User management
│   ├── vehicles.js      # Vehicle management
│   ├── trips.js         # Trip management
│   ├── maintenance.js   # Maintenance management
│   ├── departments.js   # Department management
│   └── analytics.js     # Analytics routes
├── logs/                # Application logs
├── server.js            # Main application file
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## 🔧 Available Scripts

- `npm start`: Start the production server
- `npm run dev`: Start the development server with nodemon
- `npm test`: Run tests
- `npm run db:migrate`: Run database migrations
- `npm run db:seed`: Seed the database with sample data
- `npm run db:reset`: Reset the database (drop, create, migrate, seed)

## 🛡 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing configuration
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Request validation using express-validator
- **Password Hashing**: bcryptjs for password security
- **JWT**: Secure token-based authentication

## 📊 Logging

The application uses Winston for logging with the following features:
- Console logging in development
- File logging in production
- Error log separation
- Log rotation and size limits

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Environment Variables for Production
Make sure to set the following environment variables in production:
- `NODE_ENV=production`
- `DATABASE_URL`: Your production database URL
- `JWT_SECRET`: A strong secret key
- `CORS_ORIGIN`: Your frontend domain

### Docker Deployment
```bash
# Build the Docker image
docker build -t fleet-tracker-backend .

# Run the container
docker run -p 3000:3000 fleet-tracker-backend
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository. 