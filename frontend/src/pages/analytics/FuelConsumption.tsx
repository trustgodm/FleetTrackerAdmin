import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Fuel, TrendingUp, Loader2, AlertTriangle } from "lucide-react";
import { DateRangeFilter } from "@/components/analytics/DateRangeFilter";
import { analyticsAPI } from "@/services/api";
import { toast } from "sonner";

interface FuelData {
  byFuelType?: Record<string, number>;
  totalVehicles?: number;
  avgFuelCapacity?: number;
  consumptionByMonth?: Array<{
    month: string;
    consumption: number;
    cost: number;
  }>;
  efficiencyByVehicle?: Array<{
    vehicleId: string;
    vehicleName: string;
    fuelType: string;
    consumption: number;
    efficiency: number;
  }>;
}

export default function FuelConsumption() {
  const [filterType, setFilterType] = useState('all');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fuelData, setFuelData] = useState<FuelData>({});

  // Fetch fuel analytics data
  const fetchFuelData = async () => {
    try {
      setLoading(true);
      setError(null);

      const dateRange = filterType === 'custom' && customDateRange.start && customDateRange.end 
        ? customDateRange 
        : null;

      const fuelRes = await analyticsAPI.getFuelAnalytics(filterType, dateRange);

      setFuelData(fuelRes.data || {});

    } catch (err) {
      console.error('Error fetching fuel data:', err);
      setError(err.message || 'Failed to load fuel data');
      toast.error('Failed to load fuel data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFuelData();
  }, [filterType, customDateRange]);

  const handleFilterChange = (filter: string) => {
    setFilterType(filter);
  };

  const handleDateRangeChange = (range: { start: string; end: string }) => {
    setCustomDateRange(range);
  };

  const prepareFuelData = () => {
    const fuelDataObj = fuelData;
    if (!fuelDataObj.byFuelType || !fuelDataObj.totalVehicles) return [];

    return Object.entries(fuelDataObj.byFuelType).map(([type, count]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      count,
      percentage: Math.round((count / fuelDataObj.totalVehicles!) * 100)
    }));
  };

  const prepareConsumptionData = () => {
    if (!fuelData.consumptionByMonth) return [];
    return fuelData.consumptionByMonth;
  };

  const prepareEfficiencyData = () => {
    if (!fuelData.efficiencyByVehicle) return [];
    return fuelData.efficiencyByVehicle.slice(0, 10); // Show top 10 vehicles
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading fuel data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Fuel Data</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={fetchFuelData}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const fuelDataChart = prepareFuelData();
  const consumptionData = prepareConsumptionData();
  const efficiencyData = prepareEfficiencyData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Fuel Consumption</h2>
          <p className="text-muted-foreground">Monitor fuel usage and efficiency metrics</p>
        </div>
        
        <DateRangeFilter
          filterType={filterType}
          onFilterChange={handleFilterChange}
          onDateRangeChange={handleDateRangeChange}
          customDateRange={customDateRange}
        />
      </div>

      {/* Fuel Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Fuel className="w-4 h-4 mr-2 text-primary" />
              Total Vehicles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{fuelData.totalVehicles || 0}</div>
            <p className="text-xs text-muted-foreground">In fleet</p>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
              Avg Fuel Capacity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{Math.round(fuelData.avgFuelCapacity || 0)}L</div>
            <p className="text-xs text-green-500">Per vehicle</p>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Fuel className="w-4 h-4 mr-2 text-blue-500" />
              Fuel Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{fuelData.byFuelType ? Object.keys(fuelData.byFuelType).length : 0}</div>
            <p className="text-xs text-blue-500">Different types</p>
          </CardContent>
        </Card>
      </div>

      {/* Fuel Type Distribution */}
      <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
        <CardHeader>
          <CardTitle>Fuel Type Distribution</CardTitle>
          <CardDescription>Vehicle distribution by fuel type</CardDescription>
        </CardHeader>
        <CardContent>
          {fuelDataChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fuelDataChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" name="Vehicle Count" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              <div className="text-center">
                <div className="text-lg font-medium mb-2">No Fuel Data</div>
                <div className="text-sm">No fuel consumption data available for the selected period</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly Consumption Chart */}
      {consumptionData.length > 0 && (
        <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
          <CardHeader>
            <CardTitle>Monthly Fuel Consumption</CardTitle>
            <CardDescription>Fuel consumption and cost trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={consumptionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="consumption" fill="hsl(var(--primary))" name="Consumption (L)" />
                <Bar yAxisId="right" dataKey="cost" fill="hsl(var(--secondary))" name="Cost ($)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Vehicle Efficiency */}
      {efficiencyData.length > 0 && (
        <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
          <CardHeader>
            <CardTitle>Vehicle Fuel Efficiency</CardTitle>
            <CardDescription>Top 10 most fuel-efficient vehicles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {efficiencyData.map((vehicle) => (
                <div key={vehicle.vehicleId} className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{vehicle.vehicleName}</div>
                    <div className="text-sm text-muted-foreground">{vehicle.fuelType}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-primary">{vehicle.consumption}L</div>
                      <div className="text-xs text-muted-foreground">Consumption</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-green-500">{vehicle.efficiency}%</div>
                      <div className="text-xs text-muted-foreground">Efficiency</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-blue-500">{vehicle.fuelType}</div>
                      <div className="text-xs text-muted-foreground">Type</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fuel Insights */}
      <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
        <CardHeader>
          <CardTitle>Fuel Insights</CardTitle>
          <CardDescription>Key insights and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-primary">Fuel Type Analysis</h4>
              <div className="space-y-2">
                {fuelDataChart.length > 0 && (
                  <>
                    <div className="text-sm">
                      <span className="font-medium">Most Common:</span> {fuelDataChart[0]?.type}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Total Types:</span> {fuelDataChart.length}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Average Capacity:</span> {Math.round(fuelData.avgFuelCapacity || 0)}L
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-green-600">Efficiency Recommendations</h4>
              <div className="space-y-2 text-sm">
                <div>• Monitor vehicles with low efficiency ratings</div>
                <div>• Consider fuel type optimization</div>
                <div>• Regular maintenance improves efficiency</div>
                <div>• Track consumption patterns</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 