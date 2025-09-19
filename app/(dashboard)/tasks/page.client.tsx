"use client"

import { Suspense, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { TaskList } from "@/components/task-list"
import { TaskFilters, FilterState } from "@/components/task-filters"
import { poppins } from "@/lib/fonts"

import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

interface TasksPageClientProps {
  initialTasks: TaskWithProfile[]
}

export function TasksPageClient({ initialTasks }: TasksPageClientProps) {
  // Initialize filters with all options selected by default
  const [filters, setFilters] = useState<FilterState>({
    searchText: "",
    status: ["todo", "in_progress", "review", "done"],
    priority: ["high", "medium", "low"],
  })

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

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

      <TaskFilters filters={filters} onFiltersChange={handleFiltersChange} />

      <Suspense fallback={<div>Loading tasks...</div>}>
        <TaskList initialTasks={initialTasks} filters={filters} />
      </Suspense>
    </div>
  )
}