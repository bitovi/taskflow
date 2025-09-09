"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Search, X, Filter } from "lucide-react"
import { TaskList } from "@/components/task-list"

import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

interface StatusFilters {
  todo: boolean
  in_progress: boolean
  review: boolean
  done: boolean
}

interface PriorityFilters {
  high: boolean
  medium: boolean
  low: boolean
}

interface TasksSearchAndFilterProps {
  initialTasks: TaskWithProfile[]
}

export function TasksSearchAndFilter({ initialTasks }: TasksSearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilters, setStatusFilters] = useState<StatusFilters>({
    todo: true,
    in_progress: true,
    review: true,
    done: true,
  })
  const [priorityFilters, setPriorityFilters] = useState<PriorityFilters>({
    high: true,
    medium: true,
    low: true,
  })

  // Filter tasks based on search query and filters
  const filteredTasks = useMemo(() => {
    return initialTasks.filter((task) => {
      // Check search query (case insensitive search in name and description)
      const matchesSearch = searchQuery === "" || 
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())

      // Check status filter
      const matchesStatus = statusFilters[task.status as keyof StatusFilters]

      // Check priority filter  
      const matchesPriority = priorityFilters[task.priority as keyof PriorityFilters]

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [initialTasks, searchQuery, statusFilters, priorityFilters])

  const handleStatusFilterChange = (status: keyof StatusFilters, checked: boolean) => {
    setStatusFilters(prev => ({
      ...prev,
      [status]: checked
    }))
  }

  const handlePriorityFilterChange = (priority: keyof PriorityFilters, checked: boolean) => {
    setPriorityFilters(prev => ({
      ...prev,
      [priority]: checked
    }))
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <div className="px-2 py-1 space-y-2">
              {Object.entries(statusFilters).map(([status, checked]) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={checked}
                    onCheckedChange={(checked) => handleStatusFilterChange(status as keyof StatusFilters, !!checked)}
                  />
                  <label htmlFor={`status-${status}`} className="text-sm capitalize cursor-pointer">
                    {status.replace("_", " ")}
                  </label>
                </div>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Priority</DropdownMenuLabel>
            <div className="px-2 py-1 space-y-2">
              {Object.entries(priorityFilters).map(([priority, checked]) => (
                <div key={priority} className="flex items-center space-x-2">
                  <Checkbox
                    id={`priority-${priority}`}
                    checked={checked}
                    onCheckedChange={(checked) => handlePriorityFilterChange(priority as keyof PriorityFilters, !!checked)}
                  />
                  <label htmlFor={`priority-${priority}`} className="text-sm capitalize cursor-pointer">
                    {priority}
                  </label>
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tasks List or No Results */}
      {filteredTasks.length > 0 ? (
        <TaskList initialTasks={filteredTasks} />
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No tasks match your search</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search terms or filter criteria to find what you're looking for.
          </p>
          {(searchQuery || !Object.values(statusFilters).every(Boolean) || !Object.values(priorityFilters).every(Boolean)) && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setStatusFilters({ todo: true, in_progress: true, review: true, done: true })
                setPriorityFilters({ high: true, medium: true, low: true })
              }}
            >
              Clear all filters
            </Button>
          )}
        </div>
      )}
    </div>
  )
}