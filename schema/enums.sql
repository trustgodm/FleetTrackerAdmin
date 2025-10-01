-- enums.sql

CREATE TYPE vehicle_status AS ENUM ('available', 'in_use', 'under_maintenance', 'out_of_service');
CREATE TYPE trip_status AS ENUM ('active', 'completed', 'cancelled');
CREATE TYPE user_role AS ENUM ('admin', 'driver', 'mechanic', 'viewer');
CREATE TYPE fuel_type AS ENUM ('gasoline', 'diesel', 'electric', 'hybrid');
