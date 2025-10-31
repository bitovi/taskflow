"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TaskList } from "@/components/task-list"
import { Search, X, Filter } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null
}

interface TasksWithSearchProps {
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

export function TasksWithSearch({ initialTasks }: TasksWithSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
    STATUS_OPTIONS.map(opt => opt.value)
  )
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(
    PRIORITY_OPTIONS.map(opt => opt.value)
  )

  const handleClearSearch = () => {
    setSearchQuery("")
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

  const filteredTasks = useMemo(() => {
    return initialTasks.filter(task => {
      // Apply search filter
      const matchesSearch = searchQuery.trim() === "" ||
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description || "").toLowerCase().includes(searchQuery.toLowerCase())

      // Apply status filter
      const matchesStatus = selectedStatuses.includes(task.status)

      // Apply priority filter
      const matchesPriority = selectedPriorities.includes(task.priority)

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [initialTasks, searchQuery, selectedStatuses, selectedPriorities])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
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
              size="icon"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Filter tasks">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            {STATUS_OPTIONS.map(option => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={selectedStatuses.includes(option.value)}
                onCheckedChange={() => toggleStatus(option.value)}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Priority</DropdownMenuLabel>
            {PRIORITY_OPTIONS.map(option => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={selectedPriorities.includes(option.value)}
                onCheckedChange={() => togglePriority(option.value)}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg text-muted-foreground">
            No tasks match the current search and filter criteria.
          </p>
        </div>
      ) : (
        <TaskList initialTasks={filteredTasks} />
      )}
    </div>
  )
}
