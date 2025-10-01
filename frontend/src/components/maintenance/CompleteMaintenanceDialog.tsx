import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckSquare, Loader2 } from "lucide-react";
import { CompleteMaintenanceFormData } from "@/types/maintenance";

interface CompleteMaintenanceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  formData: CompleteMaintenanceFormData;
  onFormChange: (data: Partial<CompleteMaintenanceFormData>) => void;
  onSubmit: () => void;
  loading: boolean;
}

export function CompleteMaintenanceDialog({
  isOpen,
  onClose,
  formData,
  onFormChange,
  onSubmit,
  loading
}: CompleteMaintenanceDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5" />
            Complete Maintenance
          </DialogTitle>
          <DialogDescription>
            Mark this maintenance task as completed
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="actual_cost">Actual Cost (R)</Label>
            <Input
              type="number"
              placeholder="Enter actual cost"
              value={formData.actual_cost}
              onChange={(e) => onFormChange({ actual_cost: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              placeholder="Add any notes about the completed maintenance..."
              value={formData.notes}
              onChange={(e) => onFormChange({ notes: e.target.value })}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckSquare className="w-4 h-4 mr-2" />}
            Complete Maintenance
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
