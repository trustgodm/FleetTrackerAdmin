export interface Vehicle {
  id: string;
  name: string;
  number_plate: string;
  vin?: string;
  make: string;
  model: string;
  year: number;
  fuel_type: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  fuel_capacity: number;
  fuel_level?: number;
  current_odometer?: number;
  status: 'active' | 'maintenance' | 'inactive';
  department_id?: string;
  license_expiry?: string;
  insurance_expiry?: string;
  last_service_date?: string;
  next_service_due?: string;
  department?: {
    id: string;
    name: string;
    code: string;
  };
  assigned_driver?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface FleetStats {
  total: number;
  active: number;
  maintenance: number;
  avgFuel: number;
}

export interface NewVehicleFormData {
  name: string;
  number_plate: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  fuel_type: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  fuel_capacity: number;
  department_id: string;
}
