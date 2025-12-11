"use client"

import { useState, useEffect, useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
  initialQuery?: string
}

export function TasksPageClient({ initialTasks, initialQuery = "" }: TasksPageClientProps) {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(initialQuery)
  const [tasks, setTasks] = useState(initialTasks)
  const [isPending, startTransition] = useTransition()

  // Perform search with debounce
  useEffect(() => {
    // Only search if query is 3+ characters or empty (to show all)
    if (query.length === 0 || query.length >= 3) {
      const timer = setTimeout(() => {
        startTransition(async () => {
          const { tasks: newTasks } = await searchTasks(query)
          setTasks(newTasks || [])
        })
      }, 300) // 300ms debounce

      return () => clearTimeout(timer)
    }
  }, [query])

  // Update URL when query changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (query && query.length >= 3) {
      params.set("search", query)
    } else {
      params.delete("search")
    }

    const newUrl = params.toString() ? `?${params.toString()}` : "/tasks"
    window.history.pushState(null, "", newUrl)
  }, [query, searchParams])

  const handleClear = () => {
    setQuery("")
  }

  const showEmptyState = tasks.length === 0 && query.length >= 3

  return (
    <>
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            data-testid="search-input"
            type="text"
            placeholder="Search tasks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {query && (
            <Button
              data-testid="clear-search"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          {isPending && (
            <div className="absolute right-10 top-1/2 -translate-y-1/2" data-testid="search-spinner">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        <Button variant="outline" size="icon" data-testid="filter-button">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {showEmptyState ? <EmptyState /> : <TaskList initialTasks={tasks} />}
    </>
  )
}
