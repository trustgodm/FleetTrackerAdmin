import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Navigation, Loader2 } from "lucide-react";
import { EndTripFormData } from "@/types/tracking";

interface EndTripDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: EndTripFormData;
  onFormChange: (data: Partial<EndTripFormData>) => void;
  loading: boolean;
}

export function EndTripDialog({ 
  isOpen, 
  onClose, 
  onSubmit, 
  formData, 
  onFormChange, 
  loading 
}: EndTripDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5" />
            End Trip
          </DialogTitle>
          <DialogDescription>
            Complete this trip by providing end details
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="end_location">End Location</Label>
            <Input
              placeholder="Enter end location"
              value={formData.end_location}
              onChange={(e) => onFormChange({ end_location: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="end_odometer">End Odometer (KM)</Label>
            <Input
              type="number"
              placeholder="Enter end odometer reading"
              value={formData.end_odometer}
              onChange={(e) => onFormChange({ end_odometer: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="fuel_level_end">End Fuel Level (%)</Label>
            <Input
              type="number"
              placeholder="Enter end fuel level"
              value={formData.fuel_level_end}
              onChange={(e) => onFormChange({ fuel_level_end: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              placeholder="Add any notes about the trip..."
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
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Navigation className="w-4 h-4 mr-2" />}
            End Trip
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
