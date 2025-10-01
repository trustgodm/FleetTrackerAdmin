import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, AlertTriangle, Clock, CheckCircle, Loader2 } from "lucide-react";
import { MaintenanceStats } from "@/types/maintenance";
import { maintenanceAPI } from "@/services/api";
import { useEffect, useState } from "react";

export function MaintenanceStatsCards() {
  const [stats, setStats] = useState<MaintenanceStats>({
    total: 0,
    overdue: 0,
    dueSoon: 0,
    completed: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await maintenanceAPI.getMaintenanceDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading maintenance data...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Wrench className="w-4 h-4 mr-2 text-primary" />
                Total Schedules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.total || 0}</div>
              <p className="text-xs text-muted-foreground">Active schedules</p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-destructive" />
                Overdue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.overdue || 0}</div>
              <p className="text-xs text-red-500">Requires attention</p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                Due Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.dueSoon || 0}</div>
              <p className="text-xs text-yellow-500">Next 7 days</p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.completed || 0}</div>
              <p className="text-xs text-green-500">This month</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
