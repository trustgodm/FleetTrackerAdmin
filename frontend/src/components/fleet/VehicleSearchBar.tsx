import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface VehicleSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function VehicleSearchBar({ searchTerm, onSearchChange }: VehicleSearchBarProps) {
  return (
    <div className="relative w-64">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <Input
        placeholder="Search vehicles..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
