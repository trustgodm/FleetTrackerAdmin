import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Loader2 } from "lucide-react";
import { tripsAPI } from "@/services/api";
import { Trip, TripStats, EndTripFormData } from "@/types/tracking";
import { TripStatsCards } from "@/components/tracking/TripStatsCards";
import { ActiveTripsTab } from "@/components/tracking/ActiveTripsTab";
import { TripHistoryTab } from "@/components/tracking/TripHistoryTab";
import { TripDetailsDialog } from "@/components/tracking/TripDetailsDialog";
import { EndTripDialog } from "@/components/tracking/EndTripDialog";

function Tracking() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [historySearchTerm, setHistorySearchTerm] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showEndTripModal, setShowEndTripModal] = useState(false);
  const [endTripForm, setEndTripForm] = useState<EndTripFormData>({
    end_location: '',
    end_odometer: '',
    fuel_level_end: '',
    notes: ''
  });

  // Helper functions to calculate trip statistics
  const calculateDuration = (startTime: string, endTime?: string) => {
    if (!startTime || !endTime) return 0;
    const start = new Date(startTime);
    const end = new Date(endTime);
    return Math.floor((end.getTime() - start.getTime()) / 1000 / 60); // minutes
  };

  const calculateDistance = (trip: Trip) => {
    if (trip.calculated_distance) {
      return parseFloat(trip.calculated_distance.toString());
    }
    if (trip.start_odometer && trip.end_odometer) {
      return trip.end_odometer - trip.start_odometer;
    }
    return 0;
  };

  const calculateFuelConsumption = (trip: Trip) => {
    if (trip.fuel_level_start !== null && trip.fuel_level_end !== null) {
      return trip.fuel_level_start - trip.fuel_level_end;
    }
    return 0;
  };

  // Filter trips based on search term
  const filterTrips = (trips: Trip[], searchTerm: string) => {
    if (!searchTerm.trim()) return trips;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return trips.filter((trip: Trip) => {
      const vehiclePlate = trip.vehicle?.number_plate?.toLowerCase() || '';
      const driverName = `${trip.driver?.first_name || ''} ${trip.driver?.last_name || ''}`.toLowerCase();
      const tripPurpose = (trip.trip_purpose || trip.purpose || '')?.toLowerCase();
       
      return vehiclePlate.includes(lowerSearchTerm) ||
             driverName.includes(lowerSearchTerm) ||
             tripPurpose.includes(lowerSearchTerm);
    });
  };

  const handleGetAllTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await tripsAPI.getAll();
      setTrips(response.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      console.error('Error fetching trips:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (trip: Trip) => {
    setSelectedTrip(trip);
    setShowDetailsModal(true);
  };

  const handleEndTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setShowEndTripModal(true);
    setShowDetailsModal(false);
  };

  const handleEndTripSubmit = async () => {
    if (!selectedTrip) return;
    
    setLoading(true);
    try {
      const endData = {
        end_location: endTripForm.end_location || undefined,
        end_odometer: endTripForm.end_odometer ? parseInt(endTripForm.end_odometer) : undefined,
        fuel_level_end: endTripForm.fuel_level_end ? parseFloat(endTripForm.fuel_level_end) : undefined,
        notes: endTripForm.notes || undefined
      };

      await tripsAPI.endTrip(selectedTrip.id, endData);
      
      setShowEndTripModal(false);
      setSelectedTrip(null);
      setEndTripForm({
        end_location: '',
        end_odometer: '',
        fuel_level_end: '',
        notes: ''
      });
      await handleGetAllTrips();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEndTripFormChange = (data: Partial<EndTripFormData>) => {
    setEndTripForm(prev => ({ ...prev, ...data }));
  };

  useEffect(() => {
    handleGetAllTrips();
  }, []);

  // Calculate statistics
  const stats: TripStats = {
    active: trips.filter((t: Trip) => t.status === 'active').length,
    completed: trips.filter((t: Trip) => t.status === 'completed').length,
    avgDuration: trips.length > 0 
      ? Math.round(trips.reduce((sum: number, t: Trip) => sum + calculateDuration(t.start_time, t.end_time), 0) / trips.length)
      : 0,
    totalDistance: trips.reduce((sum: number, t: Trip) => sum + calculateDistance(t), 0)
  };

  // Filter trips for different views
  const activeTrips = trips.filter((trip: Trip) => trip.status === 'active');
  const completedTrips = trips.filter((trip: Trip) => trip.status === 'completed');

  // Apply search filters
  const filteredActiveTrips = filterTrips(activeTrips, activeSearchTerm);
  const filteredCompletedTrips = filterTrips(completedTrips, historySearchTerm);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading trip data...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">
              Error loading trip data: {error}
            </p>
            <Button onClick={handleGetAllTrips}>Retry</Button>
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
            <h1 className="text-3xl font-bold text-foreground">Trip Management</h1>
            <p className="text-muted-foreground">Track vehicle trips and journey history</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleGetAllTrips}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <TripStatsCards stats={stats} />

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active Trips</TabsTrigger>
            <TabsTrigger value="history">Trip History</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            <ActiveTripsTab
              trips={filteredActiveTrips}
              searchTerm={activeSearchTerm}
              onSearchChange={setActiveSearchTerm}
              onViewDetails={handleViewDetails}
              calculateDistance={calculateDistance}
              calculateDuration={calculateDuration}
              calculateFuelConsumption={calculateFuelConsumption}
            />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <TripHistoryTab
              trips={filteredCompletedTrips}
              searchTerm={historySearchTerm}
              onSearchChange={setHistorySearchTerm}
              onViewDetails={handleViewDetails}
              calculateDistance={calculateDistance}
              calculateDuration={calculateDuration}
              calculateFuelConsumption={calculateFuelConsumption}
            />
          </TabsContent>
        </Tabs>

        <TripDetailsDialog
          trip={selectedTrip}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          onEndTrip={handleEndTrip}
          calculateDistance={calculateDistance}
          calculateDuration={calculateDuration}
          calculateFuelConsumption={calculateFuelConsumption}
        />

        <EndTripDialog
          isOpen={showEndTripModal}
          onClose={() => setShowEndTripModal(false)}
          onSubmit={handleEndTripSubmit}
          formData={endTripForm}
          onFormChange={handleEndTripFormChange}
          loading={loading}
        />
      </div>
    </DashboardLayout>
  );
}

export default Tracking;