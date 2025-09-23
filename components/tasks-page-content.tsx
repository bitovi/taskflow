"use client"

import { useState, useEffect, useMemo } from "react"
import { TaskSearchFilter, FilterState } from "./task-search-filter"
import { TaskList } from "./task-list"
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

interface TasksPageContentProps {
  initialTasks: TaskWithProfile[]
}

export function TasksPageContent({ initialTasks }: TasksPageContentProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: ["todo", "in_progress", "review", "done"],
    priority: ["high", "medium", "low"],
  })

  // Filter tasks based on current filter state
  const filteredTasks = useMemo(() => {
    let filtered = initialTasks

    // Apply text search filter
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(task => 
        task.name.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower))
      )
    }

    // Apply status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(task => filters.status.includes(task.status))
    }

    // Apply priority filter
    if (filters.priority.length > 0) {
      filtered = filtered.filter(task => filters.priority.includes(task.priority))
    }

    return filtered
  }, [initialTasks, filters])

  // Check if any filters are active (not all options selected)
  const hasActiveFilters = useMemo(() => {
    return filters.search.trim() !== "" ||
           filters.status.length < 4 ||
           filters.priority.length < 3
  }, [filters])

  return (
    <>
      <TaskSearchFilter 
        onFilterChange={setFilters} 
        taskCount={filteredTasks.length}
      />
      <TaskList
        initialTasks={initialTasks}
        filteredTasks={filteredTasks}
        hasActiveFilters={hasActiveFilters}
        searchText={filters.search}
      />
    </>
  )
}