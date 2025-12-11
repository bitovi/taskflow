"use client"

import { useState, useEffect, useTransition } from "react"
import { SearchInput } from "@/components/ui/search-input"
import { Button } from "@/components/ui/button"
import { Filter, Loader2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { TaskList } from "@/components/task-list"
import { EmptySearchState } from "@/components/empty-search-state"
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null
}

interface TasksSearchClientProps {
  initialTasks: TaskWithProfile[]
  initialSearchQuery?: string
}

export function TasksSearchClient({ initialTasks, initialSearchQuery = "" }: TasksSearchClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [displayedTasks, setDisplayedTasks] = useState(initialTasks)
  const [isPending, startTransition] = useTransition()

  // Sync search query with URL params
  useEffect(() => {
    const urlSearch = searchParams.get("search") || ""
    if (urlSearch !== searchQuery) {
      setSearchQuery(urlSearch)
    }
  }, [searchParams])

  // Update URL when search query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 3 || searchQuery.length === 0) {
        const currentSearch = searchParams.get("search") || ""
        
        // Only update if the search query has changed
        if (currentSearch !== searchQuery) {
          const params = new URLSearchParams(searchParams.toString())
          if (searchQuery) {
            params.set("search", searchQuery)
          } else {
            params.delete("search")
          }
          const newUrl = `/tasks${params.toString() ? `?${params.toString()}` : ""}`
          
          startTransition(() => {
            router.push(newUrl, { scroll: false })
          })
        }
      }
    }, 300) // Debounce for 300ms

    return () => clearTimeout(timer)
  }, [searchQuery, router, searchParams])

  // Update displayed tasks when initial tasks change
  useEffect(() => {
    setDisplayedTasks(initialTasks)
  }, [initialTasks])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  const handleClear = () => {
    setSearchQuery("")
  }

  const showEmptyState = displayedTasks.length === 0 && searchQuery.length >= 3

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <SearchInput
            placeholder="Search tasks..."
            value={searchQuery}
            onValueChange={handleSearchChange}
            onClear={handleClear}
            disabled={isPending}
          />
        </div>
        <Button variant="outline" size="icon" disabled data-testid="filter-button">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {isPending && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isPending && showEmptyState ? (
        <EmptySearchState />
      ) : !isPending ? (
        <TaskList initialTasks={displayedTasks} />
      ) : null}
    </div>
  )
}
