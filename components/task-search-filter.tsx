"use client"

import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { Search, X, Filter } from "lucide-react"

interface TaskSearchFilterProps {
  onSearchChange: (query: string) => void
  onFiltersChange: (statusFilters: string[], priorityFilters: string[]) => void
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
  onSearchChange,
  onFiltersChange,
  searchQuery,
  statusFilters,
  priorityFilters,
}: TaskSearchFilterProps) {
  const [searchValue, setSearchValue] = useState(searchQuery)

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value)
    onSearchChange(value)
  }, [onSearchChange])

  const handleClearSearch = useCallback(() => {
    setSearchValue("")
    onSearchChange("")
  }, [onSearchChange])

  const handleStatusFilterChange = useCallback((status: string, checked: boolean) => {
    const newStatusFilters = checked
      ? [...statusFilters, status]
      : statusFilters.filter(f => f !== status)
    onFiltersChange(newStatusFilters, priorityFilters)
  }, [statusFilters, priorityFilters, onFiltersChange])

  const handlePriorityFilterChange = useCallback((priority: string, checked: boolean) => {
    const newPriorityFilters = checked
      ? [...priorityFilters, priority]
      : priorityFilters.filter(f => f !== priority)
    onFiltersChange(statusFilters, newPriorityFilters)
  }, [statusFilters, priorityFilters, onFiltersChange])

  const activeFilterCount = statusFilters.length + priorityFilters.length
  const maxFilters = STATUS_OPTIONS.length + PRIORITY_OPTIONS.length

  return (
    <div className="flex items-center gap-3 mb-6">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9 pr-9"
        />
        {searchValue && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
            onClick={handleClearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <Filter className="h-4 w-4" />
            {activeFilterCount < maxFilters && activeFilterCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          {STATUS_OPTIONS.map((status) => (
            <DropdownMenuCheckboxItem
              key={status.value}
              checked={statusFilters.includes(status.value)}
              onCheckedChange={(checked) => handleStatusFilterChange(status.value, checked)}
            >
              {status.label}
            </DropdownMenuCheckboxItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Priority</DropdownMenuLabel>
          {PRIORITY_OPTIONS.map((priority) => (
            <DropdownMenuCheckboxItem
              key={priority.value}
              checked={priorityFilters.includes(priority.value)}
              onCheckedChange={(checked) => handlePriorityFilterChange(priority.value, checked)}
            >
              {priority.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}