"use client"

import { useState, useMemo } from "react"
import { TaskList } from "./task-list"
import { SearchAndFilter, FilterOptions } from "./search-and-filter"
import { Search } from "lucide-react"

import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
}

type TaskListWithSearchProps = {
  initialTasks: TaskWithProfile[]
}

export function TaskListWithSearch({ initialTasks }: TaskListWithSearchProps) {
  const [searchText, setSearchText] = useState("")
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    status: ["todo", "in_progress", "review", "done"], // All selected by default
    priority: ["high", "medium", "low"] // All selected by default
  })

  const filteredTasks = useMemo(() => {
    return initialTasks.filter((task) => {
      // Check if task matches search text
      const matchesSearch = searchText === "" || 
        task.name.toLowerCase().includes(searchText.toLowerCase()) ||
        task.description.toLowerCase().includes(searchText.toLowerCase())

      // Check if task matches status filter
      const matchesStatus = filterOptions.status.includes(task.status)
      
      // Check if task matches priority filter  
      const matchesPriority = filterOptions.priority.includes(task.priority)

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [initialTasks, searchText, filterOptions])

  const hasFilters = searchText !== "" || 
    filterOptions.status.length < 4 || 
    filterOptions.priority.length < 3

  return (
    <div>
      <SearchAndFilter
        searchText={searchText}
        onSearchChange={setSearchText}
        filterOptions={filterOptions}
        onFilterChange={setFilterOptions}
      />
      
      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4">
            <Search className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
          <p className="text-muted-foreground max-w-md">
            No tasks match your current search and filter criteria. Try adjusting your search terms or filter settings.
          </p>
        </div>
      ) : (
        <TaskList initialTasks={filteredTasks} />
      )}
    </div>
  )
}