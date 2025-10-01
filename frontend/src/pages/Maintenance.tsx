import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { maintenanceAPI, vehiclesAPI } from "@/services/api";
import { 
  MaintenanceSchedule, 
  Vehicle, 
  MaintenanceStats, 
  ScheduleMaintenanceFormData,
  EditMaintenanceFormData,
  CompleteMaintenanceFormData
} from "@/types/maintenance";
import { MaintenanceStatsCards } from "@/components/maintenance/MaintenanceStatsCards";
import { ScheduleMaintenanceDialog } from "@/components/maintenance/ScheduleMaintenanceDialog";
import { MaintenanceTabs } from "@/components/maintenance/MaintenanceTabs";
import { MaintenanceDetailsDialog } from "@/components/maintenance/MaintenanceDetailsDialog";
import { EditMaintenanceDialog } from "@/components/maintenance/EditMaintenanceDialog";
import { CompleteMaintenanceDialog } from "@/components/maintenance/CompleteMaintenanceDialog";

function Maintenance() {
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceSchedule[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<MaintenanceSchedule | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  
  const [completeForm, setCompleteForm] = useState<CompleteMaintenanceFormData>({
    actual_cost: '',
    notes: ''
  });
  
  const [editForm, setEditForm] = useState<EditMaintenanceFormData>({
    maintenance_type: '',
    description: '',
    interval_km: '',
    interval_months: '',
    next_due_date: '',
    next_due_odometer: '',
    estimated_cost: ''
  });
  
  const [scheduleForm, setScheduleForm] = useState<ScheduleMaintenanceFormData>({
    vehicle_id: '',
    maintenance_type: '',
    description: '',
    interval_km: '',
    interval_months: '',
    next_due_date: '',
    next_due_odometer: '',
    estimated_cost: ''
  });

  const fetchMaintenanceData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await maintenanceAPI.getAll();
      
      setMaintenanceRecords(response.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      console.error('Error fetching maintenance data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await vehiclesAPI.getAll();
      setVehicles(response.data || []);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
    }
  };

  useEffect(() => {
    fetchMaintenanceData();
    fetchVehicles();
  }, []);

  const handleScheduleMaintenance = async () => {
    if (!scheduleForm.vehicle_id || !scheduleForm.maintenance_type) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const maintenanceData = {
        vehicle_id: scheduleForm.vehicle_id,
        maintenance_type: scheduleForm.maintenance_type,
        description: scheduleForm.description || undefined,
        interval_km: scheduleForm.interval_km ? parseInt(scheduleForm.interval_km) : undefined,
        interval_months: scheduleForm.interval_months ? parseInt(scheduleForm.interval_months) : undefined,
        next_due_date: scheduleForm.next_due_date || undefined,
        next_due_odometer: scheduleForm.next_due_odometer ? parseInt(scheduleForm.next_due_odometer) : undefined,
        estimated_cost: scheduleForm.estimated_cost ? parseFloat(scheduleForm.estimated_cost) : undefined,
      };

      await maintenanceAPI.create(maintenanceData);
      
      // Reset form and close modal
      setScheduleForm({
        vehicle_id: '',
        maintenance_type: '',
        description: '',
        interval_km: '',
        interval_months: '',
        next_due_date: '',
        next_due_odometer: '',
        estimated_cost: ''
      });
      setShowScheduleModal(false);
      
      // Refresh data
      await fetchMaintenanceData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (maintenance: MaintenanceSchedule) => {
    setSelectedMaintenance(maintenance);
    setShowDetailsModal(true);
  };

  const handleEdit = () => {
    if (!selectedMaintenance) return;
    setShowEditModal(true);
    setShowDetailsModal(false);
    
    // Populate edit form with current maintenance data
    setEditForm({
      maintenance_type: selectedMaintenance.maintenance_type,
      description: selectedMaintenance.description || '',
      interval_km: selectedMaintenance.interval_km?.toString() || '',
      interval_months: selectedMaintenance.interval_months?.toString() || '',
      next_due_date: selectedMaintenance.next_due_date ? new Date(selectedMaintenance.next_due_date).toISOString().split('T')[0] : '',
      next_due_odometer: selectedMaintenance.next_due_odometer?.toString() || '',
      estimated_cost: selectedMaintenance.estimated_cost?.toString() || ''
    });
  };

  const handleEditMaintenance = async () => {
    if (!selectedMaintenance) return;
    
    setLoading(true);
    try {
      const updateData = {
        maintenance_type: editForm.maintenance_type,
        description: editForm.description || undefined,
        interval_km: editForm.interval_km ? parseInt(editForm.interval_km) : undefined,
        interval_months: editForm.interval_months ? parseInt(editForm.interval_months) : undefined,
        next_due_date: editForm.next_due_date || undefined,
        next_due_odometer: editForm.next_due_odometer ? parseInt(editForm.next_due_odometer) : undefined,
        estimated_cost: editForm.estimated_cost ? parseFloat(editForm.estimated_cost) : undefined,
      };

      await maintenanceAPI.update(selectedMaintenance.id, updateData);
      
      setShowEditModal(false);
      setSelectedMaintenance(null);
      setEditForm({
        maintenance_type: '',
        description: '',
        interval_km: '',
        interval_months: '',
        next_due_date: '',
        next_due_odometer: '',
        estimated_cost: ''
      });
      await fetchMaintenanceData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    if (!selectedMaintenance) return;
    setShowCompleteModal(true);
    setShowDetailsModal(false);
  };

  const handleDelete = async () => {
    if (!selectedMaintenance) return;
    
    setLoading(true);
    try {
      await maintenanceAPI.delete(selectedMaintenance.id);
      setShowDetailsModal(false);
      setSelectedMaintenance(null);
      await fetchMaintenanceData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteMaintenance = async () => {
    if (!selectedMaintenance) return;
    
    setLoading(true);
    try {
      await maintenanceAPI.update(selectedMaintenance.id, {
        last_performed_at: new Date().toISOString(),
        last_service_odometer: selectedMaintenance.vehicle?.current_odometer || 0,
        actual_cost: completeForm.actual_cost ? parseFloat(completeForm.actual_cost) : undefined,
        notes: completeForm.notes || undefined
      });
      
      setShowCompleteModal(false);
      setSelectedMaintenance(null);
      setCompleteForm({ actual_cost: '', notes: '' });
      await fetchMaintenanceData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleFormChange = (data: Partial<ScheduleMaintenanceFormData>) => {
    setScheduleForm(prev => ({ ...prev, ...data }));
  };

  const handleEditFormChange = (data: Partial<EditMaintenanceFormData>) => {
    setEditForm(prev => ({ ...prev, ...data }));
  };

  const handleCompleteFormChange = (data: Partial<CompleteMaintenanceFormData>) => {
    setCompleteForm(prev => ({ ...prev, ...data }));
    
  };



  if (loading && maintenanceRecords.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading maintenance data...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error && maintenanceRecords.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error loading maintenance data: {error}</p>
            <Button onClick={fetchMaintenanceData}>Retry</Button>
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
            <h1 className="text-3xl font-bold text-foreground">Maintenance Management</h1>
            <p className="text-muted-foreground">Schedule and track vehicle maintenance</p>
          </div>
          <ScheduleMaintenanceDialog
            isOpen={showScheduleModal}
            onOpenChange={setShowScheduleModal}
            formData={scheduleForm}
            onFormChange={handleScheduleFormChange}
            vehicles={vehicles}
            onSubmit={handleScheduleMaintenance}
            loading={loading}
            error={error}
          />
        </div>

        <MaintenanceStatsCards/>

        <MaintenanceTabs
          maintenanceRecords={maintenanceRecords}
          onViewDetails={handleViewDetails}
        />

        <MaintenanceDetailsDialog
          maintenance={selectedMaintenance}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          onEdit={handleEdit}
          onComplete={handleComplete}
          onDelete={handleDelete}
        />

        <EditMaintenanceDialog
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          formData={editForm}
          onFormChange={handleEditFormChange}
          onSubmit={handleEditMaintenance}
          loading={loading}
          error={error}
        />

        <CompleteMaintenanceDialog
          isOpen={showCompleteModal}
          onClose={() => setShowCompleteModal(false)}
          formData={completeForm}
          onFormChange={handleCompleteFormChange}
          onSubmit={handleCompleteMaintenance}
          loading={loading}
        />
      </div>
    </DashboardLayout>
  );
}

export default Maintenance;