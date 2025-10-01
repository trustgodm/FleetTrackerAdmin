import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car } from "lucide-react";
import { Vehicle } from "@/types/fleet";

interface VehicleDetailsDialogProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
}

export function VehicleDetailsDialog({ vehicle, isOpen, onClose }: VehicleDetailsDialogProps) {
  if (!vehicle) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="w-5 h-5" />
            Vehicle Details
          </DialogTitle>
          <DialogDescription>
            Comprehensive information about {vehicle.name || 'the vehicle'}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Name:</span>
                    <span>{vehicle.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Number Plate:</span>
                    <span className="font-mono">{vehicle.number_plate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">VIN:</span>
                    <span className="font-mono">{vehicle.vin || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <Badge variant={vehicle.status === 'active' ? 'default' : 'secondary'}>
                      {vehicle.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Department & Assignment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Department:</span>
                    <span>{vehicle.department?.name || 'Not assigned'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Assigned Driver:</span>
                    <span>
                      {vehicle.assigned_driver ? 
                        `${vehicle.assigned_driver.first_name} ${vehicle.assigned_driver.last_name}` : 
                        'Unassigned'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Current Fuel:</span>
                    <span>{vehicle.fuel_level || 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Odometer:</span>
                    <span>{vehicle.current_odometer || 0} km</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Vehicle Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Make:</span>
                    <span>{vehicle.make}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Model:</span>
                    <span>{vehicle.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Year:</span>
                    <span>{vehicle.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Fuel Type:</span>
                    <span className="capitalize">{vehicle.fuel_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Fuel Capacity:</span>
                    <span>{vehicle.fuel_capacity} L</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Registration & Insurance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">License Expiry:</span>
                    <span>
                      {vehicle.license_expiry ? 
                        new Date(vehicle.license_expiry).toLocaleDateString() : 
                        'Not set'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Insurance Expiry:</span>
                    <span>
                      {vehicle.insurance_expiry ? 
                        new Date(vehicle.insurance_expiry).toLocaleDateString() : 
                        'Not set'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Last Service:</span>
                    <span>
                      {vehicle.last_service_date ? 
                        new Date(vehicle.last_service_date).toLocaleDateString() : 
                        'Not set'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Next Service Due:</span>
                    <span>
                      {vehicle.next_service_due ? 
                        new Date(vehicle.next_service_due).toLocaleDateString() : 
                        'Not set'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
