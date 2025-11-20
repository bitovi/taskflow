"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, X } from "lucide-react"
import Link from "next/link"
import { TaskList } from "@/components/task-list"
import { poppins } from "@/lib/fonts"
import { useSearchParams } from "next/navigation"

import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null
}

interface TasksPageWithSearchProps {
  initialTasks: TaskWithProfile[]
}

export function TasksPageWithSearch({ initialTasks }: TasksPageWithSearchProps) {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")

  // Initialize search query from URL on mount
  useEffect(() => {
    const queryFromUrl = searchParams.get("search") || ""
    setSearchQuery(queryFromUrl)
    setDebouncedQuery(queryFromUrl)
  }, [searchParams])

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Update URL when debounced query changes
  useEffect(() => {
    const url = new URL(window.location.href)
    if (debouncedQuery) {
      url.searchParams.set("search", debouncedQuery)
    } else {
      url.searchParams.delete("search")
    }
    window.history.pushState({}, "", url.toString())
  }, [debouncedQuery])

  // Filter tasks based on search query
  const filteredTasks = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return initialTasks
    }

    const query = debouncedQuery.toLowerCase()
    return initialTasks.filter((task) =>
      task.name.toLowerCase().includes(query)
    )
  }, [initialTasks, debouncedQuery])

  const handleClearSearch = useCallback(() => {
    setSearchQuery("")
    setDebouncedQuery("")
  }, [])

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

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-9"
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Task List */}
      <TaskList initialTasks={filteredTasks} />
    </div>
  )
}
