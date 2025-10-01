# FleetTracker Admin

A comprehensive fleet management system built with React, Node.js, and PostgreSQL. This application provides complete fleet tracking, maintenance scheduling, trip management, and analytics capabilities for organizations managing vehicle fleets.

## 🚀 Features

### Core Functionality
- **Fleet Management**: Complete vehicle inventory with status tracking
- **Trip Management**: Real-time trip tracking and history
- **Maintenance Scheduling**: Automated maintenance reminders and tracking
- **User Management**: Role-based access control (Admin, Manager, Driver, Mechanic)
- **Analytics & Reporting**: Comprehensive fleet analytics and reporting
- **Department Management**: Multi-department fleet organization

### Technical Features
- **Modern Frontend**: React 18 with TypeScript and Vite
- **RESTful API**: Node.js/Express backend with Swagger documentation
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT-based authentication with session management
- **Security**: Helmet, CORS, rate limiting, input validation
- **UI Components**: shadcn/ui with Tailwind CSS
- **Real-time Updates**: Live data updates and notifications

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **shadcn/ui** component library
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Hook Form** for form management
- **Recharts** for data visualization

### Backend
- **Node.js** with Express
- **PostgreSQL** database
- **Sequelize** ORM
- **JWT** authentication
- **Swagger** API documentation
- **Winston** logging
- **bcryptjs** password hashing

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd FleetTrackerAdmin
```

### 2. Backend Setup
```bash
cd backend
npm install
cp env.example .env
```

**Configure your `.env` file:**
```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
DB_HOST=your-database-host
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
```

### 3. Database Setup
```bash
# Create database
createdb fleet_tracker

# Run schema migrations
psql -d fleet_tracker -f schema/enums.sql
psql -d fleet_tracker -f schema/departments.sql
psql -d fleet_tracker -f schema/users.sql
psql -d fleet_tracker -f schema/vehicles.sql
psql -d fleet_tracker -f schema/trips.sql
psql -d fleet_tracker -f schema/maintenance_schedules.sql
psql -d fleet_tracker -f schema/vehicle_inspections.sql
psql -d fleet_tracker -f schema/vehicle_status_log.sql
psql -d fleet_tracker -f schema/user_sessions.sql
```

### 4. Start Backend Server
```bash
cd backend
npm run dev
```

### 5. Frontend Setup
```bash
cd frontend
npm install
```

### 6. Start Frontend Development Server
```bash
cd frontend
npm run dev
```

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

## 🔐 Security Considerations

### ⚠️ Important Security Notes

1. **Environment Variables**: Never commit `.env` files to version control
2. **JWT Secret**: Use a strong, unique JWT secret in production
3. **Database Credentials**: Use strong passwords and secure database connections
4. **CORS Configuration**: Update CORS origins for production deployment
5. **Rate Limiting**: Configure appropriate rate limits for your use case

### Security Features Implemented
- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- Helmet.js security headers
- CORS protection
- SQL injection prevention via Sequelize ORM

## 🏗 Project Structure

```
FleetTrackerAdmin/
├── backend/                 # Node.js/Express API
│   ├── config/             # Database and logger configuration
│   ├── middleware/         # Authentication and error handling
│   ├── models/            # Sequelize database models
│   ├── routes/            # API route handlers
│   ├── seeders/           # Database seeders
│   └── server.js          # Main server file
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── services/      # API service layer
│   │   ├── types/         # TypeScript type definitions
│   │   └── hooks/         # Custom React hooks
│   └── public/            # Static assets
├── schema/                # Database schema files
├── documentation/         # Project documentation
└── README.md
```

## 🚀 Deployment

### Frontend (Vercel)
The frontend is configured for Vercel deployment with `vercel.json`.

### Backend
Deploy to your preferred Node.js hosting service (Heroku, Railway, DigitalOcean, etc.).

## 📖 Documentation

- [API Documentation](documentation/api-documentation.md)
- [Current Capabilities](documentation/current-capabilities.md)
- [Frontend Components](documentation/frontend-components.md)
- [Technical Specifications](documentation/technical-specs.md)
- [Implementation Plan](documentation/implementation-plan.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please refer to the documentation or create an issue in the repository.

---

**Note**: This is a development version. Ensure all environment variables are properly configured before production deployment.