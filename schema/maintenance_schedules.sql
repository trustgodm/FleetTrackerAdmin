-- maintenance_schedules.sql

CREATE TABLE maintenance_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    maintenance_type maintenance_type NOT NULL,
    description TEXT,
    interval_km INTEGER CHECK (interval_km > 0),
    interval_months INTEGER CHECK (interval_months > 0),
    last_performed_at DATE,
    estimated_cost DECIMAL(10, 2),
    next_due_km INTEGER CHECK (next_due_km > 0),
    next_due_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX maintenance_schedules_pkey ON maintenance_schedules(id);