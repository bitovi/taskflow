"use client"

import { useState, useMemo } from "react"
import { TaskList } from "./task-list"
import { SearchAndFilter, FilterState, defaultFilters } from "./search-and-filter"
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

interface FilterableTaskListProps {
  initialTasks: TaskWithProfile[]
}

export function FilterableTaskList({ initialTasks }: FilterableTaskListProps) {
  const [searchValue, setSearchValue] = useState("")
  const [filters, setFilters] = useState<FilterState>(defaultFilters)

  const filteredTasks = useMemo(() => {
    let filtered = initialTasks

    // Apply search filter
    if (searchValue.trim()) {
      const searchLower = searchValue.toLowerCase().trim()
      filtered = filtered.filter(task => 
        task.name.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower))
      )
    }

    // Apply status filter
    const activeStatuses = Object.entries(filters.status)
      .filter(([, isActive]) => isActive)
      .map(([status]) => status)
    
    if (activeStatuses.length > 0) {
      filtered = filtered.filter(task => activeStatuses.includes(task.status))
    }

    // Apply priority filter
    const activePriorities = Object.entries(filters.priority)
      .filter(([, isActive]) => isActive)
      .map(([priority]) => priority)
    
    if (activePriorities.length > 0) {
      filtered = filtered.filter(task => activePriorities.includes(task.priority))
    }

    return filtered
  }, [initialTasks, searchValue, filters])

  return (
    <div className="space-y-6">
      <SearchAndFilter
        onSearchChange={setSearchValue}
        onFiltersChange={setFilters}
        searchValue={searchValue}
        filters={filters}
      />
      <TaskList initialTasks={initialTasks} filteredTasks={filteredTasks} />
    </div>
  )
}