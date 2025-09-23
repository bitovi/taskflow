"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu"
import { Search, X, Filter } from "lucide-react"

type FilterState = {
  search: string;
  statuses: string[];
  priorities: string[];
}

type TaskSearchFilterProps = {
  onFiltersChange: (filters: FilterState) => void;
  isLoading?: boolean;
}

const STATUS_OPTIONS = [
  { value: "todo", label: "Todo" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" }
];

const PRIORITY_OPTIONS = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" }
];

export function TaskSearchFilter({ onFiltersChange, isLoading = false }: TaskSearchFilterProps) {
  const [search, setSearch] = useState("")
  const [statuses, setStatuses] = useState<string[]>(STATUS_OPTIONS.map(s => s.value))
  const [priorities, setPriorities] = useState<string[]>(PRIORITY_OPTIONS.map(p => p.value))

  // Notify parent component when filters change
  useEffect(() => {
    onFiltersChange({ search, statuses, priorities });
  }, [search, statuses, priorities, onFiltersChange]);

  const handleClearSearch = () => {
    setSearch("");
  };

  const handleStatusChange = (statusValue: string, checked: boolean) => {
    if (checked) {
      setStatuses(prev => [...prev, statusValue]);
    } else {
      setStatuses(prev => prev.filter(s => s !== statusValue));
    }
  };

  const handlePriorityChange = (priorityValue: string, checked: boolean) => {
    if (checked) {
      setPriorities(prev => [...prev, priorityValue]);
    } else {
      setPriorities(prev => prev.filter(p => p !== priorityValue));
    }
  };

  const hasActiveFilters = search || statuses.length < STATUS_OPTIONS.length || priorities.length < PRIORITY_OPTIONS.length;

  return (
    <div className="flex items-center gap-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-10"
          disabled={isLoading}
        />
        {search && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
            onClick={handleClearSearch}
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="icon"
            disabled={isLoading}
            className={hasActiveFilters ? "bg-primary/10 border-primary" : ""}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {/* Status Section */}
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          {STATUS_OPTIONS.map((status) => (
            <DropdownMenuCheckboxItem
              key={status.value}
              checked={statuses.includes(status.value)}
              onCheckedChange={(checked) => handleStatusChange(status.value, checked)}
            >
              {status.label}
            </DropdownMenuCheckboxItem>
          ))}
          
          <DropdownMenuSeparator />
          
          {/* Priority Section */}
          <DropdownMenuLabel>Priority</DropdownMenuLabel>
          {PRIORITY_OPTIONS.map((priority) => (
            <DropdownMenuCheckboxItem
              key={priority.value}
              checked={priorities.includes(priority.value)}
              onCheckedChange={(checked) => handlePriorityChange(priority.value, checked)}
            >
              {priority.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}