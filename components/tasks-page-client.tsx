"use client"

import { useState, useEffect, useTransition, useCallback } from "react"
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

interface TasksPageClientProps {
  initialTasks: TaskWithProfile[]
}

export function TasksPageClient({ initialTasks }: TasksPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [tasks, setTasks] = useState<TaskWithProfile[]>(initialTasks)
  const [isPending, startTransition] = useTransition()

  // Initialize search query from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const query = params.get("search") || ""
    setSearchQuery(query)
    
    if (query && query.length >= 3) {
      startTransition(async () => {
        const { tasks: searchResults } = await searchTasks(query)
        setTasks(searchResults || [])
      })
    }
  }, [])

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 3) {
        startTransition(async () => {
          const { tasks: searchResults } = await searchTasks(searchQuery)
          setTasks(searchResults || [])
        })
        
        // Update URL with pushState
        const url = new URL(window.location.href)
        url.searchParams.set("search", searchQuery)
        window.history.pushState({}, "", url.toString())
      } else if (searchQuery.length === 0) {
        // Clear search and show all tasks
        setTasks(initialTasks)
        
        // Remove search param from URL
        const url = new URL(window.location.href)
        url.searchParams.delete("search")
        window.history.pushState({}, "", url.toString())
      } else {
        // Less than 3 characters, show all tasks but don't update URL
        setTasks(initialTasks)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, initialTasks])

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
        })
      } else {
        setTasks(initialTasks)
      }
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [initialTasks])

  const handleClear = useCallback(() => {
    setSearchQuery("")
    setTasks(initialTasks)
    
    // Remove search param from URL
    const url = new URL(window.location.href)
    url.searchParams.delete("search")
    window.history.pushState({}, "", url.toString())
  }, [initialTasks])

  const showEmptyState = searchQuery.length >= 3 && tasks.length === 0

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

      {showEmptyState ? <EmptyState /> : <TaskList initialTasks={tasks} />}
    </div>
  )
}
