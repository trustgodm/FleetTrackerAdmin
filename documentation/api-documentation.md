# API Documentation

This document outlines all the backend API endpoints required for the FleetTracker-Admin system, including request/response formats and authentication requirements.

## 🔐 Authentication

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication Headers
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### JWT Token Structure
```json
{
  "user_id": "uuid",
  "role": "admin|driver|mechanic|viewer",
  "department_id": "uuid",
  "exp": 1234567890
}
```

## 👥 Users API

### Get All Users
```http
GET /users
```

**Query Parameters:**
- `department_id` (optional): Filter by department
- `role` (optional): Filter by role
- `is_active` (optional): Filter by active status
- `page` (optional): Page number for pagination
- `limit` (optional): Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "coyno_id": "EMP001",
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@company.com",
        "phone": "+27123456789",
        "role": "driver",
        "department_id": "uuid",
        "department_name": "GMO",
        "is_active": true,
        "last_login_at": "2024-01-20T10:30:00Z",
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "pages": 3
    }
  }
}
```

### Get User by ID
```http
GET /users/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "coyno_id": "EMP001",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@company.com",
    "phone": "+27123456789",
    "role": "driver",
    "department_id": "uuid",
    "department_name": "GMO",
    "notifications": true,
    "is_active": true,
    "signature_url": "https://example.com/signature.jpg",
    "last_login_at": "2024-01-20T10:30:00Z",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-20T10:30:00Z"
  }
}
```

### Create User
```http
POST /users
```

**Request Body:**
```json
{
  "coyno_id": "EMP001",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@company.com",
  "phone": "+27123456789",
  "password": "securepassword",
  "role": "driver",
  "department_id": "uuid",
  "notifications": true
}
```

### Update User
```http
PUT /users/{id}
```

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Smith",
  "email": "john.smith@company.com",
  "phone": "+27123456789",
  "role": "driver",
  "department_id": "uuid",
  "notifications": true,
  "is_active": true
}
```

### Delete User
```http
DELETE /users/{id}
```

### User Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "coyno_id": "EMP001"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "uuid",
      "coyno_id": "EMP001",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@company.com",
      "role": "driver",
      "department_id": "uuid",
      "department_name": "GMO"
    }
  }
}
```

### User Logout
```http
POST /auth/logout
```

## 🚗 Vehicles API

### Get All Vehicles
```http
GET /vehicles
```

**Query Parameters:**
- `department_id` (optional): Filter by department
- `status` (optional): Filter by status
- `make` (optional): Filter by make
- `model` (optional): Filter by model
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "vehicles": [
      {
        "id": "uuid",
        "name": "TRP-001",
        "make": "Toyota",
        "model": "Hilux",
        "year": 2022,
        "number_plate": "ABC123GP",
        "vin": "1HGBH41JXMN109186",
        "department_id": "uuid",
        "department_name": "GMO",
        "status": "in_use",
        "qr_code": "vehicle_qr_code_here",
        "photo_url": "https://example.com/vehicle.jpg",
        "current_odometer": 15000,
        "fuel_capacity": 80.0,
        "fuel_type": "diesel",
        "insurance_expiry": "2024-12-31",
        "license_expiry": "2024-06-30",
        "last_service_date": "2024-01-15",
        "next_service_due": "2024-04-15",
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 40,
      "pages": 2
    }
  }
}
```

### Get Vehicle by ID
```http
GET /vehicles/{id}
```

### Create Vehicle
```http
POST /vehicles
```

**Request Body:**
```json
{
  "name": "TRP-001",
  "make": "Toyota",
  "model": "Hilux",
  "year": 2022,
  "number_plate": "ABC123GP",
  "vin": "1HGBH41JXMN109186",
  "department_id": "uuid",
  "fuel_capacity": 80.0,
  "fuel_type": "diesel",
  "insurance_expiry": "2024-12-31",
  "license_expiry": "2024-06-30"
}
```

