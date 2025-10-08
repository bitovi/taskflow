"use client"

import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, X, Filter } from "lucide-react"

interface TaskSearchFilterProps {
  onSearch: (query: string) => void
  onFilter: (statusFilters: string[], priorityFilters: string[]) => void
  searchQuery: string
  statusFilters: string[]
  priorityFilters: string[]
}

const STATUS_OPTIONS = [
  { value: "todo", label: "Todo" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
]

const PRIORITY_OPTIONS = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
]

export function TaskSearchFilter({
  onSearch,
  onFilter,
  searchQuery,
  statusFilters,
  priorityFilters,
}: TaskSearchFilterProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)

  const handleSearchChange = useCallback((value: string) => {
    setLocalSearchQuery(value)
    onSearch(value)
  }, [onSearch])

  const handleClearSearch = useCallback(() => {
    setLocalSearchQuery("")
    onSearch("")
  }, [onSearch])

  const handleStatusChange = useCallback((status: string, checked: boolean) => {
    const newFilters = checked
      ? [...statusFilters, status]
      : statusFilters.filter(s => s !== status)
    onFilter(newFilters, priorityFilters)
  }, [statusFilters, priorityFilters, onFilter])

  const handlePriorityChange = useCallback((priority: string, checked: boolean) => {
    const newFilters = checked
      ? [...priorityFilters, priority]
      : priorityFilters.filter(p => p !== priority)
    onFilter(statusFilters, newFilters)
  }, [statusFilters, priorityFilters, onFilter])

  const activeFiltersCount = statusFilters.length + priorityFilters.length
  const hasActiveFilters = activeFiltersCount > 0 && activeFiltersCount < (STATUS_OPTIONS.length + PRIORITY_OPTIONS.length)

  return (
    <div className="flex items-center space-x-2">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={localSearchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {localSearchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </Button>
        )}
      </div>

      {/* Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="relative">
            <Filter className="h-4 w-4" />
            {hasActiveFilters && (
              <Badge 
                variant="secondary" 
                className="ml-2 px-1.5 py-0.5 text-xs min-w-5 h-5 flex items-center justify-center"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          <div className="px-2 py-1 space-y-2">
            {STATUS_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${option.value}`}
                  checked={statusFilters.includes(option.value)}
                  onCheckedChange={(checked) => 
                    handleStatusChange(option.value, checked as boolean)
                  }
                />
                <label
                  htmlFor={`status-${option.value}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel>Priority</DropdownMenuLabel>
          <div className="px-2 py-1 space-y-2">
            {PRIORITY_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`priority-${option.value}`}
                  checked={priorityFilters.includes(option.value)}
                  onCheckedChange={(checked) => 
                    handlePriorityChange(option.value, checked as boolean)
                  }
                />
                <label
                  htmlFor={`priority-${option.value}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}