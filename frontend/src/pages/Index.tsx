import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { FleetChart } from "@/components/dashboard/FleetChart";
import { VehicleList } from "@/components/dashboard/VehicleList";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { NotificationPanel } from "@/components/dashboard/NotificationPanel";
import { Car, Users, Fuel, MapPin, TrendingUp, AlertTriangle, Loader2 } from "lucide-react";
import { vehiclesAPI, departmentsAPI, tripsAPI } from "@/services/api";
import { toast } from "sonner";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState({
    vehicles: [],
    departments: [],
    trips: [],
    metrics: {
      totalFleet: 0,
      activeVehicles: 0,
      fuelEfficiency: 0,
      maintenanceAlerts: 0,
      totalDepartments: 0,
      totalUsers: 0
    }
  });

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [vehiclesResponse, departmentsResponse, tripsResponse] = await Promise.all([
        vehiclesAPI.getAll(),
        departmentsAPI.getAll(),
        tripsAPI.getAll()
      ]);

      const vehicles = vehiclesResponse.data || [];
      const departments = departmentsResponse.data || [];
      const trips = tripsResponse.data || [];

      // Calculate metrics
      const totalFleet = vehicles.length;
      const activeVehicles = vehicles.filter(v => v.status === 'active' || v.status === 'available').length;
      const maintenanceAlerts = vehicles.filter(v => v.status === 'maintenance').length;
      
      // Calculate fuel efficiency (average fuel capacity)
      const totalFuelCapacity = vehicles.reduce((sum, v) => sum + (parseFloat(v.fuel_capacity) || 0), 0);
      const avgFuelCapacity = vehicles.length > 0 ? totalFuelCapacity / vehicles.length : 0;
      
      // Calculate total users from departments
      const totalUsers = departments.reduce((sum, dept) => sum + (dept.users?.length || 0), 0);

      setDashboardData({
        vehicles,
        departments,
        trips,
        metrics: {
          totalFleet,
          activeVehicles,
          fuelEfficiency: Math.round(avgFuelCapacity * 100) / 100,
          maintenanceAlerts,
          totalDepartments: departments.length,
          totalUsers
        }
      });

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading dashboard...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Dashboard</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button 
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Overview</h1>
            <p className="text-muted-foreground mt-1">Fleet management dashboard for Two Rivers Platinum</p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Fleet"
              value={dashboardData.metrics.totalFleet.toString()}
              change={`${dashboardData.metrics.totalFleet > 0 ? '↗' : '→'} ${dashboardData.metrics.totalFleet} vehicles`}
              changeType="positive"
              icon={<Car className="h-6 w-6" />}
            />
            <MetricCard
              title="Active Vehicles"
              value={dashboardData.metrics.activeVehicles.toString()}
              change={`${Math.round((dashboardData.metrics.activeVehicles / dashboardData.metrics.totalFleet) * 100)}% utilization`}
              changeType="positive"
              icon={<TrendingUp className="h-6 w-6" />}
            />
            <MetricCard
              title="Fuel Efficiency"
              value={`${dashboardData.metrics.fuelEfficiency}L`}
              change="Average capacity"
              changeType="neutral"
              icon={<Fuel className="h-6 w-6" />}
            />
            <MetricCard
              title="Maintenance Alerts"
              value={dashboardData.metrics.maintenanceAlerts.toString()}
              change={`${dashboardData.metrics.maintenanceAlerts} vehicles in maintenance`}
              changeType={dashboardData.metrics.maintenanceAlerts > 0 ? "negative" : "positive"}
              icon={<AlertTriangle className="h-6 w-6" />}
            />
          </div>

          {/* Charts and Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FleetChart departments={dashboardData.departments} vehicles={dashboardData.vehicles} />
            <VehicleList vehicles={dashboardData.vehicles} />
          </div>

          {/* Activity Feed */}
          <div className="grid grid-cols-1 gap-6">
            <ActivityFeed trips={dashboardData.trips} vehicles={dashboardData.vehicles} />
          </div>
        </div>

        {/* Sidebar */}
        <NotificationPanel vehicles={dashboardData.vehicles} departments={dashboardData.departments} />
      </div>
    </DashboardLayout>
  );
};

export default Index;
