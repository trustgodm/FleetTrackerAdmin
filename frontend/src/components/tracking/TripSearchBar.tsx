import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface TripSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder: string;
}

export function TripSearchBar({ searchTerm, onSearchChange, placeholder }: TripSearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <Input 
        placeholder={placeholder}
        className="pl-10 w-64"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
