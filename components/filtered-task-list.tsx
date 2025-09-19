"use client"

import { useState, useEffect } from "react"
import { TaskList } from "@/components/task-list"
import { SearchAndFilter } from "@/components/search-and-filter"
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
  const [statusFilters, setStatusFilters] = useState(["todo", "in_progress", "review", "done"])
  const [priorityFilters, setPriorityFilters] = useState(["high", "medium", "low"])
  const [isLoading, setIsLoading] = useState(false)

  // Filter tasks whenever search or filter criteria change
  useEffect(() => {
    const filterTasks = async () => {
      setIsLoading(true)
      try {
        const { tasks: filteredTasks, error } = await getFilteredTasks(
          searchQuery || undefined,
          statusFilters.length > 0 ? statusFilters : undefined,
          priorityFilters.length > 0 ? priorityFilters : undefined
        )
        
        if (!error) {
          setTasks(filteredTasks || [])
        }
      } catch (err) {
        console.error("Failed to filter tasks:", err)
      } finally {
        setIsLoading(false)
      }
    }

    filterTasks()
  }, [searchQuery, statusFilters, priorityFilters])

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleFilterChange = (newStatusFilters: string[], newPriorityFilters: string[]) => {
    setStatusFilters(newStatusFilters)
    setPriorityFilters(newPriorityFilters)
  }

  const hasActiveFilters = searchQuery.trim() !== "" || 
    statusFilters.length !== 4 || 
    priorityFilters.length !== 3

  return (
    <div className="space-y-4">
      <SearchAndFilter
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        searchQuery={searchQuery}
        statusFilters={statusFilters}
        priorityFilters={priorityFilters}
      />
      
      {isLoading ? (
        <div className="text-center py-8">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {hasActiveFilters 
              ? "No tasks match the current search and filter criteria." 
              : "No tasks found."
            }
          </p>
        </div>
      ) : (
        <TaskList initialTasks={tasks} />
      )}
    </div>
  )
}