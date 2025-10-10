"use client"

import { useState, useCallback, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import { Search, X, Filter } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface TaskSearchFilterProps {
  onFilterChange: (searchTerm: string, statusFilters: string[], priorityFilters: string[]) => void;
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

export function TaskSearchFilter({ onFilterChange }: TaskSearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilters, setStatusFilters] = useState<string[]>(STATUS_OPTIONS.map(s => s.value))
  const [priorityFilters, setPriorityFilters] = useState<string[]>(PRIORITY_OPTIONS.map(p => p.value))

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value)
    onFilterChange(value, statusFilters, priorityFilters)
  }, [statusFilters, priorityFilters, onFilterChange])

  const handleStatusFilterChange = useCallback((status: string, checked: boolean) => {
    const newStatusFilters = checked 
      ? [...statusFilters, status]
      : statusFilters.filter(s => s !== status)
    setStatusFilters(newStatusFilters)
    onFilterChange(searchTerm, newStatusFilters, priorityFilters)
  }, [searchTerm, statusFilters, priorityFilters, onFilterChange])

  const handlePriorityFilterChange = useCallback((priority: string, checked: boolean) => {
    const newPriorityFilters = checked
      ? [...priorityFilters, priority]
      : priorityFilters.filter(p => p !== priority)
    setPriorityFilters(newPriorityFilters)
    onFilterChange(searchTerm, statusFilters, newPriorityFilters)
  }, [searchTerm, statusFilters, priorityFilters, onFilterChange])

  const handleClearSearch = useCallback(() => {
    setSearchTerm("")
    onFilterChange("", statusFilters, priorityFilters)
  }, [statusFilters, priorityFilters, onFilterChange])

  const activeFilterCount = useMemo(() => {
    return (STATUS_OPTIONS.length - statusFilters.length) + (PRIORITY_OPTIONS.length - priorityFilters.length)
  }, [statusFilters, priorityFilters])

  return (
    <div className="flex items-center space-x-4 mb-6">
      {/* Search Input */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="relative">
            <Filter className="h-4 w-4 mr-2" />
            Filter
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          {STATUS_OPTIONS.map((status) => (
            <DropdownMenuItem 
              key={status.value}
              className="flex items-center space-x-2 cursor-pointer"
              onSelect={(e) => e.preventDefault()}
            >
              <Checkbox
                checked={statusFilters.includes(status.value)}
                onCheckedChange={(checked) => 
                  handleStatusFilterChange(status.value, checked as boolean)
                }
              />
              <span>{status.label}</span>
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel>Priority</DropdownMenuLabel>
          {PRIORITY_OPTIONS.map((priority) => (
            <DropdownMenuItem 
              key={priority.value}
              className="flex items-center space-x-2 cursor-pointer"
              onSelect={(e) => e.preventDefault()}
            >
              <Checkbox
                checked={priorityFilters.includes(priority.value)}
                onCheckedChange={(checked) => 
                  handlePriorityFilterChange(priority.value, checked as boolean)
                }
              />
              <span>{priority.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}