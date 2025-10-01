import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, MapPin, Wrench, Fuel } from "lucide-react";
import { FleetStats } from "@/types/fleet";

interface FleetStatsCardsProps {
  stats: FleetStats;
}

export function FleetStatsCards({ stats }: FleetStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Car className="w-4 h-4 mr-2 text-primary" />
            Total Vehicles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{stats.total}</div>
          <p className="text-xs text-muted-foreground">Fleet size</p>
        </CardContent>
      </Card>

      <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-primary" />
            Active
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{stats.active}</div>
          <p className="text-xs text-muted-foreground">Currently in use</p>
        </CardContent>
      </Card>

      <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Wrench className="w-4 h-4 mr-2 text-destructive" />
            Maintenance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{stats.maintenance}</div>
          <p className="text-xs text-muted-foreground">Scheduled repairs</p>
        </CardContent>
      </Card>

      <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Fuel className="w-4 h-4 mr-2 text-primary" />
            Avg Fuel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{stats.avgFuel}%</div>
          <p className="text-xs text-muted-foreground">Fleet average</p>
        </CardContent>
      </Card>
    </div>
  );
}
