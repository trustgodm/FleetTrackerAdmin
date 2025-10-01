export interface MaintenanceSchedule {
  id: string;
  vehicle_id: string;
  maintenance_type: string;
  description?: string;
  interval_km?: number;
  interval_months?: number;
  last_performed_at?: string;
  last_service_odometer?: number;
  next_due_date?: string;
  next_due_odometer?: number;
  estimated_cost?: number;
  actual_cost?: number;
  notes?: string;
  vehicle?: {
    id: string;
    number_plate: string;
    make: string;
    model: string;
    year: number;
    current_odometer: number;
  };
}

export interface Vehicle {
  id: string;
  number_plate: string;
  make: string;
  model: string;
  year: number;
  current_odometer: number;
}

export interface MaintenanceStats {
  total: number;
  overdue: number;
  dueSoon: number;
  completed: number;
}

export interface ScheduleMaintenanceFormData {
  vehicle_id: string;
  maintenance_type: string;
  description: string;
  interval_km: string;
  interval_months: string;
  next_due_date: string;
  next_due_odometer: string;
  estimated_cost: string;
}

export interface EditMaintenanceFormData {
  maintenance_type: string;
  description: string;
  interval_km: string;
  interval_months: string;
  next_due_date: string;
  next_due_odometer: string;
  estimated_cost: string;
}

export interface CompleteMaintenanceFormData {
  actual_cost: string;
  notes: string;
}

export interface MaintenanceType {
  value: string;
  label: string;
}

export const MAINTENANCE_TYPES: MaintenanceType[] = [
  { value: 'oil_change', label: 'Oil Change' },
  { value: 'tire_rotation', label: 'Tire Rotation' },
  { value: 'brake_service', label: 'Brake Service' },
  { value: 'engine_service', label: 'Engine Service' },
  { value: 'inspection', label: 'Inspection' },
  { value: 'other', label: 'Other' }
];
