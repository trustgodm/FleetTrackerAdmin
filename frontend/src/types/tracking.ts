export interface Trip {
  id: string;
  vehicle_id: string;
  user_id: string;
  driver_id?: string;
  purpose?: string;
  trip_purpose?: string;
  start_time: string;
  end_time?: string;
  start_odometer?: number;
  end_odometer?: number;
  fuel_level_start?: number;
  fuel_level_end?: number;
  calculated_distance?: number;
  damage_report?: string;
  status: 'active' | 'completed' | 'cancelled';
  created_at?: string;
  updated_at?: string;
  vehicle?: {
    id: string;
    number_plate: string;
    make: string;
    model: string;
    year: number;
  };
  driver?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  inspections?: Array<{
    id: string;
    inspection_type: string;
    all_windows_good: boolean;
    all_mirrors_good: boolean;
    all_tires_good: boolean;
    all_lights_good: boolean;
    all_doors_good: boolean;
    all_seats_good: boolean;
    needs_service: boolean;
    notes?: string;
    created_at: string;
  }>;
}

export interface TripStats {
  active: number;
  completed: number;
  avgDuration: number;
  totalDistance: number;
}

export interface EndTripFormData {
  end_location: string;
  end_odometer: string;
  fuel_level_end: string;
  notes: string;
}
