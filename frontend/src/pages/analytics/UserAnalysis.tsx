import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Users, Activity, TrendingUp, Clock, Search, Loader2, AlertTriangle } from "lucide-react";
import { DateRangeFilter } from "@/components/analytics/DateRangeFilter";
import { analyticsAPI } from "@/services/api";
import { toast } from "sonner";

interface UserData {
  id: string;
  name: string;
  email: string;
  department: string;
  totalTrips: number;
  completedTrips: number;
  activeTrips: number;
  totalDistance: number;
  totalDuration: number;
  avgTripDuration: number;
  avgTripDistance: number;
}

interface UtilizationData {
  byUser?: UserData[];
  overview?: {
    totalUsers: number;
    activeUsers: number;
    totalTrips: number;
    completedTrips: number;
    totalDistance: number;
    totalDuration: number;
    avgTripsPerUser: number;
    avgDistancePerUser: number;
  };
}

export default function UserAnalysis() {
  const [filterType, setFilterType] = useState('all');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string>('');
  const [userAnalyticsData, setUserAnalyticsData] = useState<UtilizationData>({});

  // Fetch user analytics data
  const fetchUserAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const dateRange = filterType === 'custom' && customDateRange.start && customDateRange.end 
        ? customDateRange 
        : null;

      const utilizationRes = await analyticsAPI.getUtilizationAnalytics(
        filterType, 
        dateRange, 
        null, 
        null, 
        companyId
      );

      setUserAnalyticsData(utilizationRes.data || {});

    } catch (err) {
      console.error('Error fetching user analytics:', err);
      setError(err.message || 'Failed to load user analytics data');
      toast.error('Failed to load user analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Remove automatic fetch - only fetch when search button is pressed

  const handleFilterChange = (filter: string) => {
    setFilterType(filter);
  };

  const handleDateRangeChange = (range: { start: string; end: string }) => {
    setCustomDateRange(range);
  };

  const handleCompanyIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyId(e.target.value);
  };

  const handleSearchByCompanyId = () => {
    if (!companyId.trim()) {
      toast.error('Please enter a Company ID');
      return;
    }
    // Only fetch data when search button is pressed
    fetchUserAnalytics();
  };

  const prepareUserUtilizationData = () => {
    const utilizationData = userAnalyticsData;
    if (!utilizationData.byUser) return [];

    return utilizationData.byUser.map(user => ({
      name: user.name,
      totalTrips: user.totalTrips,
      completedTrips: user.completedTrips,
      totalDistance: user.totalDistance,
      avgTripDuration: user.avgTripDuration,
      avgTripDistance: user.avgTripDistance
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading user analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading User Analytics</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={fetchUserAnalytics}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const userUtilizationData = prepareUserUtilizationData();
  const overview = userAnalyticsData.overview;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">User Analysis</h2>
          <p className="text-muted-foreground">Analyze user performance and utilization metrics</p>
        </div>
        
        <DateRangeFilter
          filterType={filterType}
          onFilterChange={handleFilterChange}
          onDateRangeChange={handleDateRangeChange}
          customDateRange={customDateRange}
        />
      </div>

      {/* Company ID Search */}
      <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Users by Company ID
          </CardTitle>
          <CardDescription>
            Enter your company ID to view user-specific analytics and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Label htmlFor="companyId">Company ID</Label>
              <Input
                id="companyId"
                placeholder="Enter your company ID"
                value={companyId}
                onChange={handleCompanyIdChange}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchByCompanyId()}
              />
            </div>
            <Button onClick={handleSearchByCompanyId} className="mt-6">
              <Search className="h-4 w-4 mr-2" />
              Search Users
            </Button>
          </div>
          {companyId && (
            <p className="text-sm text-muted-foreground mt-2">
              Showing user analytics for Company ID: <span className="font-medium">{companyId}</span>
            </p>
          )}
        </CardContent>
      </Card>

      {/* User Performance Overview */}
      {companyId && overview && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="w-4 h-4 mr-2 text-primary" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{overview.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">Active users</p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Activity className="w-4 h-4 mr-2 text-green-500" />
                Total Trips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{overview.totalTrips || 0}</div>
              <p className="text-xs text-green-500">{overview.completedTrips || 0} completed</p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
                Avg Trips/User
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{Math.round(overview.avgTripsPerUser || 0)}</div>
              <p className="text-xs text-blue-500">Per user</p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                Avg Distance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{Math.round(overview.avgDistancePerUser || 0)} km</div>
              <p className="text-xs text-yellow-500">Per user</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* User Performance Chart */}
      <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
        <CardHeader>
          <CardTitle>User Performance Overview</CardTitle>
          <CardDescription>Driver performance and utilization metrics by user</CardDescription>
        </CardHeader>
        <CardContent>
          {userUtilizationData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userUtilizationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalTrips" fill="hsl(var(--primary))" name="Total Trips" />
                <Bar dataKey="completedTrips" fill="hsl(var(--secondary))" name="Completed Trips" />
                <Bar dataKey="totalDistance" fill="hsl(var(--accent))" name="Total Distance (km)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              <div className="text-center">
                <div className="text-lg font-medium mb-2">
                  {companyId ? 'No User Data Found' : 'Enter Company ID to View User Analytics'}
                </div>
                <div className="text-sm">
                  {companyId 
                    ? 'No user performance data available for this company'
                    : 'Search by company ID to see user performance metrics'
                  }
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Statistics Table */}
      <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
        <CardHeader>
          <CardTitle>Detailed User Statistics</CardTitle>
          <CardDescription>Comprehensive user performance metrics and analytics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {userUtilizationData.length > 0 ? (
            <div className="space-y-3">
              {userUtilizationData.map((user) => (
                <div key={user.name} className="flex justify-between items-center p-4 bg-background/50 rounded-lg border border-border">
                  <div className="flex-1">
                    <div className="font-medium text-lg">{user.name}</div>
                    <div className="text-sm text-muted-foreground">User Performance</div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-primary">{user.totalTrips}</div>
                      <div className="text-xs text-muted-foreground">Total Trips</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-green-500">{user.completedTrips}</div>
                      <div className="text-xs text-muted-foreground">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-blue-500">{user.totalDistance} km</div>
                      <div className="text-xs text-muted-foreground">Distance</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-yellow-500">{user.avgTripDuration} min</div>
                      <div className="text-xs text-muted-foreground">Avg Duration</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-purple-500">{user.avgTripDistance} km</div>
                      <div className="text-xs text-muted-foreground">Avg Distance</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-sm">
                {companyId 
                  ? 'No user data available for this company'
                  : 'Enter a company ID to view user statistics'
                }
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Performance Insights */}
      {userUtilizationData.length > 0 && (
        <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
            <CardDescription>Key insights and recommendations based on user performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-primary">Top Performers</h4>
                <div className="space-y-2">
                  {userUtilizationData
                    .sort((a, b) => b.totalTrips - a.totalTrips)
                    .slice(0, 3)
                    .map((user, index) => (
                      <div key={user.name} className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950/20 rounded">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </div>
                        <span className="text-sm text-green-600 dark:text-green-400">
                          {user.totalTrips} trips
                        </span>
                      </div>
                    ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-blue-600">Distance Leaders</h4>
                <div className="space-y-2">
                  {userUtilizationData
                    .sort((a, b) => b.totalDistance - a.totalDistance)
                    .slice(0, 3)
                    .map((user, index) => (
                      <div key={user.name} className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-950/20 rounded">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </div>
                        <span className="text-sm text-blue-600 dark:text-blue-400">
                          {user.totalDistance} km
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 