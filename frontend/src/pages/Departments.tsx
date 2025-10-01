import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building2, Users, Car, Fuel, AlertTriangle, Plus, Search, Filter, Loader2, CheckCircle } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { departmentsAPI } from "@/services/api";
import { toast } from "sonner";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    description: "",
    code: "",
    is_active: true
  });
  const [editDepartment, setEditDepartment] = useState({
    name: "",
    description: "",
    code: "",
    is_active: true
  });
 
  const getDepartments = async () => {
    setLoading(true);
  try {
    const response = await departmentsAPI.getAll();
    setDepartments(response.data);
    setLoading(false);
  } catch (error) {
    console.error('Error fetching departments:', error);
    setError(error.message);
    setLoading(false);
  }
}
 

  useEffect(() => {
    getDepartments();
  }, []);

const handleAddDepartment = async () => {
  if (!newDepartment.name.trim() || !newDepartment.code.trim()) {
    toast.error("Name and code are required");
    return;
  }

  setIsSubmitting(true);
  try{
    const response = await departmentsAPI.create({
      name: newDepartment.name.trim(),
      code: newDepartment.code.trim(),
      description: newDepartment.description.trim(),
      is_active: newDepartment.is_active
    });
    if(response.success){
      toast.success("Department added successfully");
      getDepartments();
      setNewDepartment({
        name: "",
        description: "",
        code: "",
        is_active: true
      });
      setIsAddDialogOpen(false);
    } else{
      toast.error(response.message || "Failed to add department");
    }
  }
  catch(error){
    console.error("Error adding department:", error);
    toast.error(error.message || "Failed to add department");
  } finally {
    setIsSubmitting(false);
  }
}

const resetForm = () => {
  setNewDepartment({
    name: "",
    description: "",
    code: "",
    is_active: true
  });
}

const handleViewDepartment = (department) => {
  setSelectedDepartment(department);
  setIsViewDialogOpen(true);
}

const handleEditDepartment = (department) => {
  setSelectedDepartment(department);
  setEditDepartment({
    name: department.name,
    description: department.description || "",
    code: department.code,
    is_active: department.is_active
  });
  setIsEditDialogOpen(true);
}

const handleUpdateDepartment = async () => {
  if (!editDepartment.name.trim() || !editDepartment.code.trim()) {
    toast.error("Name and code are required");
    return;
  }

  setIsUpdating(true);
  try {
    const response = await departmentsAPI.update(selectedDepartment.id, {
      name: editDepartment.name.trim(),
      code: editDepartment.code.trim(),
      description: editDepartment.description.trim(),
      is_active: editDepartment.is_active
    });
    
    if (response.success) {
      toast.success("Department updated successfully");
      getDepartments();
      setIsEditDialogOpen(false);
      setSelectedDepartment(null);
    } else {
      toast.error(response.message || "Failed to update department");
    }
  } catch (error) {
    console.error("Error updating department:", error);
    toast.error(error.message || "Failed to update department");
  } finally {
    setIsUpdating(false);
  }
}

