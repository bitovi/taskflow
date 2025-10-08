"use client"

import { useState, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger, 
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import { Search, Filter, X } from "lucide-react"

interface TaskSearchFilterProps {
  searchQuery: string
  statusFilters: string[]
  priorityFilters: string[]
  onSearchChange: (query: string) => void
  onStatusFiltersChange: (filters: string[]) => void
  onPriorityFiltersChange: (filters: string[]) => void
  onClearSearch: () => void
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
  searchQuery,
  statusFilters,
  priorityFilters,
  onSearchChange,
  onStatusFiltersChange,
  onPriorityFiltersChange,
  onClearSearch
}: TaskSearchFilterProps) {
  const [isPending, startTransition] = useTransition()

  const handleStatusToggle = (status: string) => {
    startTransition(() => {
      if (statusFilters.includes(status)) {
        onStatusFiltersChange(statusFilters.filter(s => s !== status))
      } else {
        onStatusFiltersChange([...statusFilters, status])
      }
    })
  }

  const handlePriorityToggle = (priority: string) => {
    startTransition(() => {
      if (priorityFilters.includes(priority)) {
        onPriorityFiltersChange(priorityFilters.filter(p => p !== priority))
      } else {
        onPriorityFiltersChange([...priorityFilters, priority])
      }
    })
  }

  const activeFiltersCount = statusFilters.length + priorityFilters.length

  return (
    <div className="flex items-center space-x-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>

      {/* Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="relative">
            <Filter className="h-4 w-4 mr-2" />
            Filter
            {activeFiltersCount > 0 && (
              <Badge 
                variant="secondary" 
                className="ml-2 px-1.5 py-0.5 text-xs h-5 min-w-5 flex items-center justify-center"
              >
                {activeFiltersCount}
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
              onCheckedChange={() => handleStatusToggle(status.value)}
              disabled={isPending}
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
              onCheckedChange={() => handlePriorityToggle(priority.value)}
              disabled={isPending}
            >
              {priority.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}