"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, X, Filter } from "lucide-react"

interface TaskSearchFilterProps {
  onSearchChange: (searchTerm: string) => void
  onFiltersChange: (statusFilters: string[], priorityFilters: string[]) => void
  searchTerm: string
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
  searchTerm,
  statusFilters,
  priorityFilters
}: TaskSearchFilterProps) {
  const [open, setOpen] = useState(false)

  const handleClearSearch = () => {
    onSearchChange("")
  }

  const handleStatusChange = (status: string, checked: boolean) => {
    const newStatusFilters = checked
      ? [...statusFilters, status]
      : statusFilters.filter(s => s !== status)
    onFiltersChange(newStatusFilters, priorityFilters)
  }

  const handlePriorityChange = (priority: string, checked: boolean) => {
    const newPriorityFilters = checked
      ? [...priorityFilters, priority]
      : priorityFilters.filter(p => p !== priority)
    onFiltersChange(statusFilters, newPriorityFilters)
  }

  const hasActiveFilters = statusFilters.length > 0 || priorityFilters.length > 0

  return (
    <div className="flex items-center space-x-2">
      {/* Search Input */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 pr-9"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
            onClick={handleClearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filter Dropdown */}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className={hasActiveFilters ? "bg-accent" : ""}>
            <Filter className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="end">
          <div className="p-3 space-y-4">
            {/* Status Filters */}
            <div>
              <div className="font-medium text-sm mb-2">Status</div>
              <div className="space-y-2">
                {STATUS_OPTIONS.map((status) => (
                  <div key={status.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${status.value}`}
                      checked={statusFilters.includes(status.value)}
                      onCheckedChange={(checked) => handleStatusChange(status.value, checked as boolean)}
                    />
                    <label
                      htmlFor={`status-${status.value}`}
                      className="text-sm cursor-pointer"
                    >
                      {status.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Priority Filters */}
            <div>
              <div className="font-medium text-sm mb-2">Priority</div>
              <div className="space-y-2">
                {PRIORITY_OPTIONS.map((priority) => (
                  <div key={priority.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`priority-${priority.value}`}
                      checked={priorityFilters.includes(priority.value)}
                      onCheckedChange={(checked) => handlePriorityChange(priority.value, checked as boolean)}
                    />
                    <label
                      htmlFor={`priority-${priority.value}`}
                      className="text-sm cursor-pointer"
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