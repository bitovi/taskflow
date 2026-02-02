"use client"

import { useState, useEffect, useCallback } from "react"
import { TaskList } from "@/components/task-list"
import { TaskFilters } from "@/components/task-filters"
import { getFilteredTasks } from "@/app/(dashboard)/tasks/actions"
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
}

interface TasksPageClientProps {
  initialTasks: TaskWithProfile[]
}

export function TasksPageClient({ initialTasks }: TasksPageClientProps) {
  const [tasks, setTasks] = useState<TaskWithProfile[]>(initialTasks)
  const [isLoading, setIsLoading] = useState(false)

  const handleFilterChange = useCallback(async (filters: {
    search: string;
    status: string[];
    priority: string[];
    assigneeId: number | undefined;
  }) => {
    setIsLoading(true)
    try {
      const { tasks: filteredTasks, error } = await getFilteredTasks({
        search: filters.search || undefined,
        status: filters.status.length > 0 ? filters.status : undefined,
        priority: filters.priority.length > 0 ? filters.priority : undefined,
        assigneeId: filters.assigneeId,
      })

      if (!error && filteredTasks) {
        setTasks(filteredTasks)
      }
    } catch (err) {
      console.error("Error filtering tasks:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-[300px_1fr]">
      <div>
        <TaskFilters onFilterChange={handleFilterChange} />
      </div>
      <div>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <p className="text-muted-foreground">Loading tasks...</p>
          </div>
        ) : (
          <TaskList initialTasks={tasks} />
        )}
      </div>
    </div>
  )
}
