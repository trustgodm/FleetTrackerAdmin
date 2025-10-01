import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "lucide-react";
import { Trip } from "@/types/tracking";
import { TripSearchBar } from "./TripSearchBar";
import { TripCard } from "./TripCard";

interface ActiveTripsTabProps {
  trips: Trip[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onViewDetails: (trip: Trip) => void;
  calculateDistance: (trip: Trip) => number;
  calculateDuration: (startTime: string, endTime?: string) => number;
  calculateFuelConsumption: (trip: Trip) => number;
}

export function ActiveTripsTab({ 
  trips, 
  searchTerm, 
  onSearchChange, 
  onViewDetails,
  calculateDistance,
  calculateDuration,
  calculateFuelConsumption
}: ActiveTripsTabProps) {
  return (
    <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Active Trips</CardTitle>
            <CardDescription>Currently ongoing vehicle trips</CardDescription>
          </div>
          <div className="flex space-x-2">
            <TripSearchBar
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
              placeholder="Search active trips..."
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {trips.length === 0 ? (
          <div className="text-center py-8">
            <Navigation className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm ? 'No matching active trips' : 'No active trips'}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try adjusting your search terms' : 'No trips are currently active'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onViewDetails={onViewDetails}
                showFullDetails={false}
                calculateDistance={calculateDistance}
                calculateDuration={calculateDuration}
                calculateFuelConsumption={calculateFuelConsumption}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
