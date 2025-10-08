"use client"

import { useState, useEffect, useTransition } from "react"
import { TaskList } from "@/components/task-list"
import { TaskSearchFilter } from "@/components/task-search-filter"
import { getFilteredTasks } from "@/app/(dashboard)/tasks/actions"

import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

interface FilteredTaskListProps {
  initialTasks: TaskWithProfile[]
}

export function FilteredTaskList({ initialTasks }: FilteredTaskListProps) {
  const [tasks, setTasks] = useState<TaskWithProfile[]>(initialTasks)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilters, setStatusFilters] = useState<string[]>(["todo", "in_progress", "review", "done"])
  const [priorityFilters, setPriorityFilters] = useState<string[]>(["high", "medium", "low"])
  const [isPending, startTransition] = useTransition()

  // Function to fetch filtered tasks
  const fetchFilteredTasks = async (query?: string, statuses?: string[], priorities?: string[]) => {
    const { tasks: filteredTasks, error } = await getFilteredTasks(
      query || undefined,
      statuses && statuses.length > 0 ? statuses : undefined,
      priorities && priorities.length > 0 ? priorities : undefined
    )
    
    if (!error) {
      setTasks(filteredTasks || [])
    }
  }

  // Effect to refetch when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      startTransition(() => {
        fetchFilteredTasks(searchQuery, statusFilters, priorityFilters)
      })
    }, 500) // Debounce search by 500ms

    return () => clearTimeout(timeoutId)
  }, [searchQuery, statusFilters, priorityFilters])

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleStatusFiltersChange = (filters: string[]) => {
    setStatusFilters(filters)
  }

  const handlePriorityFiltersChange = (filters: string[]) => {
    setPriorityFilters(filters)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
  }

  return (
    <div>
      <TaskSearchFilter
        searchQuery={searchQuery}
        statusFilters={statusFilters}
        priorityFilters={priorityFilters}
        onSearchChange={handleSearchChange}
        onStatusFiltersChange={handleStatusFiltersChange}
        onPriorityFiltersChange={handlePriorityFiltersChange}
        onClearSearch={handleClearSearch}
      />
      
      {/* Show loading state */}
      {isPending && (
        <div className="text-center py-8 text-muted-foreground">
          Searching tasks...
        </div>
      )}
      
      {/* Show no results message */}
      {!isPending && tasks.length === 0 && (searchQuery || statusFilters.length < 4 || priorityFilters.length < 3) && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-2">No tasks match your current search and filter criteria</div>
          <div className="text-sm text-muted-foreground">
            Try adjusting your filters or search terms
          </div>
        </div>
      )}
      
      {/* Show tasks */}
      {!isPending && tasks.length > 0 && (
        <TaskList initialTasks={tasks} />
      )}
    </div>
  )
}