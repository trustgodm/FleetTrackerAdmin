import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation, Clock } from "lucide-react";
import { TripStats } from "@/types/tracking";

interface TripStatsCardsProps {
  stats: TripStats;
}

export function TripStatsCards({ stats }: TripStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Navigation className="w-4 h-4 mr-2 text-green-500" />
            Active Trips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{stats.active}</div>
          <p className="text-xs text-muted-foreground">Currently in progress</p>
        </CardContent>
      </Card>

      <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Navigation className="w-4 h-4 mr-2 text-blue-500" />
            Completed Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{stats.completed}</div>
          <p className="text-xs text-muted-foreground">Trips completed</p>
        </CardContent>
      </Card>

      <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Clock className="w-4 h-4 mr-2 text-yellow-500" />
            Avg Duration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{stats.avgDuration}m</div>
          <p className="text-xs text-muted-foreground">Per trip average</p>
        </CardContent>
      </Card>

      <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Navigation className="w-4 h-4 mr-2 text-primary" />
            Total Distance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{stats.totalDistance.toFixed(1)} km</div>
          <p className="text-xs text-muted-foreground">Today's total</p>
        </CardContent>
      </Card>
    </div>
  );
}
