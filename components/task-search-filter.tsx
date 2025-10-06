"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
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
  { value: "done", label: "Done" }
]

const PRIORITY_OPTIONS = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" }
]

export function TaskSearchFilter({
  onSearchChange,
  onFiltersChange,
  searchQuery,
  statusFilters,
  priorityFilters
}: TaskSearchFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value)
  }

  const handleClearSearch = () => {
    onSearchChange("")
  }

  const handleStatusFilterChange = (status: string, checked: boolean) => {
    const newFilters = checked
      ? [...statusFilters, status]
      : statusFilters.filter(s => s !== status)
    onFiltersChange(newFilters, priorityFilters)
  }

  const handlePriorityFilterChange = (priority: string, checked: boolean) => {
    const newFilters = checked
      ? [...priorityFilters, priority]
      : priorityFilters.filter(p => p !== priority)
    onFiltersChange(statusFilters, newFilters)
  }

  return (
    <div className="flex items-center space-x-2 mb-6">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10 pr-10"
        />
        {searchQuery && (
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
      <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          {STATUS_OPTIONS.map((status) => (
            <DropdownMenuItem key={status.value} className="flex items-center space-x-2">
              <Checkbox
                checked={statusFilters.includes(status.value)}
                onCheckedChange={(checked) => handleStatusFilterChange(status.value, !!checked)}
              />
              <span>{status.label}</span>
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel>Priority</DropdownMenuLabel>
          {PRIORITY_OPTIONS.map((priority) => (
            <DropdownMenuItem key={priority.value} className="flex items-center space-x-2">
              <Checkbox
                checked={priorityFilters.includes(priority.value)}
                onCheckedChange={(checked) => handlePriorityFilterChange(priority.value, !!checked)}
              />
              <span>{priority.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}