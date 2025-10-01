import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { Building2, Users, Car, TrendingUp, Loader2, AlertTriangle } from "lucide-react";
import { DateRangeFilter } from "@/components/analytics/DateRangeFilter";
import { analyticsAPI } from "@/services/api";
import { toast } from "sonner";

interface Department {
  id: string;
  name: string;
  vehicleCount: number;
  activeVehicles: number;
  userCount: number;
}

interface DepartmentData {
  departments?: Department[];
  totalDepartments?: number;
  totalVehicles?: number;
  totalUsers?: number;
  avgVehiclesPerDept?: number;
  avgUsersPerDept?: number;
  total?: number;
}

export default function DepartmentAnalysis() {
  const [filterType, setFilterType] = useState('all');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [departmentData, setDepartmentData] = useState<DepartmentData>({});

  // Fetch department analytics data
  const fetchDepartmentData = async () => {
    try {
      setLoading(true);
      setError(null);

      const dateRange = filterType === 'custom' && customDateRange.start && customDateRange.end 
        ? customDateRange 
        : null;

      const departmentRes = await analyticsAPI.getDepartmentAnalytics(filterType, dateRange);

      setDepartmentData(departmentRes.data || {});

    } catch (err) {
      console.error('Error fetching department data:', err);
      setError(err.message || 'Failed to load department data');
      toast.error('Failed to load department data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartmentData();
  }, [filterType, customDateRange]);

  const handleFilterChange = (filter: string) => {
    setFilterType(filter);
  };

  const handleDateRangeChange = (range: { start: string; end: string }) => {
    setCustomDateRange(range);
  };

  // Generate stable colors based on department name
  const getDepartmentColor = (name: string, index: number) => {
    const colors = [
      'hsl(210, 70%, 50%)', // Blue
      'hsl(120, 70%, 50%)', // Green
      'hsl(30, 70%, 50%)',  // Orange
      'hsl(280, 70%, 50%)', // Purple
      'hsl(0, 70%, 50%)',   // Red
      'hsl(180, 70%, 50%)', // Cyan
      'hsl(60, 70%, 50%)',  // Yellow
      'hsl(300, 70%, 50%)', // Magenta
    ];
    return colors[index % colors.length];
  };

  const prepareDepartmentData = () => {
    const deptData = departmentData;
    if (!deptData.departments) return [];

    return deptData.departments.map((dept, index) => ({
      name: dept.name,
      value: dept.vehicleCount,
      color: getDepartmentColor(dept.name, index)
    }));
  };

  const prepareDepartmentUtilizationData = () => {
    const deptData = departmentData;
    if (!deptData.departments) return [];

    return deptData.departments.map(dept => ({
      name: dept.name,
      vehicleCount: dept.vehicleCount,
      activeVehicles: dept.activeVehicles,
      userCount: dept.userCount,
      utilizationRate: dept.activeVehicles > 0 ? Math.round((dept.activeVehicles / dept.vehicleCount) * 100) : 0
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading department data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Department Data</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={fetchDepartmentData}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const departmentDataChart = prepareDepartmentData();
  const departmentUtilizationData = prepareDepartmentUtilizationData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Department Analysis</h2>
          <p className="text-muted-foreground">Analyze fleet distribution and performance by department</p>
        </div>
        
        <DateRangeFilter
          filterType={filterType}
          onFilterChange={handleFilterChange}
          onDateRangeChange={handleDateRangeChange}
          customDateRange={customDateRange}
        />
      </div>

      {/* Department Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Building2 className="w-4 h-4 mr-2 text-primary" />
              Total Departments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{departmentData.total || 0}</div>
            <p className="text-xs text-muted-foreground">Active departments</p>
          </CardContent>
        </Card>

       

        <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="w-4 h-4 mr-2 text-blue-500" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{departmentData.totalUsers || 0}</div>
            <p className="text-xs text-blue-500">Active users</p>
          </CardContent>
        </Card>

      </div>

      {/* Fleet Distribution and Department Utilization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
          <CardHeader>
            <CardTitle>Fleet Distribution</CardTitle>
            <CardDescription>Vehicle allocation by department</CardDescription>
          </CardHeader>
          <CardContent>
            {departmentDataChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={departmentDataChart}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    nameKey="name"
                  >
                    {departmentDataChart.map((entry, index) => (
                      <Cell key={`cell-${entry.name}-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                <div className="text-center">
                  <div className="text-lg font-medium mb-2">No Department Data</div>
                  <div className="text-sm">No department data available for the selected period</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
          <CardHeader>
            <CardTitle>Department Utilization</CardTitle>
            <CardDescription>Utilization rates by department</CardDescription>
          </CardHeader>
          <CardContent>
            {departmentUtilizationData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={departmentUtilizationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="utilizationRate" 
                    fill="hsl(var(--primary))" 
                    name="Utilization Rate (%)"
                    key="utilization-bar"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                <div className="text-center">
                  <div className="text-lg font-medium mb-2">No Department Data</div>
                  <div className="text-sm">No department utilization data available</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Department Performance */}
      <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
        <CardHeader>
          <CardTitle>Department Performance</CardTitle>
          <CardDescription>Key metrics by department</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {departmentUtilizationData.length > 0 ? (
            departmentUtilizationData.map((dept) => (
              <div key={dept.name} className="flex justify-between items-center p-3 bg-background/50 rounded-lg border border-border">
                <div className="flex-1">
                  <div className="font-medium">{dept.name}</div>
                  <div className="text-sm text-muted-foreground">Department Performance</div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-primary">{dept.vehicleCount}</div>
                    <div className="text-xs text-muted-foreground">Vehicles</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-green-500">{dept.activeVehicles}</div>
                    <div className="text-xs text-muted-foreground">Active</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-blue-500">{dept.userCount}</div>
                    <div className="text-xs text-muted-foreground">Users</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-yellow-500">{dept.utilizationRate}%</div>
                    <div className="text-xs text-muted-foreground">Utilization</div>
                  </div>
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

      {/* Department Insights */}
      <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
        <CardHeader>
          <CardTitle>Department Insights</CardTitle>
          <CardDescription>Key insights and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-primary">Fleet Distribution</h4>
              <div className="space-y-2">
                {departmentUtilizationData.length > 0 && (
                  <>
                    <div className="text-sm">
                      <span className="font-medium">Largest Department:</span> {departmentUtilizationData[0]?.name}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Total Departments:</span> {departmentUtilizationData.length}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Average Vehicles/Dept:</span> {Math.round(departmentData.avgVehiclesPerDept || 0)}
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-green-600">Performance Recommendations</h4>
              <div className="space-y-2 text-sm">
                <div>• Monitor departments with low utilization rates</div>
                <div>• Balance vehicle allocation across departments</div>
                <div>• Consider department-specific needs</div>
                <div>• Track user-to-vehicle ratios</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 