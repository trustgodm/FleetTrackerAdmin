import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Users, 
  Fuel, 
  Clock, 
  MessageSquare,
  UserPlus,
  CheckCircle,
  Calendar,
  Wrench
} from "lucide-react";

interface Vehicle {
  id: string;
  name: string;
  number_plate: string;
  status: string;
  fuel_capacity?: number;
  department_id?: string; // Added for department status
}

interface Department {
  id: string;
  name: string;
  code: string;
  vehicles?: Vehicle[];
}

interface NotificationPanelProps {
  vehicles: Vehicle[];
  departments: Department[];
}

export function NotificationPanel({ vehicles, departments }: NotificationPanelProps) {
  // Calculate statistics
  const activeVehicles = vehicles.filter(v => v.status === 'active' || v.status === 'available').length;
  const maintenanceVehicles = vehicles.filter(v => v.status === 'maintenance').length;
  const lowFuelVehicles = vehicles.filter(v => v.fuel_capacity && v.fuel_capacity < 25).length;

  // Generate notifications based on real data
  const generateNotifications = () => {
    const notifications = [];

    // Low fuel alerts
    if (lowFuelVehicles > 0) {
      notifications.push({
        id: 'low-fuel',
        type: "alert",
        title: "Low Fuel Alert",
        message: `${lowFuelVehicles} vehicle${lowFuelVehicles > 1 ? 's' : ''} have fuel levels below 25%`,
        time: "Just now",
        icon: Fuel,
        color: "text-warning"
      });
    }

    // Maintenance alerts
    if (maintenanceVehicles > 0) {
      notifications.push({
        id: 'maintenance',
        type: "maintenance",
        title: "Maintenance Required",
        message: `${maintenanceVehicles} vehicle${maintenanceVehicles > 1 ? 's' : ''} in maintenance`,
        time: "Recently",
        icon: Wrench,
        color: "text-primary"
      });
    }

    // Department status
    departments.forEach(dept => {
      const deptVehicles = vehicles.filter(v => v.department_id === dept.id);
      const activeDeptVehicles = deptVehicles.filter(v => v.status === 'active' || v.status === 'available').length;
      
      if (activeDeptVehicles > 0) {
        notifications.push({
          id: `dept-${dept.id}`,
          type: "info",
          title: `${dept.name} Status`,
          message: `${activeDeptVehicles} active vehicle${activeDeptVehicles > 1 ? 's' : ''}`,
          time: "Recently",
          icon: CheckCircle,
          color: "text-success"
        });
      }
    });

    return notifications.slice(0, 4); // Limit to 4 notifications
  };

  const notifications = generateNotifications();

  // Calculate department status
  const getDepartmentStatus = (dept: Department) => {
    const deptVehicles = vehicles.filter(v => v.department_id === dept.id);
    const activeVehicles = deptVehicles.filter(v => v.status === 'active' || v.status === 'available').length;
    const maintenanceVehicles = deptVehicles.filter(v => v.status === 'maintenance').length;
    
    if (activeVehicles > 0 && maintenanceVehicles > 0) {
      return `${activeVehicles} Active, ${maintenanceVehicles} Maintenance`;
    } else if (activeVehicles > 0) {
      return `${activeVehicles} Active`;
    } else if (maintenanceVehicles > 0) {
      return `${maintenanceVehicles} Maintenance`;
    } else {
      return "No Vehicles";
    }
  };

  const getDepartmentBadgeVariant = (dept: Department) => {
    const deptVehicles = vehicles.filter(v => v.department_id === dept.id);
    const activeVehicles = deptVehicles.filter(v => v.status === 'active' || v.status === 'available').length;
    const maintenanceVehicles = deptVehicles.filter(v => v.status === 'maintenance').length;
    
    if (maintenanceVehicles > 0) {
      return "bg-warning text-warning-foreground";
    } else if (activeVehicles > 0) {
      return "bg-success text-success-foreground";
    } else {
      return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="w-80 space-y-6">
      {/* Quick Stats */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-sm text-foreground">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-4 w-4 text-primary" />
              <div>
                <div className="text-lg font-semibold text-foreground">{activeVehicles}</div>
                <div className="text-xs text-muted-foreground">Active Vehicles</div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground text-right">
              {vehicles.length > 0 ? `${Math.round((activeVehicles / vehicles.length) * 100)}% utilization` : '0%'}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-primary" />
              <div>
                <div className="text-lg font-semibold text-foreground">{maintenanceVehicles}</div>
                <div className="text-xs text-muted-foreground">In Maintenance</div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground text-right">
              {maintenanceVehicles > 0 ? 'Needs attention' : 'All good'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground">Notifications</CardTitle>
          <Badge variant="secondary" className="bg-primary text-primary-foreground">
            {notifications.length}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => {
              const IconComponent = notification.icon;
              return (
                <div key={notification.id} className="flex items-start space-x-3 p-3 hover:bg-accent/50 rounded-lg transition-colors">
                  <div className={`flex-shrink-0 ${notification.color}`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{notification.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{notification.message}</div>
                    <div className="text-xs text-muted-foreground mt-2">{notification.time}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <div className="text-sm">No notifications</div>
              <div className="text-xs">All systems operational</div>
            </div>
          )}
          
          <Button variant="outline" className="w-full mt-4">
            View All Notifications
          </Button>
        </CardContent>
      </Card>

      {/* Department Status */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground">Department Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {departments.length > 0 ? (
            departments.map((dept) => (
              <div key={dept.id} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{dept.name}</span>
                <Badge className={getDepartmentBadgeVariant(dept)}>
                  {getDepartmentStatus(dept)}
                </Badge>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <div className="text-sm">No departments</div>
              <div className="text-xs">No department data available</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}