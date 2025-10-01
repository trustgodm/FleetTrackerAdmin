import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { NewVehicleFormData, Department } from "@/types/fleet";

interface AddVehicleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: NewVehicleFormData;
  onFormChange: (data: Partial<NewVehicleFormData>) => void;
  departments: Department[];
  isSubmitting: boolean;
  onReset: () => void;
}

export function AddVehicleDialog({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onFormChange,
  departments,
  isSubmitting,
  onReset
}: AddVehicleDialogProps) {
  const handleClose = () => {
    onReset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onReset();
      }
      onClose();
    }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Vehicle</DialogTitle>
          <DialogDescription>
            Add a new vehicle to your fleet. Name, number plate, make, and model are required.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => onFormChange({ name: e.target.value })}
                placeholder="Vehicle Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="number_plate">Number Plate *</Label>
              <Input
                id="number_plate"
                value={formData.number_plate}
                onChange={(e) => onFormChange({ number_plate: e.target.value })}
                placeholder="ABC123GP"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vin">VIN (Optional)</Label>
              <Input
                id="vin"
                value={formData.vin}
                onChange={(e) => onFormChange({ vin: e.target.value })}
                placeholder="1HGBH41JXMN109186"
                maxLength={17}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="make">Make *</Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => onFormChange({ make: e.target.value })}
                placeholder="Toyota"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => onFormChange({ model: e.target.value })}
                placeholder="Hilux"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => onFormChange({ year: parseInt(e.target.value) || new Date().getFullYear() })}
                min={1900}
                max={new Date().getFullYear() + 1}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fuel_type">Fuel Type *</Label>
              <select
                id="fuel_type"
                value={formData.fuel_type}
                onChange={(e) => onFormChange({ fuel_type: e.target.value as any })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fuel_capacity">Fuel Capacity (L) *</Label>
              <Input
                id="fuel_capacity"
                type="number"
                value={formData.fuel_capacity}
                onChange={(e) => onFormChange({ fuel_capacity: parseFloat(e.target.value) || 0 })}
                min={0}
                step={0.1}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department_id">Department (Optional)</Label>
              <select
                id="department_id"
                value={formData.department_id}
                onChange={(e) => onFormChange({ department_id: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name} ({dept.code})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            {isSubmitting ? "Adding..." : "Add Vehicle"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
