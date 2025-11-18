"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, X, SlidersHorizontal } from "lucide-react"

type FilterState = {
  statuses: Set<string>
  priorities: Set<string>
}

type TaskSearchFilterProps = {
  onSearchChange: (search: string) => void
  onFilterChange: (filters: FilterState) => void
}

const STATUS_OPTIONS = ["todo", "in_progress", "review", "done"] as const
const PRIORITY_OPTIONS = ["high", "medium", "low"] as const

export function TaskSearchFilter({ onSearchChange, onFilterChange }: TaskSearchFilterProps) {
  const [searchValue, setSearchValue] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    statuses: new Set(STATUS_OPTIONS),
    priorities: new Set(PRIORITY_OPTIONS),
  })

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    onSearchChange(value)
  }

  const handleClearSearch = () => {
    setSearchValue("")
    onSearchChange("")
  }

  const handleStatusToggle = (status: string) => {
    const newStatuses = new Set(filters.statuses)
    if (newStatuses.has(status)) {
      newStatuses.delete(status)
    } else {
      newStatuses.add(status)
    }
    const newFilters = { ...filters, statuses: newStatuses }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handlePriorityToggle = (priority: string) => {
    const newPriorities = new Set(filters.priorities)
    if (newPriorities.has(priority)) {
      newPriorities.delete(priority)
    } else {
      newPriorities.add(priority)
    }
    const newFilters = { ...filters, priorities: newPriorities }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const formatLabel = (value: string) => {
    return value
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search tasks..."
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9 pr-9"
        />
        {searchValue && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearSearch}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          {STATUS_OPTIONS.map((status) => (
            <DropdownMenuCheckboxItem
              key={status}
              checked={filters.statuses.has(status)}
              onCheckedChange={() => handleStatusToggle(status)}
            >
              {formatLabel(status)}
            </DropdownMenuCheckboxItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Priority</DropdownMenuLabel>
          {PRIORITY_OPTIONS.map((priority) => (
            <DropdownMenuCheckboxItem
              key={priority}
              checked={filters.priorities.has(priority)}
              onCheckedChange={() => handlePriorityToggle(priority)}
            >
              {formatLabel(priority)}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
