"use client"

import { useState, useEffect } from "react"
import { SearchAndFilter } from "@/components/search-and-filter"
import { TaskList } from "@/components/task-list"
import { getAllTasks } from "@/app/(dashboard)/tasks/actions"
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
}

interface FilterState {
  status: string[]
  priority: string[]
}

export function TaskListWithFilter() {
  const [allTasks, setAllTasks] = useState<TaskWithProfile[]>([])
  const [filteredTasks, setFilteredTasks] = useState<TaskWithProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    status: ["todo", "in_progress", "review", "done"],
    priority: ["high", "medium", "low"]
  })

  // Load tasks on component mount
  useEffect(() => {
    async function loadTasks() {
      try {
        const { tasks, error } = await getAllTasks()
        if (error) {
          setError(error)
        } else {
          setAllTasks(tasks || [])
        }
      } catch {
        setError("Failed to load tasks")
      } finally {
        setLoading(false)
      }
    }
    
    loadTasks()
  }, [])

  // Filter tasks whenever search query, filters, or tasks change
  useEffect(() => {
    let filtered = allTasks

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(task => 
        task.name.toLowerCase().includes(query) || 
        (task.description && task.description.toLowerCase().includes(query))
      )
    }

    // Apply status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(task => filters.status.includes(task.status))
    }

    // Apply priority filter
    if (filters.priority.length > 0) {
      filtered = filtered.filter(task => filters.priority.includes(task.priority))
    }

    setFilteredTasks(filtered)
  }, [allTasks, searchQuery, filters])

  if (loading) {
    return <div>Loading tasks...</div>
  }

  if (error) {
    return <p className="p-8">Could not load data. Please try again later.</p>
  }

  return (
    <div>
      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFiltersChange={setFilters}
      />
      
      {filteredTasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No tasks match the current search and filter criteria.
          </p>
        </div>
      ) : (
        <TaskList initialTasks={filteredTasks} />
      )}
    </div>
  )
}