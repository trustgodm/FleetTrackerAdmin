import { Button } from "@/components/ui/button";
import { Car, Clock } from "lucide-react";
import { Vehicle } from "@/types/fleet";

interface VehicleCardProps {
  vehicle: Vehicle;
  onViewDetails: (vehicle: Vehicle) => void;
}

export function VehicleCard({ vehicle, onViewDetails }: VehicleCardProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
          <Car className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <div className="font-semibold text-foreground">
            {vehicle.number_plate} - {vehicle.make} {vehicle.model}
          </div>
          <div className="text-sm text-muted-foreground">
            {vehicle.department?.name || 'No Department'}
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-sm text-muted-foreground">
          <div>Driver: {vehicle.assigned_driver?.first_name ? 
            `${vehicle.assigned_driver.first_name} ${vehicle.assigned_driver.last_name}` : 
            "Unassigned"}</div>
          <div>Fuel: {vehicle.fuel_level || 0}%</div>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="w-4 h-4 mr-1" />
          {vehicle.current_odometer || 0} km
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onViewDetails(vehicle)}
        >
          View Details
        </Button>
      </div>
    </div>
  );
}
