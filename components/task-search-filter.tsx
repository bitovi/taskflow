"use client"

import { useState, useEffect, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Filter, X } from "lucide-react"
import { getFilteredTasks } from "@/app/(dashboard)/tasks/actions"

import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null
}

interface TaskSearchFilterProps {
  onTasksChange: (tasks: TaskWithProfile[]) => void
  initialTasks: TaskWithProfile[]
}

const STATUS_OPTIONS = [
  { value: "todo", label: "Todo" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
]

const PRIORITY_OPTIONS = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
]

export function TaskSearchFilter({ onTasksChange, initialTasks }: TaskSearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilters, setStatusFilters] = useState<string[]>(STATUS_OPTIONS.map(s => s.value))
  const [priorityFilters, setPriorityFilters] = useState<string[]>(PRIORITY_OPTIONS.map(p => p.value))
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Apply filters whenever search query or filters change
  useEffect(() => {
    const applyFilters = async () => {
      startTransition(async () => {
        // If no search query and all filters selected, show all tasks
        if (!searchQuery && 
            statusFilters.length === STATUS_OPTIONS.length && 
            priorityFilters.length === PRIORITY_OPTIONS.length) {
          onTasksChange(initialTasks)
          return
        }

        const { tasks } = await getFilteredTasks(
          searchQuery || undefined,
          statusFilters.length === STATUS_OPTIONS.length ? undefined : statusFilters,
          priorityFilters.length === PRIORITY_OPTIONS.length ? undefined : priorityFilters
        )
        onTasksChange(tasks || [])
      })
    }

    applyFilters()
  }, [searchQuery, statusFilters, priorityFilters, onTasksChange, initialTasks])

  const handleClearSearch = () => {
    setSearchQuery("")
  }

  const handleStatusChange = (status: string, checked: boolean) => {
    if (checked) {
      setStatusFilters(prev => [...prev, status])
    } else {
      setStatusFilters(prev => prev.filter(s => s !== status))
    }
  }

  const handlePriorityChange = (priority: string, checked: boolean) => {
    if (checked) {
      setPriorityFilters(prev => [...prev, priority])
    } else {
      setPriorityFilters(prev => prev.filter(p => p !== priority))
    }
  }

  return (
    <div className="flex items-center gap-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSearch}
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-transparent"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filter Dropdown */}
      <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 p-4 space-y-4">
          {/* Status Section */}
          <div>
            <h4 className="font-semibold text-sm mb-2">Status</h4>
            <div className="space-y-2">
              {STATUS_OPTIONS.map(status => (
                <div key={status.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status.value}`}
                    checked={statusFilters.includes(status.value)}
                    onCheckedChange={(checked) => 
                      handleStatusChange(status.value, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`status-${status.value}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {status.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Section */}
          <div>
            <h4 className="font-semibold text-sm mb-2">Priority</h4>
            <div className="space-y-2">
              {PRIORITY_OPTIONS.map(priority => (
                <div key={priority.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`priority-${priority.value}`}
                    checked={priorityFilters.includes(priority.value)}
                    onCheckedChange={(checked) => 
                      handlePriorityChange(priority.value, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`priority-${priority.value}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {priority.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}