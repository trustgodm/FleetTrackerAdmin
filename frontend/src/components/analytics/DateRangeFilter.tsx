import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateRangeFilterProps {
  filterType: string;
  onFilterChange: (filter: string) => void;
  onDateRangeChange: (range: { start: string; end: string }) => void;
  customDateRange: { start: string; end: string };
  className?: string;
}

const filterOptions = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'custom', label: 'Custom Range' }
];

export function DateRangeFilter({ 
  filterType, 
  onFilterChange, 
  onDateRangeChange, 
  customDateRange,
  className 
}: DateRangeFilterProps) {
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  const handleFilterChange = (value: string) => {
    onFilterChange(value);
    if (value !== 'custom') {
      setIsCustomOpen(false);
    }
  };

  const handleCustomDateChange = (date: Date | undefined, type: 'start' | 'end') => {
    if (date) {
      const dateString = format(date, 'yyyy-MM-dd');
      const newRange = {
        ...customDateRange,
        [type]: dateString
      };
      onDateRangeChange(newRange);
    }
  };

  const clearFilter = () => {
    onFilterChange('all');
    onDateRangeChange({ start: '', end: '' });
  };

  const getFilterLabel = () => {
    const option = filterOptions.find(opt => opt.value === filterType);
    return option?.label || 'All Time';
  };

  const isCustomRangeValid = customDateRange.start && customDateRange.end;

  return (
    <Card className={cn("bg-gradient-card border-border shadow-card", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filter by:</span>
            
            <Select value={filterType} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select filter" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {filterType === 'custom' && (
              <Popover open={isCustomOpen} onOpenChange={setIsCustomOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !isCustomRangeValid && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {isCustomRangeValid ? (
                      `${format(new Date(customDateRange.start), 'MMM dd')} - ${format(new Date(customDateRange.end), 'MMM dd, yyyy')}`
                    ) : (
                      "Pick a date range"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-3">
                    <div className="space-y-2">
                      <div>
                        <label className="text-sm font-medium">Start Date</label>
                        <Calendar
                          mode="single"
                          selected={customDateRange.start ? new Date(customDateRange.start) : undefined}
                          onSelect={(date) => handleCustomDateChange(date, 'start')}
                          className="rounded-md border"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">End Date</label>
                        <Calendar
                          mode="single"
                          selected={customDateRange.end ? new Date(customDateRange.end) : undefined}
                          onSelect={(date) => handleCustomDateChange(date, 'end')}
                          className="rounded-md border"
                        />
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {filterType !== 'all' && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {getFilterLabel()}
              </Badge>
            )}
            
            {filterType !== 'all' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilter}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 