"use client"

import { useState, useMemo } from "react"
import { TaskList } from "@/components/task-list"
import { TasksSearchFilter, type FilterOptions } from "@/components/tasks-search-filter"
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null
}

type TasksPageClientProps = {
  initialTasks: TaskWithProfile[]
}

export function TasksPageClient({ initialTasks }: TasksPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterOptions>({
    statuses: ["todo", "in_progress", "review", "done"],
    priorities: ["high", "medium", "low"],
  })

  const filteredTasks = useMemo(() => {
    return initialTasks.filter((task) => {
      // Apply search filter
      const matchesSearch =
        searchQuery.trim() === "" ||
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())

      // Apply status filter
      const matchesStatus = filters.statuses.includes(task.status)

      // Apply priority filter
      const matchesPriority = filters.priorities.includes(task.priority)

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [initialTasks, searchQuery, filters])

  return (
    <div className="space-y-4">
      <TasksSearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFilterChange={setFilters}
      />
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No tasks match the current search and filter criteria
        </div>
      ) : (
        <TaskList initialTasks={filteredTasks} />
      )}
    </div>
  )
}
