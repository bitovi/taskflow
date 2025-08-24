"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, X, Filter } from "lucide-react"

export type FilterOptions = {
  status: string[]
  priority: string[]
}

type SearchAndFilterProps = {
  searchText: string
  onSearchChange: (text: string) => void
  filterOptions: FilterOptions
  onFilterChange: (filters: FilterOptions) => void
}

const STATUS_OPTIONS = ["todo", "in_progress", "review", "done"]
const PRIORITY_OPTIONS = ["high", "medium", "low"]

const STATUS_LABELS = {
  todo: "Todo",
  in_progress: "In progress", 
  review: "Review",
  done: "Done"
}

const PRIORITY_LABELS = {
  high: "High",
  medium: "Medium",
  low: "Low"
}

export function SearchAndFilter({ 
  searchText, 
  onSearchChange, 
  filterOptions, 
  onFilterChange 
}: SearchAndFilterProps) {
  const handleClearSearch = () => {
    onSearchChange("")
  }

  const handleStatusToggle = (status: string, checked: boolean) => {
    const newStatus = checked 
      ? [...filterOptions.status, status]
      : filterOptions.status.filter(s => s !== status)
    
    onFilterChange({
      ...filterOptions,
      status: newStatus
    })
  }

  const handlePriorityToggle = (priority: string, checked: boolean) => {
    const newPriority = checked
      ? [...filterOptions.priority, priority] 
      : filterOptions.priority.filter(p => p !== priority)
    
    onFilterChange({
      ...filterOptions,
      priority: newPriority
    })
  }

  return (
    <div className="flex items-center space-x-2 mb-6">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchText && (
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          {STATUS_OPTIONS.map((status) => (
            <DropdownMenuCheckboxItem
              key={status}
              checked={filterOptions.status.includes(status)}
              onCheckedChange={(checked) => handleStatusToggle(status, checked)}
            >
              {STATUS_LABELS[status as keyof typeof STATUS_LABELS]}
            </DropdownMenuCheckboxItem>
          ))}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel>Priority</DropdownMenuLabel>
          {PRIORITY_OPTIONS.map((priority) => (
            <DropdownMenuCheckboxItem
              key={priority}
              checked={filterOptions.priority.includes(priority)}
              onCheckedChange={(checked) => handlePriorityToggle(priority, checked)}
            >
              {PRIORITY_LABELS[priority as keyof typeof PRIORITY_LABELS]}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}