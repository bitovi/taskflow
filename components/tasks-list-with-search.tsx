"use client"

import { useMemo, useState } from "react"
import { TaskList } from "@/components/task-list"
import { TaskSearchFilter } from "@/components/task-search-filter"
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null
}

type FilterState = {
  statuses: Set<string>
  priorities: Set<string>
}

type TasksListWithSearchProps = {
  initialTasks: TaskWithProfile[]
}

export function TasksListWithSearch({ initialTasks }: TasksListWithSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    statuses: new Set(["todo", "in_progress", "review", "done"]),
    priorities: new Set(["high", "medium", "low"]),
  })

  const filteredTasks = useMemo(() => {
    return initialTasks.filter((task) => {
      // Filter by status
      if (!filters.statuses.has(task.status)) {
        return false
      }

      // Filter by priority
      if (!filters.priorities.has(task.priority)) {
        return false
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const nameMatch = task.name.toLowerCase().includes(query)
        const descriptionMatch = task.description.toLowerCase().includes(query)
        return nameMatch || descriptionMatch
      }

      return true
    })
  }, [initialTasks, searchQuery, filters])

  const hasNoResults = filteredTasks.length === 0

  return (
    <div className="space-y-4">
      <TaskSearchFilter onSearchChange={setSearchQuery} onFilterChange={setFilters} />
      {hasNoResults ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <p className="text-muted-foreground">
            No tasks match the current search and filter criteria
          </p>
        </div>
      ) : (
        <TaskList initialTasks={filteredTasks} />
      )}
    </div>
  )
}
