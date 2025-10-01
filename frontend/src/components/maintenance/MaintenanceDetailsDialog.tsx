import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Wrench, X, Edit, CheckSquare, Trash2 } from "lucide-react";
import { MaintenanceSchedule, MAINTENANCE_TYPES } from "@/types/maintenance";

interface MaintenanceDetailsDialogProps {
  maintenance: MaintenanceSchedule | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onComplete: () => void;
  onDelete: () => void;
}

export function MaintenanceDetailsDialog({
  maintenance,
  isOpen,
  onClose,
  onEdit,
  onComplete,
  onDelete
}: MaintenanceDetailsDialogProps) {
  if (!maintenance) return null;

  const getMaintenanceStatus = () => {
    if (!maintenance.next_due_date) return { variant: 'default' as const, label: 'Scheduled' };
    
    const dueDate = new Date(maintenance.next_due_date);
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (now > dueDate) {
      return { variant: 'destructive' as const, label: 'Overdue' };
    } else if (diffDays <= 7 && diffDays >= 0) {
      return { variant: 'secondary' as const, label: 'Due Soon' };
    } else {
      return { variant: 'default' as const, label: 'Scheduled' };
    }
  };

  

  const status = getMaintenanceStatus();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            Maintenance Details
          </DialogTitle>
          <DialogDescription>
            View and manage maintenance schedule details
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Vehicle</Label>
              <p className="text-sm">{maintenance.vehicle?.number_plate} - {maintenance.vehicle?.make} {maintenance.vehicle?.model}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Maintenance Type</Label>
              <p className="text-sm">{MAINTENANCE_TYPES.find(t => t.value === maintenance.maintenance_type)?.label || maintenance.maintenance_type}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Next Due Date</Label>
              <p className="text-sm">{maintenance.next_due_date ? new Date(maintenance.next_due_date).toLocaleDateString() : 'Not set'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Due at Odometer</Label>
              <p className="text-sm">{maintenance.next_due_odometer || 0} km</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Estimated Cost</Label>
              <p className="text-sm">R{maintenance.estimated_cost || 0}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Status</Label>
              <Badge variant={status.variant}>
                {status.label}
              </Badge>
            </div>
          </div>
          
          {maintenance.description && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Description</Label>
              <p className="text-sm">{maintenance.description}</p>
            </div>
          )}
          
          {maintenance.last_performed_at && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Last Service Date</Label>
                <p className="text-sm">{new Date(maintenance.last_performed_at).toLocaleDateString()}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Last Service Odometer</Label>
                <p className="text-sm">{maintenance.last_service_odometer || 0} km</p>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
          <Button variant="outline" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" onClick={onComplete}>
            <CheckSquare className="w-4 h-4 mr-2" />
            Mark Complete
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Maintenance Schedule</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this maintenance schedule? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}



