"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, X, Filter } from "lucide-react"

interface SearchAndFilterProps {
  onSearchChange: (search: string) => void
  onFiltersChange: (filters: FilterState) => void
  searchValue: string
  filters: FilterState
}

export interface FilterState {
  status: {
    todo: boolean
    in_progress: boolean
    review: boolean
    done: boolean
  }
  priority: {
    high: boolean
    medium: boolean
    low: boolean
  }
}

export const defaultFilters: FilterState = {
  status: {
    todo: true,
    in_progress: true,
    review: true,
    done: true,
  },
  priority: {
    high: true,
    medium: true,
    low: true,
  },
}

export function SearchAndFilter({ onSearchChange, onFiltersChange, searchValue, filters }: SearchAndFilterProps) {
  const handleClearSearch = () => {
    onSearchChange("")
  }

  const handleStatusChange = (statusKey: keyof FilterState["status"], checked: boolean) => {
    const newFilters = {
      ...filters,
      status: {
        ...filters.status,
        [statusKey]: checked,
      },
    }
    onFiltersChange(newFilters)
  }

  const handlePriorityChange = (priorityKey: keyof FilterState["priority"], checked: boolean) => {
    const newFilters = {
      ...filters,
      priority: {
        ...filters.priority,
        [priorityKey]: checked,
      },
    }
    onFiltersChange(newFilters)
  }

  return (
    <div className="flex items-center space-x-4">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search tasks..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchValue && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="end">
          <div className="p-2">
            <div className="font-semibold text-sm mb-2">Status</div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="status-todo"
                  checked={filters.status.todo}
                  onCheckedChange={(checked) => handleStatusChange("todo", checked as boolean)}
                />
                <label htmlFor="status-todo" className="text-sm">Todo</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="status-in-progress"
                  checked={filters.status.in_progress}
                  onCheckedChange={(checked) => handleStatusChange("in_progress", checked as boolean)}
                />
                <label htmlFor="status-in-progress" className="text-sm">In Progress</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="status-review"
                  checked={filters.status.review}
                  onCheckedChange={(checked) => handleStatusChange("review", checked as boolean)}
                />
                <label htmlFor="status-review" className="text-sm">Review</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="status-done"
                  checked={filters.status.done}
                  onCheckedChange={(checked) => handleStatusChange("done", checked as boolean)}
                />
                <label htmlFor="status-done" className="text-sm">Done</label>
              </div>
            </div>
          </div>
          
          <DropdownMenuSeparator />
          
          <div className="p-2">
            <div className="font-semibold text-sm mb-2">Priority</div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="priority-high"
                  checked={filters.priority.high}
                  onCheckedChange={(checked) => handlePriorityChange("high", checked as boolean)}
                />
                <label htmlFor="priority-high" className="text-sm">High</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="priority-medium"
                  checked={filters.priority.medium}
                  onCheckedChange={(checked) => handlePriorityChange("medium", checked as boolean)}
                />
                <label htmlFor="priority-medium" className="text-sm">Medium</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="priority-low"
                  checked={filters.priority.low}
                  onCheckedChange={(checked) => handlePriorityChange("low", checked as boolean)}
                />
                <label htmlFor="priority-low" className="text-sm">Low</label>
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}