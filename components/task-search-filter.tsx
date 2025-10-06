"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, X, Filter } from "lucide-react"

interface TaskSearchFilterProps {
  onSearchChange: (query: string) => void
  onFiltersChange: (statusFilters: string[], priorityFilters: string[]) => void
  initialSearch?: string
  initialStatusFilters?: string[]
  initialPriorityFilters?: string[]
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
  onSearchChange,
  onFiltersChange,
  initialSearch = "",
  initialStatusFilters = ["todo", "in_progress", "review", "done"],
  initialPriorityFilters = ["high", "medium", "low"],
}: TaskSearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [statusFilters, setStatusFilters] = useState<string[]>(initialStatusFilters)
  const [priorityFilters, setPriorityFilters] = useState<string[]>(initialPriorityFilters)

  // Update search query
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onSearchChange(value)
  }

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("")
    onSearchChange("")
  }

  // Handle status filter changes
  const handleStatusFilterChange = (status: string, checked: boolean) => {
    const newStatusFilters = checked
      ? [...statusFilters, status]
      : statusFilters.filter(s => s !== status)
    
    setStatusFilters(newStatusFilters)
    onFiltersChange(newStatusFilters, priorityFilters)
  }

  // Handle priority filter changes
  const handlePriorityFilterChange = (priority: string, checked: boolean) => {
    const newPriorityFilters = checked
      ? [...priorityFilters, priority]
      : priorityFilters.filter(p => p !== priority)
    
    setPriorityFilters(newPriorityFilters)
    onFiltersChange(statusFilters, newPriorityFilters)
  }

  // Count active filters for badge
  const totalFilters = STATUS_OPTIONS.length + PRIORITY_OPTIONS.length
  const activeFilters = statusFilters.length + priorityFilters.length
  const hasFilterChanges = activeFilters < totalFilters

  return (
    <div className="flex items-center space-x-2 mb-6">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 hover:bg-muted"
            onClick={handleClearSearch}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <Filter className="h-4 w-4" />
            {hasFilterChanges && (
              <Badge 
                variant="secondary" 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
              >
                {activeFilters}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 p-4">
          <div className="space-y-4">
            {/* Status Filters */}
            <div>
              <h4 className="font-medium text-sm mb-3">Status</h4>
              <div className="space-y-2">
                {STATUS_OPTIONS.map((status) => (
                  <div key={status.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${status.value}`}
                      checked={statusFilters.includes(status.value)}
                      onCheckedChange={(checked) =>
                        handleStatusFilterChange(status.value, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`status-${status.value}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {status.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Priority Filters */}
            <div>
              <h4 className="font-medium text-sm mb-3">Priority</h4>
              <div className="space-y-2">
                {PRIORITY_OPTIONS.map((priority) => (
                  <div key={priority.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`priority-${priority.value}`}
                      checked={priorityFilters.includes(priority.value)}
                      onCheckedChange={(checked) =>
                        handlePriorityFilterChange(priority.value, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`priority-${priority.value}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {priority.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}