"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, X, Filter } from "lucide-react"
import { TaskList } from "@/components/task-list"

import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
  creator?: Pick<User, "name"> | null;
};

interface TasksSearchFilterProps {
  initialTasks: TaskWithProfile[];
}

export function TasksSearchFilter({ initialTasks }: TasksSearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilters, setStatusFilters] = useState({
    todo: true,
    in_progress: true,
    review: true,
    done: true,
  })
  const [priorityFilters, setPriorityFilters] = useState({
    high: true,
    medium: true,
    low: true,
  })

  const filteredTasks = useMemo(() => {
    return initialTasks.filter((task) => {
      // Search filter - check task name and description
      const searchMatch = searchQuery === "" || 
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))

      // Status filter
      const statusMatch = statusFilters[task.status as keyof typeof statusFilters]

      // Priority filter
      const priorityMatch = priorityFilters[task.priority as keyof typeof priorityFilters]

      return searchMatch && statusMatch && priorityMatch
    })
  }, [initialTasks, searchQuery, statusFilters, priorityFilters])

  const handleStatusChange = (status: keyof typeof statusFilters, checked: boolean) => {
    setStatusFilters(prev => ({ ...prev, [status]: checked }))
  }

  const handlePriorityChange = (priority: keyof typeof priorityFilters, checked: boolean) => {
    setPriorityFilters(prev => ({ ...prev, [priority]: checked }))
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex gap-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 h-10"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="p-4">
              {/* Status Section */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 text-sm text-foreground">Status</h4>
                <div className="space-y-3">
                  {[
                    { key: 'todo' as const, label: 'Todo', color: 'bg-orange-500' },
                    { key: 'in_progress' as const, label: 'In Progress', color: 'bg-orange-500' },
                    { key: 'review' as const, label: 'Review', color: 'bg-orange-500' },
                    { key: 'done' as const, label: 'Done', color: 'bg-orange-500' },
                  ].map(({ key, label, color }) => (
                    <div key={key} className="flex items-center space-x-3">
                      <Checkbox
                        id={`status-${key}`}
                        checked={statusFilters[key]}
                        onCheckedChange={(checked) => handleStatusChange(key, checked as boolean)}
                        className="border-border"
                      />
                      <div className={`w-4 h-4 rounded border ${color}`} />
                      <label
                        htmlFor={`status-${key}`}
                        className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority Section */}
              <div>
                <h4 className="font-medium mb-3 text-sm text-foreground">Priority</h4>
                <div className="space-y-3">
                  {[
                    { key: 'high' as const, label: 'High', color: 'bg-orange-500' },
                    { key: 'medium' as const, label: 'Medium', color: 'bg-orange-500' },
                    { key: 'low' as const, label: 'Low', color: 'bg-orange-500' },
                  ].map(({ key, label, color }) => (
                    <div key={key} className="flex items-center space-x-3">
                      <Checkbox
                        id={`priority-${key}`}
                        checked={priorityFilters[key]}
                        onCheckedChange={(checked) => handlePriorityChange(key, checked as boolean)}
                        className="border-border"
                      />
                      <div className={`w-4 h-4 rounded border ${color}`} />
                      <label
                        htmlFor={`priority-${key}`}
                        className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Results */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            No tasks match the current search and filter criteria
          </div>
        </div>
      ) : (
        <TaskList initialTasks={filteredTasks} />
      )}
    </div>
  )
}