import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreHorizontal, MapPin, Fuel, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Vehicle {
  id: string;
  name: string;
  number_plate: string;
  make: string;
  model: string;
  status: string;
  fuel_capacity?: number;
  department?: {
    name: string;
    code: string;
  };
  assigned_driver?: {
    first_name: string;
    last_name: string;
  };
  created_at: string;
}

interface VehicleListProps {
  vehicles: Vehicle[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
    case "available":
      return "bg-success text-success-foreground";
    case "maintenance":
      return "bg-warning text-warning-foreground";
    case "retired":
      return "bg-destructive text-destructive-foreground";
    case "idle":
    default:
      return "bg-muted text-muted-foreground";
  }
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''} ago`;
  return `${Math.floor(diffInMinutes / 1440)} day${Math.floor(diffInMinutes / 1440) > 1 ? 's' : ''} ago`;
};

export function VehicleList({ vehicles }: VehicleListProps) {
  // Get the most recent vehicles (limit to 4 for display)
  const recentVehicles = vehicles
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4);

  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground">Recent Vehicles</CardTitle>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {recentVehicles.length > 0 ? (
          <div className="space-y-0">
            {recentVehicles.map((vehicle, index) => (
              <div 
                key={vehicle.id}
                className={`p-4 flex items-center justify-between hover:bg-accent/50 transition-colors ${
                  index !== recentVehicles.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                      {vehicle.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-foreground">{vehicle.number_plate}</span>
                      <Badge className={getStatusColor(vehicle.status)}>
                        {vehicle.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{vehicle.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {vehicle.make} {vehicle.model}
                      {vehicle.department && ` • ${vehicle.department.name}`}
                    </div>
                  </div>
                </div>
                
                <div className="text-right space-y-1">
                  {vehicle.assigned_driver && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {vehicle.assigned_driver.first_name} {vehicle.assigned_driver.last_name}
                    </div>
                  )}
                  {vehicle.fuel_capacity && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Fuel className="h-3 w-3 mr-1" />
                      {vehicle.fuel_capacity}L
                    </div>
                  )}
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTimeAgo(vehicle.created_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            <div className="text-center">
              <div className="text-lg font-medium mb-2">No Vehicles</div>
              <div className="text-sm">No vehicles found in the system</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}