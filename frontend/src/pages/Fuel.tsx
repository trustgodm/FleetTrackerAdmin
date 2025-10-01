import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Fuel as FuelIcon, TrendingUp, TrendingDown, Plus, Search, Filter, Loader2 } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { tripsAPI } from "@/services/api";

export default function Fuel() {
  const [filters, setFilters] = useState({
    status: 'completed',
    page: 1,
    limit: 10
  });

  const { data: tripsData, loading, error, refetch } = useApi(
    () => tripsAPI.getAll(filters),
    [filters]
  );

  const trips = tripsData?.data || [];
  const pagination = tripsData?.pagination;

  // Calculate fuel statistics from trip data
  const fuelStats = {
    totalConsumption: trips.reduce((sum, trip) => sum + (trip.getFuelConsumption?.() || 0), 0),
    avgEfficiency: trips.length > 0 
      ? (trips.reduce((sum, trip) => {
          const distance = trip.getDistance?.() || 0;
          const consumption = trip.getFuelConsumption?.() || 0;
          return sum + (distance > 0 ? (consumption / distance) * 100 : 0);
        }, 0) / trips.length).toFixed(1)
      : 0,
    totalDistance: trips.reduce((sum, trip) => sum + (trip.getDistance?.() || 0), 0),
    costEstimate: trips.reduce((sum, trip) => sum + (trip.getFuelConsumption?.() || 0), 0) * 15 // R15 per liter estimate
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading fuel data...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error loading fuel data: {error}</p>
            <Button onClick={refetch}>Retry</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Fuel Management</h1>
            <p className="text-muted-foreground">Monitor fuel consumption and efficiency</p>
          </div>
          <Button className="bg-gradient-primary text-primary-foreground shadow-glow">
            <Plus className="w-4 h-4 mr-2" />
            Add Fuel Record
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <FuelIcon className="w-4 h-4 mr-2 text-primary" />
                Total Consumption
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{fuelStats.totalConsumption}%</div>
              <p className="text-xs text-red-500 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                From completed trips
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <TrendingDown className="w-4 h-4 mr-2 text-primary" />
                Avg Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{fuelStats.avgEfficiency}%</div>
              <p className="text-xs text-green-500 flex items-center">
                <TrendingDown className="w-3 h-3 mr-1" />
                Per 100km average
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-primary" />
                Total Distance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{fuelStats.totalDistance.toFixed(1)} km</div>
              <p className="text-xs text-yellow-500 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                This period
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <FuelIcon className="w-4 h-4 mr-2 text-primary" />
                Cost Estimate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">R{fuelStats.costEstimate}</div>
              <p className="text-xs text-green-500 flex items-center">
                <TrendingDown className="w-3 h-3 mr-1" />
                Based on consumption
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="consumption" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="consumption">Fuel Consumption</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="consumption" className="space-y-6">
            <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Fuel Consumption Records</CardTitle>
                    <CardDescription>Track fuel consumption by trip</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input placeholder="Search records..." className="pl-10 w-64" />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {trips.length === 0 ? (
                  <div className="text-center py-8">
                    <FuelIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No fuel consumption data</h3>
                    <p className="text-muted-foreground">Complete some trips to see fuel consumption records</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {trips.map((trip) => (
                      <div key={trip.id} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                            <FuelIcon className="w-6 h-6 text-primary-foreground" />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">
                              {trip.vehicle?.number_plate} - {trip.driver?.first_name} {trip.driver?.last_name}
                            </div>
                            <div className="text-sm text-muted-foreground">Trip: {trip.id}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <div className="font-semibold text-foreground">{trip.getFuelConsumption?.() || 0}%</div>
                            <div className="text-xs text-muted-foreground">Consumption</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="font-semibold text-foreground">{trip.getDistance?.()?.toFixed(1) || 0} km</div>
                            <div className="text-xs text-muted-foreground">Distance</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="font-semibold text-foreground">
                              {trip.getDistance?.() && trip.getFuelConsumption?.() 
                                ? ((trip.getFuelConsumption() / trip.getDistance()) * 100).toFixed(1)
                                : 0}% per km
                            </div>
                            <div className="text-xs text-muted-foreground">Efficiency</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="font-semibold text-foreground">
                              {trip.fuel_level_start || 0}% → {trip.fuel_level_end || 0}%
                            </div>
                            <div className="text-xs text-muted-foreground">Fuel Level</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="font-semibold text-foreground">
                              {trip.end_time ? new Date(trip.end_time).toLocaleDateString() : 'In Progress'}
                            </div>
                            <div className="text-xs text-muted-foreground">Date</div>
                          </div>
                          
                          <Button variant="outline" size="sm">
                            View Trip
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {pagination && pagination.pages > 1 && (
                  <div className="flex justify-center mt-6">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={pagination.page <= 1}
                        onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                      >
                        Previous
                      </Button>
                      <span className="flex items-center px-3 text-sm">
                        Page {pagination.page} of {pagination.pages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={pagination.page >= pagination.pages}
                        onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
              <CardHeader>
                <CardTitle>Fuel Analytics</CardTitle>
                <CardDescription>Consumption patterns and efficiency metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Top Consumers</h3>
                    {trips
                      .sort((a, b) => (b.getFuelConsumption?.() || 0) - (a.getFuelConsumption?.() || 0))
                      .slice(0, 3)
                      .map((trip) => (
                        <div key={trip.id} className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                          <span className="font-medium">{trip.vehicle?.number_plate}</span>
                          <div className="text-sm text-muted-foreground">
                            <span>{trip.getFuelConsumption?.() || 0}% | {trip.getDistance?.()?.toFixed(1) || 0}km</span>
                          </div>
                        </div>
                      ))}
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Efficiency Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                        <span className="font-medium">Average Efficiency</span>
                        <span className="text-sm text-muted-foreground">{fuelStats.avgEfficiency}% per km</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                        <span className="font-medium">Total Consumption</span>
                        <span className="text-sm text-muted-foreground">{fuelStats.totalConsumption}%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                        <span className="font-medium">Estimated Cost</span>
                        <span className="text-sm text-muted-foreground">R{fuelStats.costEstimate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}