"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, Filter } from "lucide-react"
import { TaskList } from "@/components/task-list"
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null
}

export function TasksPageClient({ initialTasks }: { initialTasks: TaskWithProfile[] }) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTasks = searchQuery
    ? initialTasks.filter((task) =>
        task.name.includes(searchQuery)
      )
    : initialTasks

  const handleClearSearch = () => {
    setSearchQuery("")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-label="Search icon"
          />
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
            aria-label="Search tasks by title"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearSearch}
              className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button variant="outline" size="icon" aria-label="Filter tasks">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <TaskList initialTasks={filteredTasks} />
    </div>
  )
}