const resetEditForm = () => {
  setEditDepartment({
    name: "",
    description: "",
    code: "",
    is_active: true
  });
  setSelectedDepartment(null);
}


  // Calculate department statistics
  const departmentStats = departments.map(dept => {
    // Use the nested vehicles and users arrays from the department data
    const deptVehicles = dept.vehicles || [];
    const deptUsers = dept.users || [];
    
    // Count vehicles by status
    const availableVehicles = deptVehicles.filter(v => v.status === 'available').length;
    const activeVehicles = deptVehicles.filter(v => v.status === 'active').length;
    const maintenanceVehicles = deptVehicles.filter(v => v.status === 'maintenance').length;
    const inactiveVehicles = deptVehicles.filter(v => v.status === 'inactive').length;
    
    // Calculate average fuel level (if available in vehicle data)
    const totalFuelLevel = deptVehicles.reduce((sum, v) => sum + (v.fuel_level || 0), 0);
    const avgFuelLevel = deptVehicles.length > 0 ? totalFuelLevel / deptVehicles.length : 0;
    
    return {
      ...dept,
      vehicleCount: deptVehicles.length,
      userCount: deptUsers.length,
      availableVehicles,
      activeVehicles,
      maintenanceVehicles,
      inactiveVehicles,
      avgFuelLevel: Math.round(avgFuelLevel)
    };
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading department data...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error loading department data: {error}</p>
            <Button onClick={() => { getDepartments(); }}>Retry</Button>
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
            <h1 className="text-3xl font-bold text-foreground">Department Management</h1>
            <p className="text-muted-foreground">Manage departments and their resources</p>
          </div>
          <Button className="bg-gradient-primary text-primary-foreground shadow-glow" onClick={() => {
             setIsAddDialogOpen(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Department
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {departmentStats.map((dept) => (
            <Card key={dept.id} className="bg-card/80 backdrop-blur border-border shadow-elegant">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      <Building2 className="w-5 h-5 mr-2 text-primary" />
                      {dept.name}
                    </CardTitle>
                    <CardDescription>{dept.description || 'No description'}</CardDescription>
                  </div>
                  <Badge variant="outline">{dept.code}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{dept.vehicleCount}</div>
                    <div className="text-xs text-muted-foreground flex items-center justify-center">
                      <Car className="w-3 h-3 mr-1" />
                      Vehicles
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{dept.userCount}</div>
                    <div className="text-xs text-muted-foreground flex items-center justify-center">
                      <Users className="w-3 h-3 mr-1" />
                      Staff
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Available</span>
                    <span className="font-medium">{dept.availableVehicles}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Active</span>
                    <span className="font-medium">{dept.activeVehicles}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">In Maintenance</span>
                    <span className="font-medium">{dept.maintenanceVehicles}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Inactive</span>
                    <span className="font-medium">{dept.inactiveVehicles}</span>
                  </div>
                </div>

                {dept.maintenanceVehicles > 0 && (
                  <div className="flex items-center p-2 bg-yellow-500/10 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" />
                    <span className="text-xs text-yellow-600">
                      {dept.maintenanceVehicles} vehicle(s) in maintenance
                    </span>
                  </div>
                )}

                                 <div className="flex space-x-2">
                   <Button 
                     variant="outline" 
                     size="sm" 
                     className="flex-1"
                     onClick={() => handleViewDepartment(dept)}
                   >
                     View Details
                   </Button>
                   <Button 
                     variant="outline" 
                     size="sm"
                     onClick={() => handleEditDepartment(dept)}
                   >
                     Edit
                   </Button>
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>

    
      </div>

             <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
         if (!open) {
           resetForm();
         }
         setIsAddDialogOpen(open);
       }}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>Add New Department</DialogTitle>
             <DialogDescription>
               Add a new department to your organization. Name and code are required.
             </DialogDescription>
           </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newDepartment.name}
                onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Code
              </Label>
              <Input
                id="code"
                value={newDepartment.code}
                onChange={(e) => setNewDepartment({ ...newDepartment, code: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={newDepartment.description}
                onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                className="col-span-3"
              />
            </div>
                         <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="is_active" className="text-right">
                 Status
               </Label>
               <select
                 id="is_active"
                 value={newDepartment.is_active ? "active" : "inactive"}
                 onChange={(e) => setNewDepartment({ ...newDepartment, is_active: e.target.value === "active" })}
                 className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
               >
                 <option value="active">Active</option>
                 <option value="inactive">Inactive</option>
               </select>
             </div>
          </div>
                     <DialogFooter>
             <Button variant="outline" onClick={() => {
               resetForm();
               setIsAddDialogOpen(false);
             }}>
               Cancel
             </Button>
            <Button onClick={handleAddDepartment} disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              {isSubmitting ? "Adding..." : "Add Department"}
            </Button>
          </DialogFooter>
                 </DialogContent>
       </Dialog>

       {/* View Department Details Dialog */}
       <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
         <DialogContent className="max-w-2xl">
           <DialogHeader>
             <DialogTitle>Department Details</DialogTitle>
             <DialogDescription>
               View detailed information about the department
             </DialogDescription>
           </DialogHeader>
           {selectedDepartment && (
             <div className="space-y-6">
               <div className="grid grid-cols-2 gap-6">
                 <div>
                   <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                   <p className="text-lg font-semibold">{selectedDepartment.name}</p>
                 </div>
                 <div>
                   <Label className="text-sm font-medium text-muted-foreground">Code</Label>
                   <p className="text-lg font-semibold">{selectedDepartment.code}</p>
                 </div>
               </div>
               
               <div>
                 <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                 <p className="text-sm">{selectedDepartment.description || 'No description provided'}</p>
               </div>

               <div className="grid grid-cols-2 gap-6">
                 <div>
                   <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                   <Badge variant={selectedDepartment.is_active ? "default" : "secondary"}>
                     {selectedDepartment.is_active ? "Active" : "Inactive"}
                   </Badge>
                 </div>
                 <div>
                   <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                   <p className="text-sm">{new Date(selectedDepartment.created_at).toLocaleDateString()}</p>
                 </div>
               </div>

               {/* Department Statistics */}
               <div className="border-t pt-4">
                 <h4 className="font-semibold mb-3">Department Statistics</h4>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="text-center p-3 bg-muted rounded-lg">
                     <div className="text-2xl font-bold text-primary">{(selectedDepartment.vehicles || []).length}</div>
                     <div className="text-xs text-muted-foreground">Total Vehicles</div>
                   </div>
                   <div className="text-center p-3 bg-muted rounded-lg">
                     <div className="text-2xl font-bold text-primary">{(selectedDepartment.users || []).length}</div>
                     <div className="text-xs text-muted-foreground">Total Staff</div>
                   </div>
                 </div>
               </div>

               {/* Vehicle List */}
               {selectedDepartment.vehicles && selectedDepartment.vehicles.length > 0 && (
                 <div className="border-t pt-4">
                   <h4 className="font-semibold mb-3">Assigned Vehicles</h4>
                   <div className="space-y-2 max-h-40 overflow-y-auto">
                     {selectedDepartment.vehicles.map((vehicle) => (
                       <div key={vehicle.id} className="flex items-center justify-between p-2 bg-muted rounded">
                         <div>
                           <p className="font-medium">{vehicle.number_plate}</p>
                           <p className="text-xs text-muted-foreground">{vehicle.make} {vehicle.model}</p>
                         </div>
                         <Badge variant={
                           vehicle.status === "active" ? "default" : 
                           vehicle.status === "maintenance" ? "destructive" : 
                           vehicle.status === "available" ? "secondary" : "outline"
                         }>
                           {vehicle.status}
                         </Badge>
                       </div>
                     ))}
                   </div>
                 </div>
               )}

               {/* Staff List */}
               {selectedDepartment.users && selectedDepartment.users.length > 0 && (
                 <div className="border-t pt-4">
                   <h4 className="font-semibold mb-3">Department Staff</h4>
                   <div className="space-y-2 max-h-40 overflow-y-auto">
                     {selectedDepartment.users.map((user) => (
                       <div key={user.id} className="flex items-center justify-between p-2 bg-muted rounded">
                         <div>
                           <p className="font-medium">{user.first_name} {user.last_name}</p>
                           <p className="text-xs text-muted-foreground">{user.email}</p>
                         </div>
                         <Badge variant="outline">{user.user_role}</Badge>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
             </div>
           )}
           <DialogFooter>
             <Button 
               variant="outline" 
               onClick={() => setIsViewDialogOpen(false)}
             >
               Close
             </Button>
             <Button 
               onClick={() => {
                 setIsViewDialogOpen(false);
                 handleEditDepartment(selectedDepartment);
               }}
             >
               Edit Department
             </Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>

       {/* Edit Department Dialog */}
       <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
         if (!open) {
           resetEditForm();
         }
         setIsEditDialogOpen(open);
       }}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>Edit Department</DialogTitle>
             <DialogDescription>
               Update department information. Name and code are required.
             </DialogDescription>
           </DialogHeader>
           <div className="grid gap-4 py-4">
             <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="edit-name" className="text-right">
                 Name
               </Label>
               <Input
                 id="edit-name"
                 value={editDepartment.name}
                 onChange={(e) => setEditDepartment({ ...editDepartment, name: e.target.value })}
                 className="col-span-3"
               />
             </div>
             <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="edit-code" className="text-right">
                 Code
               </Label>
               <Input
                 id="edit-code"
                 value={editDepartment.code}
                 onChange={(e) => setEditDepartment({ ...editDepartment, code: e.target.value })}
                 className="col-span-3"
               />
             </div>
             <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="edit-description" className="text-right">
                 Description
               </Label>
               <Textarea
                 id="edit-description"
                 value={editDepartment.description}
                 onChange={(e) => setEditDepartment({ ...editDepartment, description: e.target.value })}
                 className="col-span-3"
               />
             </div>
             <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="edit-is_active" className="text-right">
                 Status
               </Label>
               <select
                 id="edit-is_active"
                 value={editDepartment.is_active ? "active" : "inactive"}
                 onChange={(e) => setEditDepartment({ ...editDepartment, is_active: e.target.value === "active" })}
                 className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
               >
                 <option value="active">Active</option>
                 <option value="inactive">Inactive</option>
               </select>
             </div>
           </div>
           <DialogFooter>
             <Button variant="outline" onClick={() => {
               resetEditForm();
               setIsEditDialogOpen(false);
             }}>
               Cancel
             </Button>
             <Button onClick={handleUpdateDepartment} disabled={isUpdating}>
               {isUpdating ? (
                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
               ) : (
                 <CheckCircle className="mr-2 h-4 w-4" />
               )}
               {isUpdating ? "Updating..." : "Update Department"}
             </Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>
     </DashboardLayout>
   );
}