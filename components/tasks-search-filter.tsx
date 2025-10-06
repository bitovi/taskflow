"use client"

import { useState, useEffect, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Search, X, Filter } from "lucide-react"
import { TaskList } from "@/components/task-list"
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
  creator?: Pick<User, "name"> | null;
};

interface TasksSearchFilterProps {
  initialTasks: TaskWithProfile[]
}

// Define the available filter options
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

export function TasksSearchFilter({ initialTasks }: TasksSearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
    STATUS_OPTIONS.map(option => option.value)
  )
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(
    PRIORITY_OPTIONS.map(option => option.value)
  )

  // Filter tasks based on search term and selected filters
  const filteredTasks = useMemo(() => {
    return initialTasks.filter(task => {
      // Check search term
      const matchesSearch = !searchTerm.trim() || 
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Check status filter
      const matchesStatus = selectedStatuses.includes(task.status)
      
      // Check priority filter
      const matchesPriority = selectedPriorities.includes(task.priority)
      
      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [initialTasks, searchTerm, selectedStatuses, selectedPriorities])

  const handleClearSearch = () => {
    setSearchTerm("")
  }

  const handleStatusToggle = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    )
  }

  const handlePriorityToggle = (priority: string) => {
    setSelectedPriorities(prev => 
      prev.includes(priority)
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    )
  }

  const activeFiltersCount = STATUS_OPTIONS.length + PRIORITY_OPTIONS.length - selectedStatuses.length - selectedPriorities.length

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="default" className="relative">
              <Filter className="h-4 w-4 mr-2" />
              Filter
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {/* Status Section */}
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            {STATUS_OPTIONS.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={selectedStatuses.includes(option.value)}
                onCheckedChange={() => handleStatusToggle(option.value)}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
            
            <DropdownMenuSeparator />
            
            {/* Priority Section */}
            <DropdownMenuLabel>Priority</DropdownMenuLabel>
            {PRIORITY_OPTIONS.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={selectedPriorities.includes(option.value)}
                onCheckedChange={() => handlePriorityToggle(option.value)}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Results */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No tasks match the current search and filter criteria.</p>
        </div>
      ) : (
        <TaskList initialTasks={filteredTasks} />
      )}
    </div>
  )
}