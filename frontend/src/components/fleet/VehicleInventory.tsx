import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";
import { Vehicle } from "@/types/fleet";
import { VehicleSearchBar } from "./VehicleSearchBar";
import { VehicleCard } from "./VehicleCard";

interface VehicleInventoryProps {
  vehicles: Vehicle[];
  allVehicles: Vehicle[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onViewDetails: (vehicle: Vehicle) => void;
}

export function VehicleInventory({ 
  vehicles, 
  allVehicles, 
  searchTerm, 
  onSearchChange, 
  onViewDetails 
}: VehicleInventoryProps) {
  return (
    <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Vehicle Inventory</CardTitle>
            <CardDescription>Complete list of all fleet vehicles</CardDescription>
          </div>
          <VehicleSearchBar
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
          />
        </div>
      </CardHeader>
      <CardContent>
        {vehicles.length === 0 ? (
          <div className="text-center py-8">
            <Car className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              {allVehicles.length === 0 ? "No vehicles found" : "No vehicles match your search"}
            </h3>
            <p className="text-muted-foreground">
              {allVehicles.length === 0 ? "Add your first vehicle to get started" : "Try adjusting your search terms"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        )}

        {vehicles.length > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Showing {vehicles.length} of {allVehicles.length} vehicles
              </span>
              {searchTerm && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSearchChange("")}
                >
                  Clear Search
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
