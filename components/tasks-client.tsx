"use client"

import { Suspense, useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { TaskList } from "@/components/task-list"
import { SearchAndFilter, type FilterState } from "@/components/search-and-filter"
import { poppins } from "@/lib/fonts"

import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

interface TasksClientProps {
  initialTasks: TaskWithProfile[]
}

export function TasksClient({ initialTasks }: TasksClientProps) {
  const [searchValue, setSearchValue] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    status: ["todo", "in_progress", "review", "done", "will_not_do"],
    priority: ["high", "medium", "low"]
  })

  const filteredTasks = useMemo(() => {
    return initialTasks.filter(task => {
      // Filter by search text (name and description)
      const searchLower = searchValue.toLowerCase()
      const matchesSearch = searchValue === "" || 
        task.name.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)

      // Filter by status
      const matchesStatus = filters.status.includes(task.status)

      // Filter by priority
      const matchesPriority = filters.priority.includes(task.priority.toLowerCase())

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [initialTasks, searchValue, filters])

  const hasActiveFilters = searchValue !== "" || 
    filters.status.length < 5 || 
    filters.priority.length < 3

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

      <SearchAndFilter
        onSearchChange={setSearchValue}
        onFiltersChange={setFilters}
        searchValue={searchValue}
        filters={filters}
      />

      <Suspense fallback={<div>Loading tasks...</div>}>
        <TaskList 
          initialTasks={initialTasks}
          filteredTasks={filteredTasks}
          hasActiveFilters={hasActiveFilters}
        />
      </Suspense>
    </div>
  )
}