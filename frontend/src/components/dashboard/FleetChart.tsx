import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface Department {
  id: string;
  name: string;
  code: string;
  vehicles?: any[];
}

interface Vehicle {
  id: string;
  name: string;
  department_id?: string;
  status: string;
}

interface FleetChartProps {
  departments: Department[];
  vehicles: Vehicle[];
}

const COLORS = ["#4ade80", "#22c55e", "#16a34a", "#15803d", "#166534"];

export function FleetChart({ departments, vehicles }: FleetChartProps) {
  // Calculate fleet distribution by department
  const calculateFleetDistribution = () => {
    if (!departments.length || !vehicles.length) {
      return [];
    }

    return departments.map((dept, index) => {
      const departmentVehicles = vehicles.filter(v => v.department_id === dept.id);
      const vehicleCount = departmentVehicles.length;
      const percentage = Math.round((vehicleCount / vehicles.length) * 100);
      
      return {
        name: dept.name,
        value: percentage,
        vehicles: vehicleCount,
        color: COLORS[index % COLORS.length]
      };
    }).filter(item => item.vehicles > 0); // Only show departments with vehicles
  };

  const data = calculateFleetDistribution();
  const totalVehicles = vehicles.length;

  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardHeader>
        <CardTitle className="text-foreground">Fleet Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                    formatter={(value, name, props) => [
                      `${props.payload.vehicles} vehicles (${value}%)`,
                      props.payload.name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="text-center mt-4">
                <div className="text-2xl font-bold text-foreground">{totalVehicles}</div>
                <div className="text-sm text-muted-foreground">Total Vehicles</div>
              </div>
            </div>
            
            <div className="ml-6 space-y-3">
              {data.map((item, index) => (
                <div key={item.name} className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{item.vehicles} vehicles</div>
                  </div>
                  <div className="text-sm font-medium text-foreground">{item.value}%</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            <div className="text-center">
              <div className="text-lg font-medium mb-2">No Fleet Data</div>
              <div className="text-sm">No vehicles or departments found</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}