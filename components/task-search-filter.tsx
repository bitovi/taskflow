"use client"

import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, X, Filter } from "lucide-react"

export interface FilterState {
  search: string
  status: string[]
  priority: string[]
}

interface TaskSearchFilterProps {
  onFilterChange: (filters: FilterState) => void
  taskCount?: number
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

export function TaskSearchFilter({ onFilterChange, taskCount }: TaskSearchFilterProps) {
  const [searchText, setSearchText] = useState("")
  const [statusFilters, setStatusFilters] = useState<string[]>(STATUS_OPTIONS.map(opt => opt.value))
  const [priorityFilters, setPriorityFilters] = useState<string[]>(PRIORITY_OPTIONS.map(opt => opt.value))
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleFilterChange = useCallback(() => {
    onFilterChange({
      search: searchText,
      status: statusFilters,
      priority: priorityFilters,
    })
  }, [searchText, statusFilters, priorityFilters, onFilterChange])

  const handleSearchChange = (value: string) => {
    setSearchText(value)
    // Trigger filter change after search text updates
    setTimeout(() => {
      onFilterChange({
        search: value,
        status: statusFilters,
        priority: priorityFilters,
      })
    }, 0)
  }

  const handleClearSearch = () => {
    setSearchText("")
    onFilterChange({
      search: "",
      status: statusFilters,
      priority: priorityFilters,
    })
  }

  const handleStatusToggle = (status: string) => {
    const newStatusFilters = statusFilters.includes(status)
      ? statusFilters.filter(s => s !== status)
      : [...statusFilters, status]
    
    setStatusFilters(newStatusFilters)
    onFilterChange({
      search: searchText,
      status: newStatusFilters,
      priority: priorityFilters,
    })
  }

  const handlePriorityToggle = (priority: string) => {
    const newPriorityFilters = priorityFilters.includes(priority)
      ? priorityFilters.filter(p => p !== priority)
      : [...priorityFilters, priority]
    
    setPriorityFilters(newPriorityFilters)
    onFilterChange({
      search: searchText,
      status: statusFilters,
      priority: newPriorityFilters,
    })
  }

  const activeFilterCount = (STATUS_OPTIONS.length - statusFilters.length) + (PRIORITY_OPTIONS.length - priorityFilters.length)

  return (
    <div className="flex items-center gap-3 mb-6">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchText}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchText && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>

      {/* Filter Dropdown */}
      <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="relative">
            <Filter className="h-4 w-4 mr-2" />
            Filter
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2 px-1 py-0 text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5 text-sm font-semibold">Status</div>
          {STATUS_OPTIONS.map((status) => (
            <DropdownMenuItem
              key={status.value}
              className="flex items-center space-x-2 cursor-pointer"
              onSelect={(e) => {
                e.preventDefault()
                handleStatusToggle(status.value)
              }}
            >
              <Checkbox
                checked={statusFilters.includes(status.value)}
                onChange={() => handleStatusToggle(status.value)}
              />
              <span className="capitalize">{status.label}</span>
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          
          <div className="px-2 py-1.5 text-sm font-semibold">Priority</div>
          {PRIORITY_OPTIONS.map((priority) => (
            <DropdownMenuItem
              key={priority.value}
              className="flex items-center space-x-2 cursor-pointer"
              onSelect={(e) => {
                e.preventDefault()
                handlePriorityToggle(priority.value)
              }}
            >
              <Checkbox
                checked={priorityFilters.includes(priority.value)}
                onChange={() => handlePriorityToggle(priority.value)}
              />
              <span className="capitalize">{priority.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Results count */}
      {typeof taskCount === 'number' && (
        <div className="text-sm text-muted-foreground">
          {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
        </div>
      )}
    </div>
  )
}