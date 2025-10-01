-- Migration: Add assigned_driver_id column to vehicles table

-- Add the assigned_driver_id column
ALTER TABLE vehicles 
ADD COLUMN assigned_driver_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Create index for the new column
CREATE INDEX idx_vehicles_assigned_driver_id ON vehicles(assigned_driver_id);

-- Add comment to document the column
COMMENT ON COLUMN vehicles.assigned_driver_id IS 'Reference to the user assigned as driver for this vehicle'; 