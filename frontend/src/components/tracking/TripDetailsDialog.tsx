import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Navigation, X } from "lucide-react";
import { Trip } from "@/types/tracking";

interface TripDetailsDialogProps {
  trip: Trip | null;
  isOpen: boolean;
  onClose: () => void;
  onEndTrip?: (trip: Trip) => void;
  calculateDistance: (trip: Trip) => number;
  calculateDuration: (startTime: string, endTime?: string) => number;
  calculateFuelConsumption: (trip: Trip) => number;
}

export function TripDetailsDialog({ 
  trip, 
  isOpen, 
  onClose, 
  onEndTrip,
  calculateDistance,
  calculateDuration,
  calculateFuelConsumption
}: TripDetailsDialogProps) {
  if (!trip) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5" />
            Trip Details
          </DialogTitle>
          <DialogDescription>
            View detailed information about this trip
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Vehicle</Label>
              <p className="text-sm">{trip.vehicle?.number_plate} - {trip.vehicle?.make} {trip.vehicle?.model}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Driver</Label>
              <p className="text-sm">{trip.driver?.first_name} {trip.driver?.last_name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Trip Purpose</Label>
              <p className="text-sm">{trip.trip_purpose || trip.purpose || 'Not specified'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Status</Label>
              <Badge variant={trip.status === 'active' ? 'default' : 'secondary'}>
                {trip.status}
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Start Time</Label>
              <p className="text-sm">{new Date(trip.start_time).toLocaleString()}</p>
            </div>
            {trip.end_time && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">End Time</Label>
                <p className="text-sm">{new Date(trip.end_time).toLocaleString()}</p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Distance</Label>
              <p className="text-sm">{calculateDistance(trip).toFixed(1)} km</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Duration</Label>
              <p className="text-sm">{calculateDuration(trip.start_time, trip.end_time)} minutes</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Fuel Used</Label>
              <p className="text-sm">{calculateFuelConsumption(trip)}%</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Start Odometer</Label>
              <p className="text-sm">{trip.start_odometer || 0} km</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">End Odometer</Label>
              <p className="text-sm">{trip.end_odometer || 0} km</p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
          {trip.status === 'active' && onEndTrip && (
            <Button variant="outline" onClick={() => onEndTrip(trip)}>
              End Trip
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
