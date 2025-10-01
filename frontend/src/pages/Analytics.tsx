import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Fuel, Clock, TrendingUp, Activity, Loader2, AlertTriangle } from "lucide-react";
import { analyticsAPI } from "@/services/api";
import { toast } from "sonner";

// Import the separate tab components
import VehicleUtilization from "./analytics/VehicleUtilization";
import FuelConsumption from "./analytics/FuelConsumption";
import DepartmentAnalysis from "./analytics/DepartmentAnalysis";
import UserAnalysis from "./analytics/UserAnalysis";
import Reports from "./analytics/Reports";

// TypeScript interfaces for dashboard metrics
interface DashboardMetrics {
  totalVehicles?: number;
  activeVehicles?: number;
  avgFuelCapacity?: number;
  totalTrips?: number;
  completedTrips?: number;
  utilizationRate?: number;
}

interface DashboardData {
  metrics?: DashboardMetrics;
}

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData>({});

  // Fetch dashboard overview data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const dashboardRes = await analyticsAPI.getDashboardStats('all', null);

      setDashboardData(dashboardRes.data || {});

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
            <span>Loading analytics...</span>
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
            <h3 className="text-lg font-semibold mb-2">Error Loading Analytics</h3>
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

  const metrics = dashboardData.metrics || {};

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground">Fleet performance analytics and reports</p>
          </div>
        </div>

        {/* Dashboard Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-primary" />
                Total Vehicles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{metrics.totalVehicles || 0}</div>
              <p className="text-xs text-green-500 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                {metrics.activeVehicles || 0} active
              </p>
            </CardContent>
          </Card>

   

          <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock className="w-4 h-4 mr-2 text-primary" />
                Total Trips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{metrics.totalTrips || 0}</div>
              <p className="text-xs text-yellow-500 flex items-center">
                <Activity className="w-3 h-3 mr-1" />
                {metrics.completedTrips || 0} completed
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-primary" />
                Utilization Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{metrics.utilizationRate || 0}%</div>
              <p className="text-xs text-green-500 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                Fleet efficiency
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="utilization" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="utilization">Vehicle Utilization</TabsTrigger>
        
            <TabsTrigger value="departments">Department Analysis</TabsTrigger>
           
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="utilization">
            <VehicleUtilization />
          </TabsContent>

      

          <TabsContent value="departments">
            <DepartmentAnalysis />
          </TabsContent>

          <TabsContent value="reports">
            <Reports />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}