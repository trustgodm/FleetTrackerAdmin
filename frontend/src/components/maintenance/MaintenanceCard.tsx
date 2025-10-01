import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wrench, Clock, Eye } from "lucide-react";
import { MaintenanceSchedule, MAINTENANCE_TYPES } from "@/types/maintenance";

interface MaintenanceCardProps {
  record: MaintenanceSchedule;
  onViewDetails: (record: MaintenanceSchedule) => void;
  variant?: 'schedule' | 'upcoming';
}

export function MaintenanceCard({ record, onViewDetails, variant = 'schedule' }: MaintenanceCardProps) {
  const getMaintenanceStatus = () => {
    if (!record.next_due_date) return { variant: 'default' as const, label: 'Scheduled' };
    
    const dueDate = new Date(record.next_due_date);
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
  const maintenanceTypeLabel = MAINTENANCE_TYPES.find(t => t.value === record.maintenance_type)?.label || record.maintenance_type;

  return (
    <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
          {variant === 'upcoming' ? (
            <Clock className="w-6 h-6 text-primary-foreground" />
          ) : (
            <Wrench className="w-6 h-6 text-primary-foreground" />
          )}
        </div>
        <div>
          <div className="font-semibold text-foreground">
            {record.vehicle?.number_plate} - {maintenanceTypeLabel}
          </div>
          <div className="text-sm text-muted-foreground">{record.description}</div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-center">
          <div className="font-semibold text-foreground">
            {record.next_due_date ? new Date(record.next_due_date).toLocaleDateString() : 'Not set'}
          </div>
          <div className="text-xs text-muted-foreground">Due Date</div>
        </div>
        
        {variant === 'schedule' && (
          <>
            <div className="text-center">
              <div className="font-semibold text-foreground">{record.next_due_odometer || 0} km</div>
              <div className="text-xs text-muted-foreground">Due at Odometer</div>
            </div>
            
            <Badge variant={status.variant}>
              {status.label}
            </Badge>
            
            <div className="text-center">
              <div className="font-semibold text-foreground">R{record.estimated_cost || 0}</div>
              <div className="text-xs text-muted-foreground">Estimated Cost</div>
            </div>
          </>
        )}
        
        {variant === 'upcoming' && (
          <Badge variant="secondary">Due Soon</Badge>
        )}
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onViewDetails(record)}
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </Button>
      </div>
    </div>
  );
}
