import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation, Eye } from "lucide-react";
import { Trip } from "@/types/tracking";

interface TripCardProps {
  trip: Trip;
  onViewDetails: (trip: Trip) => void;
  showFullDetails?: boolean;
  calculateDistance: (trip: Trip) => number;
  calculateDuration: (startTime: string, endTime?: string) => number;
  calculateFuelConsumption: (trip: Trip) => number;
}

export function TripCard({ 
  trip, 
  onViewDetails, 
  showFullDetails = false,
  calculateDistance,
  calculateDuration,
  calculateFuelConsumption
}: TripCardProps) {
  if (!showFullDetails) {
    // Simple card for active trips
    return (
      <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Navigation className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <div className="font-semibold text-foreground">
              {trip.vehicle?.number_plate} - {trip.driver?.first_name} {trip.driver?.last_name}
            </div>
            <div className="text-sm text-muted-foreground">{trip.trip_purpose || trip.purpose || 'No purpose specified'}</div>
            <div className="text-xs text-muted-foreground">Started: {new Date(trip.start_time).toLocaleString()}</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant="default">
            {trip.status}
          </Badge>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewDetails(trip)}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </div>
      </div>
    );
  }

  // Detailed card for trip history
  const startDate = new Date(trip.start_time).toLocaleDateString();
  const startTime = new Date(trip.start_time).toLocaleTimeString();
  const endTime = trip.end_time ? new Date(trip.end_time).toLocaleTimeString() : 'Ongoing';

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-background/50">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Navigation className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h4 className="font-semibold text-lg">{trip.driver?.first_name} {trip.driver?.last_name}</h4>
            <p className="text-sm text-muted-foreground">Vehicle: {trip.vehicle?.number_plate}</p>
            <p className="text-sm text-muted-foreground">Purpose: {trip.trip_purpose || trip.purpose || 'Not specified'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={trip.status === 'completed' ? 'default' : 'secondary'}>
            {trip.status}
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewDetails(trip)}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </div>
      </div>

      {/* Trip Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="font-medium">Date:</span>
          <p>{startDate}</p>
        </div>
        <div>
          <span className="font-medium">Time:</span>
          <p>{startTime} - {endTime}</p>
        </div>
        <div>
          <span className="font-medium">Distance:</span>
          <p>{calculateDistance(trip).toFixed(1)} km</p>
        </div>
        <div>
          <span className="font-medium">Duration:</span>
          <p>{calculateDuration(trip.start_time, trip.end_time)}m</p>
        </div>
      </div>

      {/* Fuel and Odometer Information */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="font-medium">Start Odometer:</span>
          <p>{trip.start_odometer || 0} km</p>
        </div>
        <div>
          <span className="font-medium">End Odometer:</span>
          <p>{trip.end_odometer || 'N/A'} km</p>
        </div>
        <div>
          <span className="font-medium">Fuel Start:</span>
          <p>{trip.fuel_level_start !== null ? `${trip.fuel_level_start}%` : 'N/A'}</p>
        </div>
        <div>
          <span className="font-medium">Fuel Used:</span>
          <p>{calculateFuelConsumption(trip)}%</p>
        </div>
      </div>

      {/* Damage Report */}
      {trip.damage_report && trip.damage_report !== '""' && (
        <div>
          <span className="font-medium">Damage Report:</span>
          <p className="text-sm text-red-600">{trip.damage_report}</p>
        </div>
      )}
    </div>
  );
}
