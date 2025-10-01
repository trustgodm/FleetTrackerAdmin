import { Badge } from "@/components/ui/badge";
import { Trip } from "@/types/tracking";

interface InspectionDetailsProps {
  inspections: Trip['inspections'];
}

export function InspectionDetails({ inspections }: InspectionDetailsProps) {
  if (!inspections || inspections.length === 0) return null;

  return (
    <div className="space-y-2">
      <span className="font-medium">Inspections:</span>
      {inspections.map((inspection) => (
        <div key={inspection.id} className="bg-card border rounded-lg p-3">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center space-x-2">
              <Badge 
                variant={
                  inspection.inspection_type === 'pre-trip' ? 'default' :
                  inspection.inspection_type === 'post-trip' ? 'secondary' :
                  inspection.inspection_type === 'routine' ? 'outline' : 'secondary'
                }
                className={
                  inspection.inspection_type === 'pre-trip' ? 'bg-primary text-primary-foreground' :
                  inspection.inspection_type === 'post-trip' ? 'bg-blue-600 text-white' :
                  inspection.inspection_type === 'routine' ? 'bg-green-600 text-white' :
                  'bg-gray-600 text-white'
                }
              >
                {inspection.inspection_type.replace('-', ' ').toUpperCase()}
              </Badge>
            </div>
            <Badge variant={inspection.needs_service ? 'destructive' : 'default'}>
              {inspection.needs_service ? 'Service Needed' : 'All Good'}
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className={`${inspection.all_windows_good ? 'text-green-600' : 'text-red-600'}`}>
              Windows: {inspection.all_windows_good ? '✓' : '✗'}
            </div>
            <div className={`${inspection.all_mirrors_good ? 'text-green-600' : 'text-red-600'}`}>
              Mirrors: {inspection.all_mirrors_good ? '✓' : '✗'}
            </div>
            <div className={`${inspection.all_tires_good ? 'text-green-600' : 'text-red-600'}`}>
              Tires: {inspection.all_tires_good ? '✓' : '✗'}
            </div>
            <div className={`${inspection.all_lights_good ? 'text-green-600' : 'text-red-600'}`}>
              Lights: {inspection.all_lights_good ? '✓' : '✗'}
            </div>
            <div className={`${inspection.all_doors_good ? 'text-green-600' : 'text-red-600'}`}>
              Doors: {inspection.all_doors_good ? '✓' : '✗'}
            </div>
            <div className={`${inspection.all_seats_good ? 'text-green-600' : 'text-red-600'}`}>
              Seats: {inspection.all_seats_good ? '✓' : '✗'}
            </div>
            <div className={`${inspection.needs_service ? 'text-green-600' : 'text-red-600'}`}>
              Needs Service: {inspection.needs_service ? '✗':'✓'}
            </div>
          </div>
          {inspection.notes && inspection.notes !== '""' && (
            <div className="mt-2">
              <span className="font-medium text-xs">Inspection Details:</span>
              {(() => {
                try {
                  const notesData = JSON.parse(inspection.notes);
                  const issueCategories = [
                    { key: 'windowIssues', label: 'Windows' },
                    { key: 'lightIssues', label: 'Lights' },
                    { key: 'mirrorIssues', label: 'Mirrors' },
                    { key: 'doorIssues', label: 'Doors' },
                    { key: 'seatIssues', label: 'Seats' },
                    { key: 'tireIssues', label: 'Tires' }
                  ];
                  
                  const hasAnyIssues = issueCategories.some(cat => 
                    notesData[cat.key] && notesData[cat.key].length > 0
                  );
                  
                  if (!hasAnyIssues) {
                    return (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ No issues reported in any category
                      </p>
                    );
                  }
                  
                  return (
                    <div className="mt-1 space-y-1">
                      {issueCategories.map(category => {
                        const issues = notesData[category.key] || [];
                        if (issues.length === 0) return null;
                        
                        return (
                          <div key={category.key} className="text-xs">
                            <span className="font-medium text-red-600">
                              {category.label} Issues:
                            </span>
                            <div className="ml-2">
                              {issues.map((issue: string, idx: number) => (
                                <p key={idx} className="text-red-600">• {issue}</p>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                } catch (e) {
                  // If JSON parsing fails, show raw notes
                  return (
                    <p className="text-xs text-muted-foreground mt-1">
                      {inspection.notes}
                    </p>
                  );
                }
              })()}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
