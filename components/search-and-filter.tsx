"use client"

import { useState, useCallback, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, X, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SearchAndFilterProps {
  onSearchChange: (searchQuery: string) => void
  onFilterChange: (statuses: string[], priorities: string[]) => void
  initialSearch?: string
  initialStatuses?: string[]
  initialPriorities?: string[]
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

export function SearchAndFilter({ 
  onSearchChange, 
  onFilterChange, 
  initialSearch = "",
  initialStatuses = STATUS_OPTIONS.map(s => s.value),
  initialPriorities = PRIORITY_OPTIONS.map(p => p.value)
}: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(initialStatuses)
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(initialPriorities)

  // Debounced search
  const debouncedSearchChange = useCallback(
    debounce((query: string) => {
      onSearchChange(query)
    }, 300),
    [onSearchChange]
  )

  useEffect(() => {
    debouncedSearchChange(searchQuery)
  }, [searchQuery, debouncedSearchChange])

  useEffect(() => {
    onFilterChange(selectedStatuses, selectedPriorities)
  }, [selectedStatuses, selectedPriorities, onFilterChange])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
  }

  const handleStatusChange = (status: string, checked: boolean) => {
    setSelectedStatuses(prev => 
      checked 
        ? [...prev, status]
        : prev.filter(s => s !== status)
    )
  }

  const handlePriorityChange = (priority: string, checked: boolean) => {
    setSelectedPriorities(prev => 
      checked 
        ? [...prev, priority]
        : prev.filter(p => p !== priority)
    )
  }

  const getActiveFiltersCount = () => {
    const totalOptions = STATUS_OPTIONS.length + PRIORITY_OPTIONS.length
    const selectedOptions = selectedStatuses.length + selectedPriorities.length
    return totalOptions - selectedOptions
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <div className="flex items-center space-x-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9 pr-9"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
            onClick={handleClearSearch}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="relative">
            <Filter className="mr-2 h-4 w-4" />
            Filter
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          {STATUS_OPTIONS.map((status) => (
            <DropdownMenuCheckboxItem
              key={status.value}
              checked={selectedStatuses.includes(status.value)}
              onCheckedChange={(checked) => handleStatusChange(status.value, checked)}
            >
              {status.label}
            </DropdownMenuCheckboxItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Priority</DropdownMenuLabel>
          {PRIORITY_OPTIONS.map((priority) => (
            <DropdownMenuCheckboxItem
              key={priority.value}
              checked={selectedPriorities.includes(priority.value)}
              onCheckedChange={(checked) => handlePriorityChange(priority.value, checked)}
            >
              {priority.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// Simple debounce utility
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout
  return ((...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }) as T
}