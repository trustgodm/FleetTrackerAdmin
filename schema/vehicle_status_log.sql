-- vehicle_status_log.sql

CREATE TABLE vehicle_status_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    previous_status vehicle_status,
    new_status vehicle_status NOT NULL,
    changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reason VARCHAR(255),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX vehicle_status_log_pkey ON vehicle_status_log(id);
CREATE INDEX idx_vehicle_status_log_vehicle_id ON vehicle_status_log(vehicle_id);
CREATE INDEX idx_vehicle_status_log_changed_at ON vehicle_status_log(changed_at);
CREATE INDEX idx_vehicle_status_log_changed_by ON vehicle_status_log(changed_by);