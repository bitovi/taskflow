"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Search, X, Filter } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface FilterState {
  status: string[]
  priority: string[]
}

interface SearchAndFilterProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
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

export function SearchAndFilter({ searchQuery, onSearchChange, filters, onFiltersChange }: SearchAndFilterProps) {
  const handleStatusChange = (status: string, checked: boolean) => {
    const newStatus = checked 
      ? [...filters.status, status]
      : filters.status.filter(s => s !== status)
    
    onFiltersChange({
      ...filters,
      status: newStatus
    })
  }

  const handlePriorityChange = (priority: string, checked: boolean) => {
    const newPriority = checked 
      ? [...filters.priority, priority]
      : filters.priority.filter(p => p !== priority)
    
    onFiltersChange({
      ...filters,
      priority: newPriority
    })
  }

  const clearSearch = () => {
    onSearchChange("")
  }

  return (
    <div className="flex items-center space-x-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
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
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          {STATUS_OPTIONS.map((option) => (
            <DropdownMenuItem key={option.value} className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                checked={filters.status.includes(option.value)}
                onCheckedChange={(checked) => handleStatusChange(option.value, checked as boolean)}
              />
              <span>{option.label}</span>
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel>Priority</DropdownMenuLabel>
          {PRIORITY_OPTIONS.map((option) => (
            <DropdownMenuItem key={option.value} className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                checked={filters.priority.includes(option.value)}
                onCheckedChange={(checked) => handlePriorityChange(option.value, checked as boolean)}
              />
              <span>{option.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}