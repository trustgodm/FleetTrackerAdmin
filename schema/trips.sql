-- trips.sql

CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    purpose VARCHAR(100) NOT NULL,
    status trip_status DEFAULT 'active',
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    start_location JSONB NOT NULL,
    end_location JSONB,
    start_odometer INTEGER CHECK (start_odometer >= 0),
    end_odometer INTEGER CHECK (end_odometer >= 0),
    calculated_distance NUMERIC(8,2) CHECK (calculated_distance >= 0),
    damage_report TEXT,
    fuel_level_start INTEGER CHECK (fuel_level_start BETWEEN 0 AND 100),
    fuel_level_end INTEGER CHECK (fuel_level_end BETWEEN 0 AND 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (end_time IS NULL OR end_time >= start_time),
    CHECK (end_odometer IS NULL OR end_odometer >= start_odometer)
);

CREATE UNIQUE INDEX trips_pkey ON trips(id);
CREATE INDEX idx_trips_vehicle_id ON trips(vehicle_id);
CREATE INDEX idx_trips_user_id ON trips(user_id);
CREATE INDEX idx_trips_department_id ON trips(department_id);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_start_time ON trips(start_time);
CREATE INDEX idx_trips_active ON trips(status);
CREATE INDEX idx_trips_location_start ON trips USING GIN(start_location);