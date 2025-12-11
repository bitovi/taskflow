"use client"

import { useState, useEffect, useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, X, Filter, Loader2 } from "lucide-react"
import Link from "next/link"
import { TaskList } from "@/components/task-list"
import { EmptyState } from "@/components/ui/empty-state"
import { poppins } from "@/lib/fonts"
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

  // Sync with URL on mount and when searchParams change
  useEffect(() => {
    const urlQuery = searchParams.get("q") || ""
    setQuery(urlQuery)
  }, [searchParams])

  // Perform search when query changes
  useEffect(() => {
    // Only search if query is 3+ characters or empty (to show all)
    if (query.length === 0 || query.length >= 3) {
      startTransition(async () => {
        const { tasks: searchResults } = await searchTasks(query)
        setTasks(searchResults || [])
      })

      // Update URL with pushState
      const url = new URL(window.location.href)
      if (query) {
        url.searchParams.set("q", query)
      } else {
        url.searchParams.delete("q")
      }
      window.history.pushState({}, "", url.toString())
    }
  }, [query])

  const handleClearSearch = () => {
    setQuery("")
  }

  const showEmptyState = !isPending && tasks.length === 0 && query.length >= 3

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

      {/* Search input with icons */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tasks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10"
            aria-label="Search tasks"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          {isPending && (
            <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
        <Button variant="outline" size="icon" aria-label="Filter tasks">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Task list or empty state */}
      {showEmptyState ? (
        <EmptyState
          title="No tasks found"
          description="No tasks match your current search and filter criteria. Try adjusting your search terms or filter settings."
        />
      ) : (
        <TaskList initialTasks={tasks} />
      )}
    </div>
  )
}
