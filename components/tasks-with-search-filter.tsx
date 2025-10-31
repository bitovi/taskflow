"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import { Search, X, Filter } from "lucide-react"
import { TaskList } from "@/components/task-list"
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

type TasksWithSearchFilterProps = {
  initialTasks: TaskWithProfile[]
}

// Status mapping for filtering
const STATUS_OPTIONS = [
  { value: "todo", label: "Todo" },
  { value: "in_progress", label: "In progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
]

const PRIORITY_OPTIONS = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
]

export function TasksWithSearchFilter({ initialTasks }: TasksWithSearchFilterProps) {
  const [searchText, setSearchText] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
    STATUS_OPTIONS.map(s => s.value)
  )
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(
    PRIORITY_OPTIONS.map(p => p.value)
  )

  const handleClearSearch = () => {
    setSearchText("")
  }

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    )
  }

  const togglePriority = (priority: string) => {
    setSelectedPriorities(prev =>
      prev.includes(priority)
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    )
  }

  // Filter tasks based on search text and selected filters
  const filteredTasks = useMemo(() => {
    return initialTasks.filter(task => {
      // Filter by search text (search in name and description)
      const searchLower = searchText.toLowerCase()
      const matchesSearch = !searchText || 
        task.name.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)

      // Filter by status
      const matchesStatus = selectedStatuses.includes(task.status)

      // Filter by priority
      const matchesPriority = selectedPriorities.includes(task.priority)

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [initialTasks, searchText, selectedStatuses, selectedPriorities])

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex gap-2">
        {/* Search Input */}
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
              size="icon"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
              onClick={handleClearSearch}
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
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            {STATUS_OPTIONS.map(status => (
              <DropdownMenuCheckboxItem
                key={status.value}
                checked={selectedStatuses.includes(status.value)}
                onCheckedChange={() => toggleStatus(status.value)}
              >
                {status.label}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Priority</DropdownMenuLabel>
            {PRIORITY_OPTIONS.map(priority => (
              <DropdownMenuCheckboxItem
                key={priority.value}
                checked={selectedPriorities.includes(priority.value)}
                onCheckedChange={() => togglePriority(priority.value)}
              >
                {priority.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Task List or No Results Message */}
      {filteredTasks.length > 0 ? (
        <TaskList initialTasks={filteredTasks} />
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">
            No tasks match the current search and filter criteria.
          </p>
        </div>
      )}
    </div>
  )
}
