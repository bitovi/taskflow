"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, Filter } from "lucide-react"
import { TaskList } from "@/components/task-list"
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu"

import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

export function TasksPageClient({ initialTasks }: { initialTasks: TaskWithProfile[] }) {
  const [searchText, setSearchText] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(
    new Set(["todo", "in_progress", "review", "done"])
  )
  const [selectedPriorities, setSelectedPriorities] = useState<Set<string>>(
    new Set(["high", "medium", "low"])
  )

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(status)) {
        newSet.delete(status)
      } else {
        newSet.add(status)
      }
      return newSet
    })
  }

  const togglePriority = (priority: string) => {
    setSelectedPriorities((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(priority)) {
        newSet.delete(priority)
      } else {
        newSet.add(priority)
      }
      return newSet
    })
  }

  const filteredTasks = useMemo(() => {
    return initialTasks.filter((task) => {
      // Filter by status
      if (!selectedStatuses.has(task.status)) {
        return false
      }

      // Filter by priority
      if (!selectedPriorities.has(task.priority)) {
        return false
      }

      // Filter by search text
      if (searchText) {
        const searchLower = searchText.toLowerCase()
        const nameMatch = task.name.toLowerCase().includes(searchLower)
        const descriptionMatch = task.description?.toLowerCase().includes(searchLower) || false
        return nameMatch || descriptionMatch
      }

      return true
    })
  }, [initialTasks, searchText, selectedStatuses, selectedPriorities])

  const clearSearch = () => {
    setSearchText("")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchText && (
            <button
              onClick={clearSearch}
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
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={selectedStatuses.has("todo")}
              onCheckedChange={() => toggleStatus("todo")}
            >
              Todo
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedStatuses.has("in_progress")}
              onCheckedChange={() => toggleStatus("in_progress")}
            >
              In Progress
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedStatuses.has("review")}
              onCheckedChange={() => toggleStatus("review")}
            >
              Review
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedStatuses.has("done")}
              onCheckedChange={() => toggleStatus("done")}
            >
              Done
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Priority</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={selectedPriorities.has("high")}
              onCheckedChange={() => togglePriority("high")}
            >
              High
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedPriorities.has("medium")}
              onCheckedChange={() => togglePriority("medium")}
            >
              Medium
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedPriorities.has("low")}
              onCheckedChange={() => togglePriority("low")}
            >
              Low
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tasks match the current search and filter criteria.</p>
        </div>
      ) : (
        <TaskList initialTasks={filteredTasks} />
      )}
    </div>
  )
}