### Update Vehicle
```http
PUT /vehicles/{id}
```

### Delete Vehicle
```http
DELETE /vehicles/{id}
```

### Update Vehicle Status
```http
PATCH /vehicles/{id}/status
```

**Request Body:**
```json
{
  "status": "under_maintenance",
  "reason": "Scheduled maintenance"
}
```

### Get Vehicle Status History
```http
GET /vehicles/{id}/status-history
```

## 🚀 Trips API

### Get All Trips
```http
GET /trips
```

**Query Parameters:**
- `vehicle_id` (optional): Filter by vehicle
- `user_id` (optional): Filter by driver
- `department_id` (optional): Filter by department
- `status` (optional): Filter by status
- `start_date` (optional): Filter by start date
- `end_date` (optional): Filter by end date
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "trips": [
      {
        "id": "uuid",
        "vehicle_id": "uuid",
        "vehicle_name": "TRP-001",
        "user_id": "uuid",
        "driver_name": "John Doe",
        "department_id": "uuid",
        "department_name": "GMO",
        "purpose": "Material transport",
        "status": "completed",
        "start_time": "2024-01-20T08:00:00Z",
        "end_time": "2024-01-20T16:00:00Z",
        "start_location": {
          "latitude": -26.2023,
          "longitude": 28.0473,
          "address": "Main Depot"
        },
        "end_location": {
          "latitude": -26.1951,
          "longitude": 28.0522,
          "address": "Mining Site A"
        },
        "start_odometer": 15000,
        "end_odometer": 15250,
        "calculated_distance": 250.0,
        "fuel_level_start": 80,
        "fuel_level_end": 65,
        "damage_report": null,
        "created_at": "2024-01-20T08:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

### Get Trip by ID
```http
GET /trips/{id}
```

### Create Trip
```http
POST /trips
```

**Request Body:**
```json
{
  "vehicle_id": "uuid",
  "user_id": "uuid",
  "department_id": "uuid",
  "purpose": "Material transport",
  "start_location": {
    "latitude": -26.2023,
    "longitude": 28.0473,
    "address": "Main Depot"
  },
  "start_odometer": 15000,
  "fuel_level_start": 80
}
```

### Update Trip
```http
PUT /trips/{id}
```

### End Trip
```http
PATCH /trips/{id}/end
```

**Request Body:**
```json
{
  "end_location": {
    "latitude": -26.1951,
    "longitude": 28.0522,
    "address": "Mining Site A"
  },
  "end_odometer": 15250,
  "fuel_level_end": 65,
  "damage_report": "Minor scratch on rear bumper"
}
```

### Get Active Trips
```http
GET /trips/active
```

## 🔧 Maintenance API

### Get All Maintenance Schedules
```http
GET /maintenance
```

**Query Parameters:**
- `vehicle_id` (optional): Filter by vehicle
- `maintenance_type` (optional): Filter by type
- `due_date` (optional): Filter by due date
- `is_active` (optional): Filter by active status
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "maintenance_schedules": [
      {
        "id": "uuid",
        "vehicle_id": "uuid",
        "vehicle_name": "TRP-001",
        "maintenance_type": "oil_change",
        "interval_km": 10000,
        "interval_months": 6,
        "last_performed_at": "2024-01-15",
        "next_due_km": 25000,
        "next_due_date": "2024-04-15",
        "is_active": true,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  }
}
```

### Get Maintenance by ID
```http
GET /maintenance/{id}
```

### Create Maintenance Schedule
```http
POST /maintenance
```

**Request Body:**
```json
{
  "vehicle_id": "uuid",
  "maintenance_type": "oil_change",
  "interval_km": 10000,
  "interval_months": 6
}
```

### Update Maintenance Schedule
```http
PUT /maintenance/{id}
```

### Mark Maintenance as Performed
```http
PATCH /maintenance/{id}/performed
```

**Request Body:**
```json
{
  "performed_date": "2024-01-20",
  "notes": "Oil change completed successfully"
}
```

### Get Due Maintenance
```http
GET /maintenance/due
```

## 🔍 Inspections API

### Get All Inspections
```http
GET /inspections
```

**Query Parameters:**
- `vehicle_id` (optional): Filter by vehicle
- `trip_id` (optional): Filter by trip
- `user_id` (optional): Filter by inspector
- `inspection_type` (optional): Filter by type
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "inspections": [
      {
        "id": "uuid",
        "trip_id": "uuid",
        "vehicle_id": "uuid",
        "vehicle_name": "TRP-001",
        "user_id": "uuid",
        "inspector_name": "John Doe",
        "inspection_type": "pre_trip",
        "all_windows_good": true,
        "all_lights_good": true,
        "all_mirrors_good": true,
        "all_doors_good": true,
        "all_seats_good": true,
        "all_tires_good": true,
        "needs_service": false,
        "notes": "Vehicle in good condition",
        "inspection_datetime": "2024-01-20T08:00:00Z",
        "created_at": "2024-01-20T08:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 200,
      "pages": 10
    }
  }
}
```

### Get Inspection by ID
```http
GET /inspections/{id}
```

### Create Inspection
```http
POST /inspections
```

**Request Body:**
```json
{
  "trip_id": "uuid",
  "vehicle_id": "uuid",
  "user_id": "uuid",
  "inspection_type": "pre_trip",
  "all_windows_good": true,
  "all_lights_good": true,
  "all_mirrors_good": true,
  "all_doors_good": true,
  "all_seats_good": true,
  "all_tires_good": true,
  "needs_service": false,
  "notes": "Vehicle in good condition"
}
```

### Update Inspection
```http
PUT /inspections/{id}
```

## 🏢 Departments API

### Get All Departments
```http
GET /departments
```

**Response:**
```json
{
  "success": true,
  "data": {
    "departments": [
      {
        "id": "uuid",
        "code": "GMO",
        "name": "General Mining Operations",
        "description": "Main mining operations department",
        "is_active": true,
        "vehicle_count": 15,
        "user_count": 18,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### Get Department by ID
```http
GET /departments/{id}
```

### Create Department
```http
POST /departments
```

**Request Body:**
```json
{
  "code": "GMO",
  "name": "General Mining Operations",
  "description": "Main mining operations department"
}
```

### Update Department
```http
PUT /departments/{id}
```

### Delete Department
```http
DELETE /departments/{id}
```

## 📊 Analytics API

### Get Fleet Overview
```http
GET /analytics/fleet-overview
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_vehicles": 40,
    "active_vehicles": 32,
    "maintenance_vehicles": 3,
    "out_of_service": 5,
    "total_users": 48,
    "active_trips": 18,
    "completed_trips_today": 25,
    "fuel_consumption_month": 6240,
    "maintenance_cost_month": 47850
  }
}
```

### Get Department Analytics
```http
GET /analytics/department/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "department": {
      "id": "uuid",
      "name": "GMO",
      "vehicle_count": 15,
      "active_vehicles": 12,
      "user_count": 18,
      "fuel_consumption": 2450,
      "maintenance_cost": 18500,
      "trip_count_month": 150,
      "efficiency_score": 92
    },
    "vehicles": [
      {
        "id": "uuid",
        "name": "TRP-001",
        "status": "in_use",
        "last_trip": "2024-01-20T16:00:00Z",
        "fuel_level": 65,
        "next_service": "2024-04-15"
      }
    ],
    "recent_trips": [
      {
        "id": "uuid",
        "vehicle_name": "TRP-001",
        "driver_name": "John Doe",
        "start_time": "2024-01-20T08:00:00Z",
        "end_time": "2024-01-20T16:00:00Z",
        "distance": 250.0
      }
    ]
  }
}
```

### Get Fuel Analytics
```http
GET /analytics/fuel
```

**Query Parameters:**
- `department_id` (optional): Filter by department
- `start_date` (optional): Start date for range
- `end_date` (optional): End date for range

**Response:**
```json
{
  "success": true,
  "data": {
    "total_consumption": 6240,
    "average_efficiency": 12.5,
    "cost_per_liter": 15.02,
    "total_cost": 93725,
    "by_department": [
      {
        "department_name": "GMO",
        "consumption": 2450,
        "cost": 36765,
        "efficiency": 12.8
      }
    ],
    "by_vehicle": [
      {
        "vehicle_name": "TRP-001",
        "consumption": 125.4,
        "efficiency": 13.2
      }
    ]
  }
}
```

### Get Maintenance Analytics
```http
GET /analytics/maintenance
```

**Response:**
```json
{
  "success": true,
  "data": {
    "completed_this_month": 24,
    "in_progress": 5,
    "overdue": 2,
    "total_cost": 47850,
    "by_type": [
      {
        "type": "oil_change",
        "count": 12,
        "cost": 24000
      }
    ],
    "by_department": [
      {
        "department_name": "GMO",
        "count": 8,
        "cost": 18500
      }
    ]
  }
}
```

## 🔍 Search API

### Search Vehicles
```http
GET /search/vehicles
```

**Query Parameters:**
- `q` (required): Search query
- `department_id` (optional): Filter by department
- `status` (optional): Filter by status

### Search Users
```http
GET /search/users
```

**Query Parameters:**
- `q` (required): Search query
- `role` (optional): Filter by role
- `department_id` (optional): Filter by department

### Search Trips
```http
GET /search/trips
```

**Query Parameters:**
- `q` (required): Search query
- `status` (optional): Filter by status
- `start_date` (optional): Filter by start date
- `end_date` (optional): Filter by end date

## 📄 Export API

### Export Vehicle Data
```http
GET /export/vehicles
```

**Query Parameters:**
- `format` (optional): csv, xlsx, pdf (default: csv)
- `department_id` (optional): Filter by department
- `status` (optional): Filter by status

### Export Trip Data
```http
GET /export/trips
```

**Query Parameters:**
- `format` (optional): csv, xlsx, pdf (default: csv)
- `start_date` (optional): Start date for range
- `end_date` (optional): End date for range
- `vehicle_id` (optional): Filter by vehicle

### Export Maintenance Data
```http
GET /export/maintenance
```

**Query Parameters:**
- `format` (optional): csv, xlsx, pdf (default: csv)
- `vehicle_id` (optional): Filter by vehicle
- `maintenance_type` (optional): Filter by type

## ⚠️ Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "message": "Email is required"
    }
  }
}
```

### Common Error Codes
- `AUTHENTICATION_ERROR`: Invalid or missing authentication
- `AUTHORIZATION_ERROR`: Insufficient permissions
- `VALIDATION_ERROR`: Invalid input data
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource already exists
- `INTERNAL_ERROR`: Server error

## 🔒 Authorization

### Role-based Access Control

| Endpoint | Admin | Driver | Mechanic | Viewer |
|----------|-------|--------|----------|--------|
| GET /users | ✅ | ❌ | ❌ | ❌ |
| POST /users | ✅ | ❌ | ❌ | ❌ |
| GET /vehicles | ✅ | ✅ | ✅ | ✅ |
| POST /vehicles | ✅ | ❌ | ❌ | ❌ |
| GET /trips | ✅ | ✅ | ✅ | ✅ |
| POST /trips | ✅ | ✅ | ❌ | ❌ |
| GET /maintenance | ✅ | ✅ | ✅ | ✅ |
| POST /maintenance | ✅ | ❌ | ✅ | ❌ |
| GET /analytics | ✅ | ❌ | ❌ | ✅ |

### Department-based Access
- Users can only access data from their assigned department
- Admins can access all departments
- Department managers can access their department data 