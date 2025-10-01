import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Loader2 } from "lucide-react";
import { EditMaintenanceFormData, MAINTENANCE_TYPES } from "@/types/maintenance";

interface EditMaintenanceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  formData: EditMaintenanceFormData;
  onFormChange: (data: Partial<EditMaintenanceFormData>) => void;
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
}

export function EditMaintenanceDialog({
  isOpen,
  onClose,
  formData,
  onFormChange,
  onSubmit,
  loading,
  error
}: EditMaintenanceDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Edit Maintenance Schedule
          </DialogTitle>
          <DialogDescription>
            Update the maintenance schedule details
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4">
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

          <div className="space-y-2">
            <Label htmlFor="estimated_cost">Estimated Cost (R)</Label>
            <Input
              type="number"
              placeholder="e.g., 500"
              value={formData.estimated_cost}
              onChange={(e) => onFormChange({ estimated_cost: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            placeholder="Additional details about the maintenance..."
            value={formData.description}
            onChange={(e) => onFormChange({ description: e.target.value })}
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Edit className="w-4 h-4 mr-2" />}
            Update Maintenance
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
