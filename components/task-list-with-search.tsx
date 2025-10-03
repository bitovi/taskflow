"use client"

import { useState, useMemo } from "react"
import { TaskSearch, TaskFilters, TaskStatus, TaskPriority } from "./task-search"
import { TaskList } from "./task-list"
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
}

interface TaskListWithSearchProps {
  initialTasks: TaskWithProfile[]
}

export function TaskListWithSearch({ initialTasks }: TaskListWithSearchProps) {
  const [filters, setFilters] = useState<TaskFilters>({
    search: "",
    statuses: ["todo", "in_progress", "review", "done"] as TaskStatus[],
    priorities: ["high", "medium", "low"] as TaskPriority[],
  })

  const filteredTasks = useMemo(() => {
    return initialTasks.filter((task) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesName = task.name.toLowerCase().includes(searchLower)
        const matchesDescription = task.description?.toLowerCase().includes(searchLower)
        if (!matchesName && !matchesDescription) {
          return false
        }
      }

      // Status filter
      if (!filters.statuses.includes(task.status as TaskStatus)) {
        return false
      }

      // Priority filter
      if (!filters.priorities.includes(task.priority as TaskPriority)) {
        return false
      }

      return true
    })
  }, [initialTasks, filters])

  return (
    <div>
      <TaskSearch filters={filters} onFiltersChange={setFilters} />
      <TaskList initialTasks={filteredTasks} />
    </div>
  )
}