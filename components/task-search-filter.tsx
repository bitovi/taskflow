"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, X, Filter } from "lucide-react"

interface TaskSearchFilterProps {
  onSearchChange: (search: string) => void
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
  initialStatusFilters = STATUS_OPTIONS.map(s => s.value),
  initialPriorityFilters = PRIORITY_OPTIONS.map(p => p.value)
}: TaskSearchFilterProps) {
  const [search, setSearch] = useState(initialSearch)
  const [statusFilters, setStatusFilters] = useState<string[]>(initialStatusFilters)
  const [priorityFilters, setPriorityFilters] = useState<string[]>(initialPriorityFilters)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Notify parent when search changes
  useEffect(() => {
    onSearchChange(search)
  }, [search, onSearchChange])

  // Notify parent when filters change
  useEffect(() => {
    onFiltersChange(statusFilters, priorityFilters)
  }, [statusFilters, priorityFilters, onFiltersChange])

  const handleSearchChange = (value: string) => {
    setSearch(value)
  }

  const clearSearch = () => {
    setSearch("")
  }

  const toggleStatusFilter = (status: string) => {
    setStatusFilters(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    )
  }

  const togglePriorityFilter = (priority: string) => {
    setPriorityFilters(prev => 
      prev.includes(priority) 
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    )
  }

  return (
    <div className="flex items-center space-x-2 mb-6">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {search && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filter Dropdown */}
      <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <div className="p-2">
            <div className="font-semibold text-sm mb-2">Status</div>
            {STATUS_OPTIONS.map((status) => (
              <div key={status.value} className="flex items-center space-x-2 py-1">
                <Checkbox
                  id={`status-${status.value}`}
                  checked={statusFilters.includes(status.value)}
                  onCheckedChange={() => toggleStatusFilter(status.value)}
                />
                <label 
                  htmlFor={`status-${status.value}`}
                  className="text-sm font-normal cursor-pointer flex-1"
                >
                  {status.label}
                </label>
              </div>
            ))}
            
            <DropdownMenuSeparator className="my-2" />
            
            <div className="font-semibold text-sm mb-2">Priority</div>
            {PRIORITY_OPTIONS.map((priority) => (
              <div key={priority.value} className="flex items-center space-x-2 py-1">
                <Checkbox
                  id={`priority-${priority.value}`}
                  checked={priorityFilters.includes(priority.value)}
                  onCheckedChange={() => togglePriorityFilter(priority.value)}
                />
                <label 
                  htmlFor={`priority-${priority.value}`}
                  className="text-sm font-normal cursor-pointer flex-1"
                >
                  {priority.label}
                </label>
              </div>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}