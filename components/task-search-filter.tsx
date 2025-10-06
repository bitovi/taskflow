"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { Search, X, Filter } from "lucide-react"

interface TaskSearchFilterProps {
  onSearchChange: (search: string) => void
  onFiltersChange: (statusFilters: string[], priorityFilters: string[]) => void
  searchQuery: string
  statusFilters: string[]
  priorityFilters: string[]
}

const allStatuses = ["todo", "in_progress", "review", "done"]
const allPriorities = ["low", "medium", "high"]

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

  const handleStatusFilterToggle = (status: string, checked: boolean) => {
    if (checked) {
      onFiltersChange([...statusFilters, status], priorityFilters)
    } else {
      onFiltersChange(statusFilters.filter(s => s !== status), priorityFilters)
    }
  }

  const handlePriorityFilterToggle = (priority: string, checked: boolean) => {
    if (checked) {
      onFiltersChange(statusFilters, [...priorityFilters, priority])
    } else {
      onFiltersChange(statusFilters, priorityFilters.filter(p => p !== priority))
    }
  }

  const formatStatusDisplay = (status: string) => {
    switch (status) {
      case "todo": return "Todo"
      case "in_progress": return "In Progress"
      case "review": return "Review"
      case "done": return "Done"
      default: return status
    }
  }

  const formatPriorityDisplay = (priority: string) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1)
  }

  return (
    <div className="flex items-center gap-3 mb-6">
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
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
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
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          {allStatuses.map((status) => (
            <DropdownMenuCheckboxItem
              key={status}
              checked={statusFilters.includes(status)}
              onCheckedChange={(checked) => handleStatusFilterToggle(status, checked)}
            >
              {formatStatusDisplay(status)}
            </DropdownMenuCheckboxItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Priority</DropdownMenuLabel>
          {allPriorities.map((priority) => (
            <DropdownMenuCheckboxItem
              key={priority}
              checked={priorityFilters.includes(priority)}
              onCheckedChange={(checked) => handlePriorityFilterToggle(priority, checked)}
            >
              {formatPriorityDisplay(priority)}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}