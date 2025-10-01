import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Car, Activity, Clock, TrendingUp, Loader2, AlertTriangle } from "lucide-react";
import { DateRangeFilter } from "@/components/analytics/DateRangeFilter";
import { analyticsAPI, departmentsAPI, usersAPI } from "@/services/api";
import { toast } from "sonner";

interface UtilizationData {
  overview?: {
    totalVehicles: number;
    activeVehicles: number;
    totalTrips: number;
    completedTrips: number;
    activeTrips: number;
    totalDistance: number;
    totalDuration: number;
    utilizationRate: number;
    avgTripsPerVehicle: number;
    avgDistancePerTrip: number;
    avgDurationPerTrip: number;
  };
  byDepartment?: Array<{
    id: string;
    name: string;
    totalVehicles: number;
    activeVehicles: number;
    totalTrips: number;
    completedTrips: number;
    utilizationRate: number;
    avgTripsPerVehicle: number;
  }>;
  weekly?: Array<{
    day: string;
    trips: number;
    distance: number;
    duration: number;
    activeVehicles: number;
  }>;
}

interface DepartmentOption {
  id: string;
  name: string;
}

interface UserOption {
  id: string;
  name: string;
  email: string;
  department: string;
}

export default function VehicleUtilization() {
  const [filterType, setFilterType] = useState('all');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [utilizationData, setUtilizationData] = useState<UtilizationData>({});

  // Fetch departments and users for filtering
  const fetchFilterOptions = async () => {
    try {
      const [departmentsRes, usersRes] = await Promise.all([
        departmentsAPI.getAll(),
        usersAPI.getAll()
      ]);

      setDepartments(departmentsRes.data || []);
      setUsers(usersRes.data || []);
    } catch (err) {
      console.error('Error fetching filter options:', err);
    }
  };

  // Fetch utilization analytics data
  const fetchUtilizationData = async () => {
    try {
      setLoading(true);
      setError(null);

      const dateRange = filterType === 'custom' && customDateRange.start && customDateRange.end 
        ? customDateRange 
        : null;

      const utilizationRes = await analyticsAPI.getUtilizationAnalytics(
        filterType, 
        dateRange, 
        selectedDepartment === 'all' ? null : selectedDepartment, 
        selectedUser === 'all' ? null : selectedUser
      );

      setUtilizationData(utilizationRes.data || {});

    } catch (err) {
      console.error('Error fetching utilization data:', err);
      setError(err.message || 'Failed to load utilization data');
      toast.error('Failed to load utilization data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchUtilizationData();
  }, [filterType, customDateRange, selectedDepartment, selectedUser]);

  const handleFilterChange = (filter: string) => {
    setFilterType(filter);
  };

  const handleDateRangeChange = (range: { start: string; end: string }) => {
    setCustomDateRange(range);
  };

  const handleDepartmentChange = (departmentId: string) => {
    setSelectedDepartment(departmentId);
  };

  const handleUserChange = (userId: string) => {
    setSelectedUser(userId);
  };

  const prepareUtilizationData = () => {
    if (!utilizationData.weekly) return [];
    return utilizationData.weekly;
  };

  const prepareDepartmentUtilizationData = () => {
    if (!utilizationData.byDepartment) return [];
    return utilizationData.byDepartment.map(dept => ({
      name: dept.name,
      utilizationRate: dept.utilizationRate,
      totalVehicles: dept.totalVehicles,
      activeVehicles: dept.activeVehicles,
      totalTrips: dept.totalTrips,
      avgTripsPerVehicle: dept.avgTripsPerVehicle
    }));
    
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading utilization data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Utilization Data</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={fetchUtilizationData}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const utilizationOverview = utilizationData.overview;
  const utilizationDataChart = prepareUtilizationData();
  const departmentUtilizationData = prepareDepartmentUtilizationData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Vehicle Utilization</h2>
          <p className="text-muted-foreground">Monitor fleet utilization and performance metrics</p>
        </div>
        
        <DateRangeFilter
          filterType={filterType}
          onFilterChange={handleFilterChange}
          onDateRangeChange={handleDateRangeChange}
          customDateRange={customDateRange}
        />
      </div>

      {/* Filter Controls */}
      <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
        <CardHeader>
          <CardTitle>Utilization Filters</CardTitle>
          <CardDescription>Filter utilization data by department</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={selectedDepartment} onValueChange={handleDepartmentChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          
          </div>
        </CardContent>
      </Card>

      {/* Utilization Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Car className="w-4 h-4 mr-2 text-primary" />
              Total Vehicles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{utilizationOverview?.totalVehicles || 0}</div>
            <p className="text-xs text-muted-foreground">In fleet</p>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Activity className="w-4 h-4 mr-2 text-green-500" />
              Active Vehicles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{utilizationOverview?.activeVehicles || 0}</div>
            <p className="text-xs text-green-500">Currently in use</p>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="w-4 h-4 mr-2 text-blue-500" />
              Total Trips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{utilizationOverview?.totalTrips || 0}</div>
            <p className="text-xs text-blue-500">{utilizationOverview?.completedTrips || 0} completed</p>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-yellow-500" />
              Avg Distance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{utilizationOverview?.avgDistancePerTrip || 0} km</div>
            <p className="text-xs text-yellow-500">Per trip</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Utilization Chart */}
      <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
        <CardHeader>
          <CardTitle>Weekly Vehicle Utilization</CardTitle>
          <CardDescription>Daily usage patterns and trip activity</CardDescription>
        </CardHeader>
        <CardContent>
          {utilizationDataChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={utilizationDataChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="trips" stroke="hsl(var(--primary))" strokeWidth={2} name="Trips" />
                <Line type="monotone" dataKey="distance" stroke="hsl(var(--secondary))" strokeWidth={2} name="Distance (km)" />
                <Line type="monotone" dataKey="activeVehicles" stroke="hsl(var(--accent))" strokeWidth={2} name="Active Vehicles" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              <div className="text-center">
                <div className="text-lg font-medium mb-2">No Utilization Data</div>
                <div className="text-sm">No utilization data available for the selected period</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Department Performance */}
      <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
        <CardHeader>
          <CardTitle>Department Performance</CardTitle>
          <CardDescription>Key metrics by department</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {departmentUtilizationData.length > 0 ? (
            departmentUtilizationData.map((dept) => (
              <div key={dept.name} className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                <div className="font-medium">{dept.name}</div>
                <div className="text-sm text-muted-foreground space-x-4">
                  <span>Vehicles: {dept.totalVehicles}</span>
                  <span>Active: {dept.activeVehicles}</span>
                  <span>Trips: {dept.totalTrips}</span>
                  <span>Utilization: {dept.utilizationRate}%</span>
                  <span>Avg Trips/Vehicle: {dept.avgTripsPerVehicle}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-sm">No department data available</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 