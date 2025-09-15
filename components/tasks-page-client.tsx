"use client"

import { useState, useTransition, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { TaskList } from "@/components/task-list"
import { TaskSearchFilter } from "@/components/task-search-filter"
import { searchAndFilterTasks } from "@/app/(dashboard)/tasks/actions"
import { poppins } from "@/lib/fonts"

import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

interface TasksPageClientProps {
  initialTasks: TaskWithProfile[]
}

export function TasksPageClient({ initialTasks }: TasksPageClientProps) {
  const [tasks, setTasks] = useState<TaskWithProfile[]>(initialTasks)
  const [isPending, startTransition] = useTransition()

  const handleSearch = useCallback((searchQuery: string, priorityFilter: string, statusFilter: string) => {
    startTransition(async () => {
      const { tasks: filteredTasks } = await searchAndFilterTasks(
        searchQuery || undefined,
        priorityFilter === "all" ? undefined : priorityFilter,
        statusFilter === "all" ? undefined : statusFilter
      )
      setTasks(filteredTasks || [])
    })
  }, [])

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-3xl font-bold tracking-tight ${poppins.className}`}>Tasks</h2>
        <Link href="/tasks/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </Link>
      </div>

      <TaskSearchFilter onSearch={handleSearch} isLoading={isPending} />

      <div className="relative">
        {isPending && (
          <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center">
            <div className="text-sm text-muted-foreground">Searching...</div>
          </div>
        )}
        <TaskList initialTasks={tasks} />
      </div>
    </div>
  )
}
