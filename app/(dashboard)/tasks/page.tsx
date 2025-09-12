"use client"

import { Suspense, useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { TaskList } from "@/components/task-list"
import { TaskSearchFilter } from "@/components/task-search-filter"
import { poppins } from "@/lib/fonts"
import { getAllTasks, searchTasks } from "@/app/(dashboard)/tasks/actions"
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskWithProfile[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load initial tasks
  useEffect(() => {
    const loadInitialTasks = async () => {
      try {
        const { tasks: initialTasks, error } = await getAllTasks()
        if (error) {
          setError(error)
        } else {
          setTasks(initialTasks || [])
        }
      } catch (err) {
        setError("Failed to load tasks")
      } finally {
        setIsLoading(false)
      }
    }
    loadInitialTasks()
  }, [])

  // Debounced search function
  const performSearch = useCallback(async () => {
    setIsLoading(true)
    try {
      const { tasks: searchResults, error } = await searchTasks(
        searchQuery,
        statusFilter,
        priorityFilter
      )
      if (!error && searchResults) {
        setTasks(searchResults)
      }
    } catch (err) {
      console.error("Search error:", err)
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, statusFilter, priorityFilter])

  // Effect to trigger search when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch()
    }, 300) // Debounce search by 300ms

    return () => clearTimeout(timeoutId)
  }, [searchQuery, statusFilter, priorityFilter]) // Remove performSearch from dependencies

  if (error) {
    return <p className="p-8">Could not load data. Please try again later.</p>
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

      <TaskSearchFilter
        onSearchChange={setSearchQuery}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
      />

      <Suspense fallback={<div>Loading tasks...</div>}>
        {isLoading ? (
          <div>Loading tasks...</div>
        ) : (
          <TaskList initialTasks={tasks} />
        )}
      </Suspense>
    </div>
  )
}
