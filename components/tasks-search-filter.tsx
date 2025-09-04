"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import { Search, X, Filter } from "lucide-react"
import { getFilteredTasks } from "@/app/(dashboard)/tasks/actions"
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

interface TasksSearchFilterProps {
  onTasksUpdate: (tasks: TaskWithProfile[]) => void
}

export function TasksSearchFilter({ onTasksUpdate }: TasksSearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["todo", "in_progress", "review", "done"])
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(["high", "medium", "low"])
  const [isLoading, setIsLoading] = useState(false)

  const statusOptions = [
    { value: "todo", label: "Todo" },
    { value: "in_progress", label: "In progress" },
    { value: "review", label: "Review" },
    { value: "done", label: "Done" }
  ]

  const priorityOptions = [
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" }
  ]

  const handleSearch = useCallback(async () => {
    setIsLoading(true)
    try {
      const { tasks, error } = await getFilteredTasks(
        searchTerm || undefined,
        selectedStatuses.length > 0 ? selectedStatuses : undefined,
        selectedPriorities.length > 0 ? selectedPriorities : undefined
      )
      if (!error) {
        onTasksUpdate(tasks || [])
      }
    } catch (error) {
      console.error("Error filtering tasks:", error)
    } finally {
      setIsLoading(false)
    }
  }, [searchTerm, selectedStatuses, selectedPriorities, onTasksUpdate])

  // Trigger search when filters change
  useEffect(() => {
    handleSearch()
  }, [handleSearch])

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

  return (
    <div className="flex items-center space-x-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          {statusOptions.map((status) => (
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
          {priorityOptions.map((priority) => (
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

      {isLoading && (
        <div className="text-sm text-muted-foreground">Loading...</div>
      )}
    </div>
  )
}