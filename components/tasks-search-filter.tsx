"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

type FilterOptions = {
  statuses: string[]
  priorities: string[]
}

type TasksSearchFilterProps = {
  onSearchChange: (search: string) => void
  onFilterChange: (filters: FilterOptions) => void
}

const STATUSES = [
  { value: "todo", label: "Todo" },
  { value: "in_progress", label: "In progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
]

const PRIORITIES = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
]

export function TasksSearchFilter({ onSearchChange, onFilterChange }: TasksSearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
    STATUSES.map((s) => s.value)
  )
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(
    PRIORITIES.map((p) => p.value)
  )

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onSearchChange(value)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    onSearchChange("")
  }

  const handleStatusToggle = (status: string) => {
    const newStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status]
    
    setSelectedStatuses(newStatuses)
    onFilterChange({
      statuses: newStatuses,
      priorities: selectedPriorities,
    })
  }

  const handlePriorityToggle = (priority: string) => {
    const newPriorities = selectedPriorities.includes(priority)
      ? selectedPriorities.filter((p) => p !== priority)
      : [...selectedPriorities, priority]
    
    setSelectedPriorities(newPriorities)
    onFilterChange({
      statuses: selectedStatuses,
      priorities: newPriorities,
    })
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9 pr-9"
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          {STATUSES.map((status) => (
            <DropdownMenuCheckboxItem
              key={status.value}
              checked={selectedStatuses.includes(status.value)}
              onCheckedChange={() => handleStatusToggle(status.value)}
            >
              {status.label}
            </DropdownMenuCheckboxItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Priority</DropdownMenuLabel>
          {PRIORITIES.map((priority) => (
            <DropdownMenuCheckboxItem
              key={priority.value}
              checked={selectedPriorities.includes(priority.value)}
              onCheckedChange={() => handlePriorityToggle(priority.value)}
            >
              {priority.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
