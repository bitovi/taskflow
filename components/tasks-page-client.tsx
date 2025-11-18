"use client"

import { useState, useMemo } from "react"
import { TaskSearch } from "@/components/task-search"
import { TaskList } from "@/components/task-list"

import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null
}

interface TasksPageClientProps {
  initialTasks: TaskWithProfile[]
}

export function TasksPageClient({ initialTasks }: TasksPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) {
      return initialTasks
    }
    
    const query = searchQuery.toLowerCase()
    return initialTasks.filter((task) => 
      task.name.toLowerCase().includes(query)
    )
  }, [initialTasks, searchQuery])

  return (
    <div className="space-y-4">
      <TaskSearch onSearchChange={setSearchQuery} />
      <TaskList initialTasks={filteredTasks} />
    </div>
  )
}
