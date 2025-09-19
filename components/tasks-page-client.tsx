"use client"

import { useState, useEffect, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { TaskList } from "@/components/task-list"
import { TaskSearchFilter } from "@/components/task-search-filter"
import { poppins } from "@/lib/fonts"
import { searchTasks } from "@/app/(dashboard)/tasks/actions"
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
}

interface TasksPageClientProps {
  initialTasks: TaskWithProfile[]
}

export function TasksPageClient({ initialTasks }: TasksPageClientProps) {
  const [tasks, setTasks] = useState<TaskWithProfile[]>(initialTasks)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilters, setStatusFilters] = useState<string[]>([])
  const [priorityFilters, setPriorityFilters] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()

  // Debounce search and filter operations
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      startTransition(async () => {
        const { tasks: filteredTasks } = await searchTasks(
          searchTerm || undefined,
          statusFilters.length > 0 ? statusFilters : undefined,
          priorityFilters.length > 0 ? priorityFilters : undefined
        )
        setTasks(filteredTasks || [])
      })
    }, 300) // 300ms debounce

    return () => clearTimeout(timeoutId)
  }, [searchTerm, statusFilters, priorityFilters])

  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm)
  }

  const handleFiltersChange = (newStatusFilters: string[], newPriorityFilters: string[]) => {
    setStatusFilters(newStatusFilters)
    setPriorityFilters(newPriorityFilters)
  }

  const hasFilters = statusFilters.length > 0 || priorityFilters.length > 0

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

      <TaskSearchFilter
        onSearchChange={handleSearchChange}
        onFiltersChange={handleFiltersChange}
        searchTerm={searchTerm}
        statusFilters={statusFilters}
        priorityFilters={priorityFilters}
      />

      <div className={isPending ? "opacity-60" : ""}>
        <TaskList 
          initialTasks={tasks} 
          searchTerm={searchTerm}
          hasFilters={hasFilters}
        />
      </div>
    </div>
  )
}