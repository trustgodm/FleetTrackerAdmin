import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { vehiclesAPI, departmentsAPI } from "@/services/api";
import { toast } from "sonner";
import { Vehicle, Department, FleetStats, NewVehicleFormData } from "@/types/fleet";
import { FleetStatsCards } from "@/components/fleet/FleetStatsCards";
import { VehicleInventory } from "@/components/fleet/VehicleInventory";
import { AddVehicleDialog } from "@/components/fleet/AddVehicleDialog";
import { VehicleDetailsDialog } from "@/components/fleet/VehicleDetailsDialog";

function Fleet() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newVehicle, setNewVehicle] = useState<NewVehicleFormData>({
    name: "",
    number_plate: "",
    vin: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    fuel_type: "petrol",
    fuel_capacity: 0,
    department_id: ""
  });

  const getVehicles = async () => {
    try {
      setLoading(true);
      const response = await vehiclesAPI.getAll();
      setVehicles(response.data);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching vehicles:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const getDepartments = async () => {
    try {
      const response = await departmentsAPI.getAll();
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  useEffect(() => {
    getVehicles();
    getDepartments();
  }, []);

  const handleAddVehicle = async () => {
    if (!newVehicle.name.trim() || !newVehicle.number_plate.trim() || !newVehicle.make.trim() || !newVehicle.model.trim()) {
      toast.error("Name, number plate, make, and model are required");
      return;
    }

    if (newVehicle.year < 1900 || newVehicle.year > new Date().getFullYear() + 1) {
      toast.error("Year must be between 1900 and " + (new Date().getFullYear() + 1));
      return;
    }

    if (newVehicle.fuel_capacity <= 0) {
      toast.error("Fuel capacity must be greater than 0");
      return;
    }

    // Validate VIN if provided
    if (newVehicle.vin.trim() && newVehicle.vin.trim().length > 17) {
      toast.error("VIN must be 17 characters or less");
      return;
    }

    setIsSubmitting(true);
    try {
      const vehicleData = {
        name: newVehicle.name.trim(),
        number_plate: newVehicle.number_plate.trim(),
        vin: newVehicle.vin.trim() || null,
        make: newVehicle.make.trim(),
        model: newVehicle.model.trim(),
        year: parseInt(newVehicle.year.toString()),
        fuel_type: newVehicle.fuel_type,
        fuel_capacity: parseFloat(newVehicle.fuel_capacity.toString()),
        department_id: newVehicle.department_id || null
      };

      const response = await vehiclesAPI.create(vehicleData);
      
      if (response.success) {
        toast.success("Vehicle added successfully");
        getVehicles();
        resetForm();
        setIsAddDialogOpen(false);
      } else {
        toast.error(response.message || "Failed to add vehicle");
      }
    } catch (error: any) {
      console.error("Error adding vehicle:", error);
      toast.error(error.message || "Failed to add vehicle");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setNewVehicle({
      name: "",
      number_plate: "",
      vin: "",
      make: "",
      model: "",
      year: new Date().getFullYear(),
      fuel_type: "petrol",
      fuel_capacity: 0,
      department_id: ""
    });
  };

  const handleViewDetails = async (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDetailsDialogOpen(true);
  };

  const handleFormChange = (data: Partial<NewVehicleFormData>) => {
    setNewVehicle(prev => ({ ...prev, ...data }));
  };

  // Filter vehicles based on search term
  const filteredVehicles = vehicles.filter(vehicle => {
    const searchLower = searchTerm.toLowerCase();
    return (
      vehicle.name?.toLowerCase().includes(searchLower) ||
      vehicle.number_plate?.toLowerCase().includes(searchLower) ||
      vehicle.make?.toLowerCase().includes(searchLower) ||
      vehicle.model?.toLowerCase().includes(searchLower) ||
      vehicle.department?.name?.toLowerCase().includes(searchLower) ||
      vehicle.assigned_driver?.first_name?.toLowerCase().includes(searchLower) ||
      vehicle.assigned_driver?.last_name?.toLowerCase().includes(searchLower)
    );
  });

  // Calculate statistics
  const stats: FleetStats = {
    total: vehicles.length || 0,
    active: vehicles.filter(v => v.status === 'active').length,
    maintenance: vehicles.filter(v => v.status === 'maintenance').length,
    avgFuel: vehicles.length > 0 
      ? Math.round(vehicles.reduce((sum, v) => sum + (v.fuel_level || 0), 0) / vehicles.length)
      : 0
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading fleet data...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error loading fleet data: {error}</p>
            <Button onClick={getVehicles}>Retry</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Fleet Management</h1>
            <p className="text-muted-foreground">Manage your vehicle fleet across all departments</p>
          </div>
          <Button 
            className="bg-gradient-primary text-primary-foreground shadow-glow"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Vehicle
          </Button>
        </div>

        <FleetStatsCards stats={stats} />

        <VehicleInventory
          vehicles={filteredVehicles}
          allVehicles={vehicles}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onViewDetails={handleViewDetails}
        />

        <AddVehicleDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSubmit={handleAddVehicle}
          formData={newVehicle}
          onFormChange={handleFormChange}
          departments={departments}
          isSubmitting={isSubmitting}
          onReset={resetForm}
        />

        <VehicleDetailsDialog
          vehicle={selectedVehicle}
          isOpen={isDetailsDialogOpen}
          onClose={() => setIsDetailsDialogOpen(false)}
        />
      </div>
    </DashboardLayout>
  );
}

export default Fleet;