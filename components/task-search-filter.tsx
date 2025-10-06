"use client"

import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, X, Filter } from "lucide-react"

export interface FilterState {
  status: string[]
  priority: string[]
}

export interface TaskSearchFilterProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

const STATUS_OPTIONS = [
  { value: "todo", label: "Todo" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" }
]

const PRIORITY_OPTIONS = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" }
]

export function TaskSearchFilter({ searchTerm, onSearchChange, filters, onFiltersChange }: TaskSearchFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleClearSearch = useCallback(() => {
    onSearchChange("")
  }, [onSearchChange])

  const handleStatusChange = useCallback((status: string, checked: boolean) => {
    const newStatuses = checked 
      ? [...filters.status, status]
      : filters.status.filter(s => s !== status)
    
    onFiltersChange({
      ...filters,
      status: newStatuses
    })
  }, [filters, onFiltersChange])

  const handlePriorityChange = useCallback((priority: string, checked: boolean) => {
    const newPriorities = checked 
      ? [...filters.priority, priority]
      : filters.priority.filter(p => p !== priority)
    
    onFiltersChange({
      ...filters,
      priority: newPriorities
    })
  }, [filters, onFiltersChange])

  const getActiveFilterCount = () => {
    const totalOptions = STATUS_OPTIONS.length + PRIORITY_OPTIONS.length
    const activeOptions = filters.status.length + filters.priority.length
    return totalOptions - activeOptions
  }

  const activeFilterCount = getActiveFilterCount()

  return (
    <div className="flex gap-2 mb-6">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </Button>
        )}
      </div>

      {/* Filter Dropdown */}
      <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="default" className="relative">
            <Filter className="h-4 w-4 mr-2" />
            Filter
            {activeFilterCount > 0 && (
              <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs min-w-[1.25rem] h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          {STATUS_OPTIONS.map((status) => (
            <DropdownMenuItem key={status.value} onSelect={(e) => e.preventDefault()}>
              <div className="flex items-center space-x-2 w-full">
                <Checkbox
                  id={`status-${status.value}`}
                  checked={filters.status.includes(status.value)}
                  onCheckedChange={(checked) => handleStatusChange(status.value, checked as boolean)}
                />
                <label 
                  htmlFor={`status-${status.value}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {status.label}
                </label>
              </div>
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel>Priority</DropdownMenuLabel>
          {PRIORITY_OPTIONS.map((priority) => (
            <DropdownMenuItem key={priority.value} onSelect={(e) => e.preventDefault()}>
              <div className="flex items-center space-x-2 w-full">
                <Checkbox
                  id={`priority-${priority.value}`}
                  checked={filters.priority.includes(priority.value)}
                  onCheckedChange={(checked) => handlePriorityChange(priority.value, checked as boolean)}
                />
                <label 
                  htmlFor={`priority-${priority.value}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {priority.label}
                </label>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}