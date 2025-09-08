"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, X, Filter } from "lucide-react"
import { TaskList } from "@/components/task-list"
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

type FilterState = {
  statuses: string[]
  priorities: string[]
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

export function TasksPageClient({ initialTasks }: { initialTasks: TaskWithProfile[] }) {
  const [searchText, setSearchText] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    statuses: STATUS_OPTIONS.map(opt => opt.value),
    priorities: PRIORITY_OPTIONS.map(opt => opt.value)
  })

  const handleClearSearch = () => {
    setSearchText("")
  }

  const handleStatusToggle = (status: string) => {
    setFilters(prev => ({
      ...prev,
      statuses: prev.statuses.includes(status)
        ? prev.statuses.filter(s => s !== status)
        : [...prev.statuses, status]
    }))
  }

  const handlePriorityToggle = (priority: string) => {
    setFilters(prev => ({
      ...prev,
      priorities: prev.priorities.includes(priority)
        ? prev.priorities.filter(p => p !== priority)
        : [...prev.priorities, priority]
    }))
  }

  const filteredTasks = initialTasks.filter(task => {
    // Text search filter
    const matchesSearch = searchText === "" || 
      task.name.toLowerCase().includes(searchText.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchText.toLowerCase()))
    
    // Status filter
    const matchesStatus = filters.statuses.includes(task.status)
    
    // Priority filter 
    const matchesPriority = filters.priorities.includes(task.priority)
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <div className="space-y-4">
      {/* Search and Filter Row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchText && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 hover:bg-transparent"
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
          <DropdownMenuContent align="end" className="w-48">
            <div className="p-2">
              <div className="mb-3">
                <div className="font-medium text-sm mb-2">Status</div>
                <div className="space-y-2">
                  {STATUS_OPTIONS.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${option.value}`}
                        checked={filters.statuses.includes(option.value)}
                        onCheckedChange={() => handleStatusToggle(option.value)}
                      />
                      <label
                        htmlFor={`status-${option.value}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <DropdownMenuSeparator />
              
              <div className="mt-3">
                <div className="font-medium text-sm mb-2">Priority</div>
                <div className="space-y-2">
                  {PRIORITY_OPTIONS.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`priority-${option.value}`}
                        checked={filters.priorities.includes(option.value)}
                        onCheckedChange={() => handlePriorityToggle(option.value)}
                      />
                      <label
                        htmlFor={`priority-${option.value}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Task List */}
      <TaskList initialTasks={filteredTasks} />
      
      {/* No Results Message */}
      {filteredTasks.length === 0 && initialTasks.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No tasks match the current search and filter criteria.</p>
        </div>
      )}
    </div>
  )
}