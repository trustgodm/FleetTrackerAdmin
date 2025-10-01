-- vehicles.sql

CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM NOW()) + 2),
    number_plate VARCHAR(20) UNIQUE NOT NULL,
    vin VARCHAR(17) UNIQUE NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    assigned_driver_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status vehicle_status DEFAULT 'available',
    qr_code VARCHAR(100) UNIQUE NOT NULL,
    photo_url VARCHAR(500),
    current_odometer INTEGER DEFAULT 0 CHECK (current_odometer >= 0),
    fuel_capacity NUMERIC(5,2) CHECK (fuel_capacity > 0),
    fuel_type fuel_type,
    insurance_expiry DATE,
    license_expiry DATE,
    last_service_date DATE,
    next_service_due DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX vehicles_pkey ON vehicles(id);
CREATE UNIQUE INDEX vehicles_number_plate_key ON vehicles(number_plate);
CREATE UNIQUE INDEX vehicles_vin_key ON vehicles(vin);
CREATE UNIQUE INDEX vehicles_qr_code_key ON vehicles(qr_code);
CREATE INDEX idx_vehicles_department_id ON vehicles(department_id);
CREATE INDEX idx_vehicles_assigned_driver_id ON vehicles(assigned_driver_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_number_plate ON vehicles(number_plate);
CREATE INDEX idx_vehicles_qr_code ON vehicles(qr_code);
CREATE INDEX idx_vehicles_service_due ON vehicles(next_service_due);