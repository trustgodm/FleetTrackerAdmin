import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Wrench, Loader2 } from "lucide-react";
import { ScheduleMaintenanceFormData, Vehicle, MAINTENANCE_TYPES } from "@/types/maintenance";

interface ScheduleMaintenanceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ScheduleMaintenanceFormData;
  onFormChange: (data: Partial<ScheduleMaintenanceFormData>) => void;
  vehicles: Vehicle[];
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
}

export function ScheduleMaintenanceDialog({
  isOpen,
  onOpenChange,
  formData,
  onFormChange,
  vehicles,
  onSubmit,
  loading,
  error
}: ScheduleMaintenanceDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary text-primary-foreground shadow-glow">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Maintenance
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Schedule Maintenance</DialogTitle>
          <DialogDescription>
            Create a new maintenance schedule for a vehicle
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vehicle">Vehicle *</Label>
            <Select value={formData.vehicle_id} onValueChange={(value) => onFormChange({ vehicle_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a vehicle" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.number_plate} - {vehicle.make} {vehicle.model} ({vehicle.year})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maintenance_type">Maintenance Type *</Label>
            <Select value={formData.maintenance_type} onValueChange={(value) => onFormChange({ maintenance_type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select maintenance type" />
              </SelectTrigger>
              <SelectContent>
                {MAINTENANCE_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interval_km">Interval (KM)</Label>
            <Input
              type="number"
              placeholder="e.g., 5000"
              value={formData.interval_km}
              onChange={(e) => onFormChange({ interval_km: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interval_months">Interval (Months)</Label>
            <Input
              type="number"
              placeholder="e.g., 6"
              value={formData.interval_months}
              onChange={(e) => onFormChange({ interval_months: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="next_due_date">Next Due Date</Label>
            <Input
              type="date"
              value={formData.next_due_date}
              onChange={(e) => onFormChange({ next_due_date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="next_due_odometer">Due at Odometer (KM)</Label>
            <Input
              type="number"
              placeholder="e.g., 50000"
              value={formData.next_due_odometer}
              onChange={(e) => onFormChange({ next_due_odometer: e.target.value })}
            />
          </div>

          <div className="space-y-2 col-span-1">
            <Label htmlFor="estimated_cost">Estimated Cost (R)</Label>
            <Input
              type="number"
              placeholder="e.g., 500"
              value={formData.estimated_cost}
              onChange={(e) => onFormChange({ estimated_cost: e.target.value })}
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            placeholder="Additional details about the maintenance..."
            value={formData.description}
            onChange={(e) => onFormChange({ description: e.target.value })}
            rows={3}
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-200">
            {error}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={loading}>
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Wrench className="w-4 h-4 mr-2" />
            )}
            {loading ? "Scheduling..." : "Schedule Maintenance"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}



