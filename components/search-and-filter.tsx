"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, X, Filter } from "lucide-react"

interface SearchAndFilterProps {
  onSearchChange: (search: string) => void
  onFiltersChange: (filters: FilterState) => void
  searchValue: string
  filters: FilterState
}

export interface FilterState {
  status: string[]
  priority: string[]
}

const statusOptions = [
  { value: "todo", label: "Todo" },
  { value: "in_progress", label: "In progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
  { value: "will_not_do", label: "Will not do" }
]

const priorityOptions = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" }
]

export function SearchAndFilter({ onSearchChange, onFiltersChange, searchValue, filters }: SearchAndFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value)
  }

  const handleClearSearch = () => {
    onSearchChange("")
  }

  const toggleStatusFilter = (status: string) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status]
    
    onFiltersChange({
      ...filters,
      status: newStatus
    })
  }

  const togglePriorityFilter = (priority: string) => {
    const newPriority = filters.priority.includes(priority)
      ? filters.priority.filter(p => p !== priority)
      : [...filters.priority, priority]
    
    onFiltersChange({
      ...filters,
      priority: newPriority
    })
  }

  const getActiveFilterCount = () => {
    const totalStatusOptions = statusOptions.length
    const totalPriorityOptions = priorityOptions.length
    const activeStatus = filters.status.length
    const activePriority = filters.priority.length
    
    // If all are selected, consider it as no filters applied
    if (activeStatus === totalStatusOptions && activePriority === totalPriorityOptions) {
      return 0
    }
    
    return (totalStatusOptions - activeStatus) + (totalPriorityOptions - activePriority)
  }

  const activeFilterCount = getActiveFilterCount()

  return (
    <div className="flex items-center space-x-2 mb-6">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search tasks..."
          value={searchValue}
          onChange={handleSearchChange}
          className="pl-10 pr-10"
        />
        {searchValue && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Dropdown */}
      <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <Filter className="h-4 w-4" />
            {activeFilterCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          {statusOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onSelect={(e) => {
                e.preventDefault()
                toggleStatusFilter(option.value)
              }}
              className="cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 border rounded ${
                  filters.status.includes(option.value) 
                    ? 'bg-primary border-primary' 
                    : 'border-muted-foreground'
                }`}>
                  {filters.status.includes(option.value) && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-sm" />
                    </div>
                  )}
                </div>
                <span>{option.label}</span>
              </div>
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel>Priority</DropdownMenuLabel>
          {priorityOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onSelect={(e) => {
                e.preventDefault()
                togglePriorityFilter(option.value)
              }}
              className="cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 border rounded ${
                  filters.priority.includes(option.value) 
                    ? 'bg-primary border-primary' 
                    : 'border-muted-foreground'
                }`}>
                  {filters.priority.includes(option.value) && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-sm" />
                    </div>
                  )}
                </div>
                <span>{option.label}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}