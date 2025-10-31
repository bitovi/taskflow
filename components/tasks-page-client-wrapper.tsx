"use client"

import { useState, useMemo } from "react"
import { TasksSearchFilter } from "@/components/tasks-search-filter"
import { TaskList } from "@/components/task-list"
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null
}

type FilterOptions = {
  statuses: string[]
  priorities: string[]
}

export function TasksPageClient({ tasks }: { tasks: TaskWithProfile[] }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterOptions>({
    statuses: ["todo", "in_progress", "review", "done"],
    priorities: ["high", "medium", "low"],
  })

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Filter by search query
      const matchesSearch =
        searchQuery === "" ||
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())

      // Filter by status
      const matchesStatus = filters.statuses.includes(task.status)

      // Filter by priority
      const matchesPriority = filters.priorities.includes(task.priority)

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [tasks, searchQuery, filters])

  const showEmptyState = filteredTasks.length === 0

  return (
    <div className="space-y-4">
      <TasksSearchFilter
        onSearchChange={setSearchQuery}
        onFilterChange={setFilters}
      />
      
      {showEmptyState ? (
        <div className="text-center py-12">
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
