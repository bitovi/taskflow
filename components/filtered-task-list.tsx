"use client"

import { useState, useMemo } from "react"
import { TaskList } from "./task-list"
import { TaskSearchFilter } from "./task-search-filter"
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
  creator?: Pick<User, "name"> | null;
};

interface FilteredTaskListProps {
  initialTasks: TaskWithProfile[]
}

export function FilteredTaskList({ initialTasks }: FilteredTaskListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilters, setStatusFilters] = useState<string[]>(["todo", "in_progress", "review", "done"])
  const [priorityFilters, setPriorityFilters] = useState<string[]>(["high", "medium", "low"])

  const filteredTasks = useMemo(() => {
    let filtered = initialTasks

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim()
      filtered = filtered.filter(task => 
        task.name.toLowerCase().includes(searchLower) || 
        task.description.toLowerCase().includes(searchLower)
      )
    }

    // Apply status filter
    if (statusFilters.length > 0 && statusFilters.length < 4) {
      filtered = filtered.filter(task => statusFilters.includes(task.status))
    }

    // Apply priority filter  
    if (priorityFilters.length > 0 && priorityFilters.length < 3) {
      filtered = filtered.filter(task => priorityFilters.includes(task.priority))
    }

    return filtered
  }, [initialTasks, searchTerm, statusFilters, priorityFilters])

  const handleFilterChange = (newSearchTerm: string, newStatusFilters: string[], newPriorityFilters: string[]) => {
    setSearchTerm(newSearchTerm)
    setStatusFilters(newStatusFilters)
    setPriorityFilters(newPriorityFilters)
  }

  const hasActiveFilters = searchTerm.trim() || statusFilters.length < 4 || priorityFilters.length < 3

  return (
    <div>
      <TaskSearchFilter onFilterChange={handleFilterChange} />
      
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg mb-2">
            No tasks found
          </div>
          <div className="text-sm text-muted-foreground">
            {hasActiveFilters 
              ? "No tasks match your current search and filter criteria. Try adjusting your filters or search term."
              : "No tasks available."
            }
          </div>
        </div>
      ) : (
        <TaskList initialTasks={filteredTasks} />
      )}
    </div>
  )
}