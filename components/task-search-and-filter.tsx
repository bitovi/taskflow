"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, X, Filter } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { TaskList } from "@/components/task-list"

import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

type FilterState = {
  status: string[]
  priority: string[]
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

export function TaskSearchAndFilter({ initialTasks }: { initialTasks: TaskWithProfile[] }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    status: STATUS_OPTIONS.map(opt => opt.value),
    priority: PRIORITY_OPTIONS.map(opt => opt.value)
  })

  // Filter tasks based on search query and filter selections
  const filteredTasks = useMemo(() => {
    return initialTasks.filter(task => {
      // Search filter (case insensitive, searches name and description)
      const matchesSearch = searchQuery === "" || 
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))

      // Status filter
      const matchesStatus = filters.status.includes(task.status)

      // Priority filter  
      const matchesPriority = filters.priority.includes(task.priority)

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [initialTasks, searchQuery, filters])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  const toggleStatusFilter = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }))
  }

  const togglePriorityFilter = (priority: string) => {
    setFilters(prev => ({
      ...prev, 
      priority: prev.priority.includes(priority)
        ? prev.priority.filter(p => p !== priority)
        : [...prev.priority, priority]
    }))
  }

  const getActiveFilterCount = () => {
    const totalFilters = STATUS_OPTIONS.length + PRIORITY_OPTIONS.length
    const activeFilters = filters.status.length + filters.priority.length
    return totalFilters - activeFilters
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
              onClick={clearSearch}
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Filter className="h-4 w-4" />
              {getActiveFilterCount() > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" align="end">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            {STATUS_OPTIONS.map(status => (
              <DropdownMenuCheckboxItem
                key={status.value}
                checked={filters.status.includes(status.value)}
                onCheckedChange={() => toggleStatusFilter(status.value)}
              >
                {status.label}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
            {PRIORITY_OPTIONS.map(priority => (
              <DropdownMenuCheckboxItem
                key={priority.value}
                checked={filters.priority.includes(priority.value)}
                onCheckedChange={() => togglePriorityFilter(priority.value)}
              >
                {priority.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* No Results Message */}
      {filteredTasks.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No tasks match the current search and filter criteria.</p>
          <p className="text-sm mt-2">Try adjusting your search terms or filter options.</p>
        </div>
      )}

      {/* Task List */}
      {filteredTasks.length > 0 && (
        <TaskList initialTasks={filteredTasks} />
      )}
    </div>
  )
}