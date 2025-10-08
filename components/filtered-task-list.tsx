"use client"

import { useState, useMemo } from "react"
import { TaskList } from "./task-list"
import { TaskSearchFilter } from "./task-search-filter"
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
}

interface FilteredTaskListProps {
  initialTasks: TaskWithProfile[]
}

export function FilteredTaskList({ initialTasks }: FilteredTaskListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilters, setStatusFilters] = useState<string[]>(["todo", "in_progress", "review", "done"])
  const [priorityFilters, setPriorityFilters] = useState<string[]>(["high", "medium", "low"])

  const filteredTasks = useMemo(() => {
    let filtered = initialTasks

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(task => 
        task.name.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      )
    }

    // Apply status filter
    if (statusFilters.length > 0) {
      filtered = filtered.filter(task => statusFilters.includes(task.status))
    }

    // Apply priority filter
    if (priorityFilters.length > 0) {
      filtered = filtered.filter(task => priorityFilters.includes(task.priority))
    }

    return filtered
  }, [initialTasks, searchQuery, statusFilters, priorityFilters])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleFilter = (newStatusFilters: string[], newPriorityFilters: string[]) => {
    setStatusFilters(newStatusFilters)
    setPriorityFilters(newPriorityFilters)
  }

  return (
    <div className="space-y-4">
      <TaskSearchFilter
        onSearch={handleSearch}
        onFilter={handleFilter}
        searchQuery={searchQuery}
        statusFilters={statusFilters}
        priorityFilters={priorityFilters}
      />
      
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <p className="text-lg font-medium mb-2">No tasks match your current search and filter criteria</p>
            <p className="text-sm">Try adjusting your search terms or filter settings</p>
          </div>
        </div>
      ) : (
        <TaskList initialTasks={filteredTasks} />
      )}
    </div>
  )
}