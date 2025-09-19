"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, X, Filter } from "lucide-react"

interface SearchAndFilterProps {
  onSearchChange: (query: string) => void
  onFilterChange: (statusFilters: string[], priorityFilters: string[]) => void
  searchQuery: string
  statusFilters: string[]
  priorityFilters: string[]
}

const ALL_STATUSES = ["todo", "in_progress", "review", "done"]
const ALL_PRIORITIES = ["high", "medium", "low"]

const STATUS_LABELS = {
  todo: "Todo",
  in_progress: "In Progress",
  review: "Review",
  done: "Done",
}

const PRIORITY_LABELS = {
  high: "High",
  medium: "Medium",
  low: "Low",
}

export function SearchAndFilter({
  onSearchChange,
  onFilterChange,
  searchQuery,
  statusFilters,
  priorityFilters,
}: SearchAndFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleSearchChange = (value: string) => {
    onSearchChange(value)
  }

  const handleClearSearch = () => {
    onSearchChange("")
  }

  const handleStatusChange = (status: string, checked: boolean) => {
    const newStatusFilters = checked
      ? [...statusFilters, status]
      : statusFilters.filter((s) => s !== status)
    onFilterChange(newStatusFilters, priorityFilters)
  }

  const handlePriorityChange = (priority: string, checked: boolean) => {
    const newPriorityFilters = checked
      ? [...priorityFilters, priority]
      : priorityFilters.filter((p) => p !== priority)
    onFilterChange(statusFilters, newPriorityFilters)
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filter Dropdown */}
      <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 p-4">
          <div className="space-y-4">
            {/* Status Filters */}
            <div>
              <h4 className="font-medium text-sm mb-2">Status:</h4>
              <div className="space-y-2">
                {ALL_STATUSES.map((status) => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${status}`}
                      checked={statusFilters.includes(status)}
                      onCheckedChange={(checked) =>
                        handleStatusChange(status, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`status-${status}`}
                      className="text-sm cursor-pointer"
                    >
                      {STATUS_LABELS[status as keyof typeof STATUS_LABELS]}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Priority Filters */}
            <div>
              <h4 className="font-medium text-sm mb-2">Priority:</h4>
              <div className="space-y-2">
                {ALL_PRIORITIES.map((priority) => (
                  <div key={priority} className="flex items-center space-x-2">
                    <Checkbox
                      id={`priority-${priority}`}
                      checked={priorityFilters.includes(priority)}
                      onCheckedChange={(checked) =>
                        handlePriorityChange(priority, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`priority-${priority}`}
                      className="text-sm cursor-pointer"
                    >
                      {PRIORITY_LABELS[priority as keyof typeof PRIORITY_LABELS]}
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