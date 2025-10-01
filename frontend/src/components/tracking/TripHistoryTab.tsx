import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "lucide-react";
import { Trip } from "@/types/tracking";
import { TripSearchBar } from "./TripSearchBar";
import { TripCard } from "./TripCard";
import { InspectionDetails } from "./InspectionDetails";

interface TripHistoryTabProps {
  trips: Trip[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onViewDetails: (trip: Trip) => void;
  calculateDistance: (trip: Trip) => number;
  calculateDuration: (startTime: string, endTime?: string) => number;
  calculateFuelConsumption: (trip: Trip) => number;
}

export function TripHistoryTab({ 
  trips, 
  searchTerm, 
  onSearchChange, 
  onViewDetails,
  calculateDistance,
  calculateDuration,
  calculateFuelConsumption
}: TripHistoryTabProps) {
  return (
    <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Trip History</CardTitle>
            <CardDescription>Recent completed trips and routes</CardDescription>
          </div>
          <div className="flex space-x-2">
            <TripSearchBar
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
              placeholder="Search trip history..."
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-96 overflow-y-auto pr-2">
          {trips.length === 0 ? (
            <div className="text-center py-8">
              <Navigation className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm ? 'No matching completed trips' : 'No completed trips'}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms' : 'Completed trips will appear here'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {trips.map((trip) => (
                <div key={trip.id} className="space-y-4">
                  <TripCard
                    trip={trip}
                    onViewDetails={onViewDetails}
                    showFullDetails={true}
                    calculateDistance={calculateDistance}
                    calculateDuration={calculateDuration}
                    calculateFuelConsumption={calculateFuelConsumption}
                  />
                  {/* Inspections (if available) */}
                  {trip.inspections && trip.inspections.length > 0 && (
                    <InspectionDetails inspections={trip.inspections} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
