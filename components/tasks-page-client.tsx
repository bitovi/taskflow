"use client"

import React from "react"
import { useState, useEffect, useTransition, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X, Filter, Loader2 } from "lucide-react"
import { TaskList } from "@/components/task-list"
import { EmptyState } from "@/components/empty-state"
import { searchTasks } from "@/app/(dashboard)/tasks/actions"

import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null
}

function mergeTaskUpdates(current: TaskWithProfile[], updates: TaskWithProfile[]): TaskWithProfile[] {
  if (updates.length === 0) return current

  const updateMap = new Map(updates.map((task) => [task.id, task]))
  const seen = new Set<number>()
  const merged: TaskWithProfile[] = current.map((task) => {
    const updated = updateMap.get(task.id)
    if (updated) {
      seen.add(task.id)
      return { ...task, ...updated }
    }
    return task
  })

  updates.forEach((task) => {
    if (!seen.has(task.id)) {
      merged.push(task)
    }
  })

  return merged
}

interface TasksPageClientProps {
  initialTasks: TaskWithProfile[]
}

export function TasksPageClient({ initialTasks }: TasksPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [allTasks, setAllTasks] = useState<TaskWithProfile[]>(initialTasks)
  const [tasks, setTasks] = useState<TaskWithProfile[]>(initialTasks)
  const [isPending, startTransition] = useTransition()
  const allTasksRef = useRef(allTasks)

  useEffect(() => {
    allTasksRef.current = allTasks
  }, [allTasks])

  // Optimize state synchronization to avoid redundant updates
  useEffect(() => {
    if (JSON.stringify(allTasksRef.current) !== JSON.stringify(initialTasks)) {
      setAllTasks(initialTasks)
      setTasks(initialTasks)
    }
  }, [initialTasks])

  // Initialize search query from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const query = params.get("search") || ""
    setSearchQuery(query)
    
    if (query && query.length >= 3) {
      startTransition(async () => {
        const { tasks: searchResults } = await searchTasks(query)
        setTasks(searchResults || [])
        if (searchResults) {
          setAllTasks((prev) => mergeTaskUpdates(prev, searchResults))
        }
      })
    }
  }, [])

  // Optimize debounce logic to minimize state updates
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 3) {
        startTransition(async () => {
          const { tasks: searchResults } = await searchTasks(searchQuery)
          if (searchResults) {
            setTasks(searchResults)
            setAllTasks((prev) => mergeTaskUpdates(prev, searchResults))
          }
        })
      } else if (searchQuery.length === 0) {
        setTasks(allTasksRef.current)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, allTasksRef])

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search)
      const query = params.get("search") || ""
      setSearchQuery(query)
      
      if (query && query.length >= 3) {
        startTransition(async () => {
          const { tasks: searchResults } = await searchTasks(query)
          setTasks(searchResults || [])
          if (searchResults) {
            setAllTasks((prev) => mergeTaskUpdates(prev, searchResults))
          }
        })
      } else {
        setTasks(allTasksRef.current)
      }
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  const handleClear = useCallback(() => {
    setSearchQuery("")
    setTasks(allTasks)
    
    // Remove search param from URL
    const url = new URL(window.location.href)
    url.searchParams.delete("search")
    window.history.pushState({}, "", url.toString())
  }, [allTasks])

  const showEmptyState = searchQuery.length >= 3 && tasks.length === 0

  // Keep local state in sync after a status change
  const handleTaskStatusChange = useCallback((taskId: number, status: TaskWithProfile["status"]) => {
    setTasks((current) => current.map((task) => (task.id === taskId ? { ...task, status } : task)))
    setAllTasks((current) => current.map((task) => (task.id === taskId ? { ...task, status } : task)))
  }, [])

  // Wrap TaskList with React.memo to prevent unnecessary re-renders
  const MemoizedTaskList = React.memo(TaskList)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9"
            data-testid="search-input"
          />
          {isPending && !searchQuery && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" data-testid="search-spinner" />
            </div>
          )}
          {searchQuery && !isPending && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              data-testid="clear-search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {searchQuery && isPending && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" data-testid="search-spinner" />
              <button
                onClick={handleClear}
                className="text-muted-foreground hover:text-foreground"
                data-testid="clear-search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        <Button variant="outline" size="icon" data-testid="filter-button">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {showEmptyState ? <EmptyState /> : <MemoizedTaskList initialTasks={tasks} onTaskStatusChange={handleTaskStatusChange} />}
    </div>
  )
}
