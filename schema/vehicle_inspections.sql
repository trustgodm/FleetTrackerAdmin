-- vehicle_inspections.sql

CREATE TABLE vehicle_inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    inspection_type TEXT NOT NULL,
    all_windows_good BOOLEAN NOT NULL DEFAULT FALSE,
    all_lights_good BOOLEAN NOT NULL DEFAULT FALSE,
    all_mirrors_good BOOLEAN NOT NULL DEFAULT FALSE,
    all_doors_good BOOLEAN NOT NULL DEFAULT FALSE,
    all_seats_good BOOLEAN NOT NULL DEFAULT FALSE,
    all_tires_good BOOLEAN NOT NULL DEFAULT FALSE,
    needs_service BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX vehicle_inspections_pkey ON vehicle_inspections(id);
CREATE INDEX idx_vehicle_inspections_trip_id ON vehicle_inspections(trip_id);
CREATE INDEX idx_vehicle_inspections_vehicle_id ON vehicle_inspections(vehicle_id);
CREATE INDEX idx_vehicle_inspections_user_id ON vehicle_inspections(user_id);
CREATE INDEX idx_vehicle_inspections_datetime ON vehicle_inspections(inspection_datetime);
CREATE INDEX idx_vehicle_inspections_type ON vehicle_inspections(inspection_type);