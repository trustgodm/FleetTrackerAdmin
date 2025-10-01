import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Wrench, CheckCircle } from "lucide-react";
import { MaintenanceSchedule } from "@/types/maintenance";
import { MaintenanceCard } from "./MaintenanceCard";

interface MaintenanceTabsProps {
  maintenanceRecords: MaintenanceSchedule[];
  onViewDetails: (record: MaintenanceSchedule) => void;
}

export function MaintenanceTabs({ maintenanceRecords, onViewDetails }: MaintenanceTabsProps) {
  // Filter for upcoming maintenance (due within 7 days)
  const upcomingMaintenance = maintenanceRecords.filter(r => {
    if (!r.next_due_date) return false;
    const dueDate = new Date(r.next_due_date);
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  });

  return (
    <Tabs defaultValue="schedule" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="schedule">Schedule</TabsTrigger>
        <TabsTrigger value="records">Records</TabsTrigger>
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>

      <TabsContent value="schedule" className="space-y-6">
        <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Maintenance Schedule</CardTitle>
                <CardDescription>All scheduled maintenance tasks</CardDescription>
              </div>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input placeholder="Search schedules..." className="pl-10 w-64" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {maintenanceRecords.length === 0 ? (
              <div className="text-center py-8">
                <Wrench className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No maintenance schedules</h3>
                <p className="text-muted-foreground">Create maintenance schedules for your vehicles</p>
              </div>
            ) : (
              <div className="space-y-4">
                {maintenanceRecords.map((record) => (
                  <MaintenanceCard
                    key={record.id}
                    record={record}
                    onViewDetails={onViewDetails}
                    variant="schedule"
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="records" className="space-y-6">
        <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
          <CardHeader>
            <CardTitle>Maintenance Records</CardTitle>
            <CardDescription>Completed maintenance tasks and service history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Wrench className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No maintenance records</h3>
              <p className="text-muted-foreground">Completed maintenance tasks will appear here</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="upcoming" className="space-y-6">
        <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
          <CardHeader>
            <CardTitle>Upcoming Maintenance</CardTitle>
            <CardDescription>Maintenance tasks due in the next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingMaintenance.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No upcoming maintenance</h3>
                <p className="text-muted-foreground">All maintenance is up to date</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingMaintenance.map((record) => (
                  <MaintenanceCard
                    key={record.id}
                    record={record}
                    onViewDetails={onViewDetails}
                    variant="upcoming"
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="analytics" className="space-y-6">
        <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
          <CardHeader>
            <CardTitle>Maintenance Analytics</CardTitle>
            <CardDescription>Maintenance performance and cost analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Maintenance Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                    <span className="font-medium">Total Schedules</span>
                    <span className="text-sm text-muted-foreground">{maintenanceRecords.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                    <span className="font-medium">Overdue Tasks</span>
                    <span className="text-sm text-muted-foreground">
                      {maintenanceRecords.filter(m => {
                        if (!m.next_due_date) return false;
                        return new Date() > new Date(m.next_due_date);
                      }).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                    <span className="font-medium">Due Soon</span>
                    <span className="text-sm text-muted-foreground">{upcomingMaintenance.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                    <span className="font-medium">Completed</span>
                    <span className="text-sm text-muted-foreground">
                      {maintenanceRecords.filter(m => m.last_performed_at !== null).length}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold">Cost Analysis</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                    <span className="font-medium">Total Estimated Cost</span>
                    <span className="text-sm text-muted-foreground">
                      R{maintenanceRecords.reduce((sum, r) => sum + (r.estimated_cost || 0), 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                    <span className="font-medium">Average Cost per Task</span>
                    <span className="text-sm text-muted-foreground">
                      R{maintenanceRecords.length > 0 
                        ? Math.round(maintenanceRecords.reduce((sum, r) => sum + (r.estimated_cost || 0), 0) / maintenanceRecords.length)
                        : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
