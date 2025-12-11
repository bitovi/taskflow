"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SearchInput } from "@/components/ui/search-input"
import { TaskList } from "@/components/task-list"
import { EmptySearchState } from "@/components/empty-search-state"
import { Loader2 } from "lucide-react"

import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null
}

interface TasksSearchProps {
  initialTasks: TaskWithProfile[]
  initialSearchQuery: string
}

export function TasksSearch({ initialTasks, initialSearchQuery }: TasksSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [isPending, startTransition] = useTransition()

  // Update search query when URL changes
  useEffect(() => {
    const query = searchParams.get("search") || ""
    setSearchQuery(query)
  }, [searchParams])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)

    // Only search if 3+ characters or empty (to reset)
    if (value.length >= 3 || value.length === 0) {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
          params.set("search", value)
        } else {
          params.delete("search")
        }
        router.push(`/tasks?${params.toString()}`)
      })
    }
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("search")
      router.push(`/tasks?${params.toString()}`)
    })
  }

  const showClearButton = searchQuery.length > 0
  const isSearching = searchQuery.length >= 3
  const hasNoResults = isSearching && initialTasks.length === 0

  return (
    <>
      <div className="mb-6">
        <SearchInput
          value={searchQuery}
          onChange={handleSearchChange}
          onClear={handleClearSearch}
          showClearButton={showClearButton}
          placeholder=""
          disabled={isPending}
        />
      </div>

      {isPending && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      )}

      {!isPending && hasNoResults && <EmptySearchState />}

      {!isPending && !hasNoResults && <TaskList initialTasks={initialTasks} />}
    </>
  )
}
