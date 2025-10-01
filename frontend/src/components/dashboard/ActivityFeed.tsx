import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, Car, Fuel, Wrench, MapPin, UserCheck, Play, Square } from "lucide-react";

interface Trip {
  id: string;
  vehicle_id: string;
  driver_id?: string;
  start_time: string;
  end_time?: string;
  status: string;
  start_odometer?: number;
  end_odometer?: number;
  fuel_level_start?: number;
  fuel_level_end?: number;
  vehicle?: {
    name: string;
    number_plate: string;
  };
  driver?: {
    first_name: string;
    last_name: string;
  };
}

interface Vehicle {
  id: string;
  name: string;
  number_plate: string;
  status: string;
}

interface ActivityFeedProps {
  trips: Trip[];
  vehicles: Vehicle[];
}

const getActivityColor = (type: string) => {
  switch (type) {
    case "trip_started":
    case "trip_completed":
      return "text-success";
    case "maintenance":
      return "text-primary";
    case "fuel_alert":
      return "text-warning";
    case "location_update":
      return "text-muted-foreground";
    default:
      return "text-muted-foreground";
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

export function ActivityFeed({ trips, vehicles }: ActivityFeedProps) {
  // Generate activities from trips and vehicles
  const generateActivities = () => {
    const activities = [];

    // Add trip activities
    trips.forEach(trip => {
      if (trip.status === 'active') {
        activities.push({
          id: `trip-${trip.id}-start`,
          type: "trip_started",
          user: trip.driver ? `${trip.driver.first_name} ${trip.driver.last_name}` : "Unknown Driver",
          vehicle: trip.vehicle?.number_plate || trip.vehicle_id,
          department: "Fleet Operations",
          message: "started a new trip",
          timestamp: trip.start_time,
          icon: Play
        });
      } else if (trip.status === 'completed' && trip.end_time) {
        activities.push({
          id: `trip-${trip.id}-end`,
          type: "trip_completed",
          user: trip.driver ? `${trip.driver.first_name} ${trip.driver.last_name}` : "Unknown Driver",
          vehicle: trip.vehicle?.number_plate || trip.vehicle_id,
          department: "Fleet Operations",
          message: "completed trip",
          timestamp: trip.end_time,
          icon: Square
        });
      }
    });

    // Add vehicle status changes
    vehicles.forEach(vehicle => {
      if (vehicle.status === 'maintenance') {
        activities.push({
          id: `vehicle-${vehicle.id}-maintenance`,
          type: "maintenance",
          user: "System",
          vehicle: vehicle.number_plate,
          department: "Maintenance",
          message: "vehicle scheduled for maintenance",
          timestamp: new Date().toISOString(), // Use current time as fallback
          icon: Wrench
        });
      }
    });

    // Sort by timestamp (most recent first) and limit to 5
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  };

  const activities = generateActivities();

  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardHeader>
        <CardTitle className="text-foreground">Recent Activities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => {
            const IconComponent = activity.icon;
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`flex-shrink-0 p-2 rounded-full bg-accent ${getActivityColor(activity.type)}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-foreground">{activity.user}</span>
                    <span className="text-xs text-muted-foreground">#{activity.vehicle}</span>
                    <span className="text-xs px-2 py-1 bg-secondary rounded text-secondary-foreground">
                      {activity.department}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{activity.message}</p>
                  <div className="flex items-center mt-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTimeAgo(activity.timestamp)}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            <div className="text-center">
              <div className="text-lg font-medium mb-2">No Recent Activity</div>
              <div className="text-sm">No recent trips or activities found</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}