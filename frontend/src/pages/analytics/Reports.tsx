import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, BarChart3, TrendingUp, Calendar, Users, Car, Loader2, AlertTriangle } from "lucide-react";
import { DateRangeFilter } from "@/components/analytics/DateRangeFilter";
import { toast } from "sonner";

interface ReportType {
  name: string;
  endpoint: string;
  description: string;
  icon: React.ReactNode;
  category: 'fleet' | 'performance' | 'financial' | 'operational';
}

export default function Reports() {
  const [filterType, setFilterType] = useState('all');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [downloading, setDownloading] = useState<string | null>(null);

  const reportTypes: ReportType[] = [
    {
      name: "Monthly Fleet Summary",
      endpoint: "fleet-summary",
      description: "Comprehensive overview of fleet status, utilization, and performance metrics",
      icon: <Car className="h-5 w-5" />,
      category: 'fleet'
    },
    {
      name: "Fuel Consumption Report",
      endpoint: "fuel-consumption",
      description: "Detailed fuel usage analysis, costs, and efficiency metrics",
      icon: <TrendingUp className="h-5 w-5" />,
      category: 'financial'
    },
    {
      name: "Maintenance Schedule",
      endpoint: "maintenance-schedule",
      description: "Upcoming and completed maintenance tasks with cost analysis",
      icon: <Calendar className="h-5 w-5" />,
      category: 'operational'
    },
    {
      name: "Driver Performance",
      endpoint: "driver-performance",
      description: "Individual driver statistics, safety metrics, and performance rankings",
      icon: <Users className="h-5 w-5" />,
      category: 'performance'
    },
    {
      name: "Cost Analysis",
      endpoint: "cost-analysis",
      description: "Detailed cost breakdown including fuel, maintenance, and operational expenses",
      icon: <BarChart3 className="h-5 w-5" />,
      category: 'financial'
    },
    {
      name: "Utilization Report",
      endpoint: "utilization",
      description: "Vehicle utilization rates, efficiency metrics, and optimization recommendations",
      icon: <TrendingUp className="h-5 w-5" />,
      category: 'fleet'
    },
    {
      name: "Trip Analytics",
      endpoint: "trip-analytics",
      description: "Detailed trip data, routes, and performance analysis",
      icon: <FileText className="h-5 w-5" />,
      category: 'performance'
    },
    {
      name: "Department Performance",
      endpoint: "department-performance",
      description: "Department-wise fleet utilization and performance metrics",
      icon: <Users className="h-5 w-5" />,
      category: 'performance'
    }
  ];

  const handleFilterChange = (filter: string) => {
    setFilterType(filter);
  };

  const handleDateRangeChange = (range: { start: string; end: string }) => {
    setCustomDateRange(range);
  };

  const handleDownloadReport = async (endpoint: string, reportName: string) => {
    try {
      setDownloading(endpoint);
      const token = localStorage.getItem('authToken');
  
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const params = new URLSearchParams();
      if (filterType !== 'all') {
        params.append('filter', filterType);
        if (filterType === 'custom' && customDateRange.start && customDateRange.end) {
          params.append('start_date', customDateRange.start);
          params.append('end_date', customDateRange.end);
        }
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/reports/${endpoint}?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${endpoint}-${filterType}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`${reportName} downloaded successfully`);
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download report');
    } finally {
      setDownloading(null);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fleet':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-950/20';
      case 'performance':
        return 'text-green-600 bg-green-50 dark:bg-green-950/20';
      case 'financial':
        return 'text-purple-600 bg-purple-50 dark:bg-purple-950/20';
      case 'operational':
        return 'text-orange-600 bg-orange-50 dark:bg-orange-950/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-950/20';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'fleet':
        return 'Fleet Management';
      case 'performance':
        return 'Performance Analytics';
      case 'financial':
        return 'Financial Reports';
      case 'operational':
        return 'Operational Reports';
      default:
        return 'Other';
    }
  };

  const groupedReports = reportTypes.reduce((acc, report) => {
    if (!acc[report.category]) {
      acc[report.category] = [];
    }
    acc[report.category].push(report);
    return acc;
  }, {} as Record<string, ReportType[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Reports</h2>
          <p className="text-muted-foreground">Generate and download comprehensive fleet reports</p>
        </div>
        
        <DateRangeFilter
          filterType={filterType}
          onFilterChange={handleFilterChange}
          onDateRangeChange={handleDateRangeChange}
          customDateRange={customDateRange}
        />
      </div>

      {/* Report Categories */}
      {Object.entries(groupedReports).map(([category, reports]) => (
        <Card key={category} className="bg-card/80 backdrop-blur border-border shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(category)}`}>
                {getCategoryName(category)}
              </span>
            </CardTitle>
            <CardDescription>
              {category === 'fleet' && 'Fleet management and vehicle analytics reports'}
              {category === 'performance' && 'Driver and operational performance reports'}
              {category === 'financial' && 'Cost analysis and financial reports'}
              {category === 'operational' && 'Maintenance and operational reports'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.map((report) => (
                <div key={report.endpoint} className="flex justify-between items-center p-4 bg-background/50 rounded-lg border border-border hover:bg-background/70 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-primary">{report.icon}</span>
                      <span className="font-medium">{report.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                  </div>
                  <div className="ml-4">
                    <button 
                      onClick={() => handleDownloadReport(report.endpoint, report.name)}
                      disabled={downloading === report.endpoint}
                      className="text-primary hover:underline text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {downloading === report.endpoint ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4 mr-1" />
                      )}
                      {downloading === report.endpoint ? 'Downloading...' : 'Download'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Report Information */}
      <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
        <CardHeader>
          <CardTitle>Report Information</CardTitle>
          <CardDescription>Understanding the different types of reports available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-primary">Report Formats</h4>
              <div className="space-y-2 text-sm">
                <div>• All reports are generated in CSV format</div>
                <div>• Reports include date range filtering</div>
                <div>• Data is exported with proper headers</div>
                <div>• Compatible with Excel and other spreadsheet software</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-green-600">Usage Guidelines</h4>
              <div className="space-y-2 text-sm">
                <div>• Select appropriate date range for accurate data</div>
                <div>• Reports are generated based on current permissions</div>
                <div>• Large datasets may take longer to generate</div>
                <div>• Contact support for custom report requests</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-card/80 backdrop-blur border-border shadow-elegant">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common report combinations and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-background/50 rounded-lg border border-border">
              <h4 className="font-semibold mb-2">Monthly Summary</h4>
              <p className="text-sm text-muted-foreground mb-3">Get a complete monthly overview</p>
              <div className="space-y-1 text-xs">
                <div>• Fleet Summary</div>
                <div>• Cost Analysis</div>
                <div>• Driver Performance</div>
              </div>
            </div>
            
            <div className="p-4 bg-background/50 rounded-lg border border-border">
              <h4 className="font-semibold mb-2">Financial Review</h4>
              <p className="text-sm text-muted-foreground mb-3">Complete financial analysis</p>
              <div className="space-y-1 text-xs">
                <div>• Fuel Consumption</div>
                <div>• Cost Analysis</div>
                <div>• Maintenance Schedule</div>
              </div>
            </div>
            
            <div className="p-4 bg-background/50 rounded-lg border border-border">
              <h4 className="font-semibold mb-2">Performance Review</h4>
              <p className="text-sm text-muted-foreground mb-3">Driver and fleet performance</p>
              <div className="space-y-1 text-xs">
                <div>• Driver Performance</div>
                <div>• Utilization Report</div>
                <div>• Trip Analytics</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 