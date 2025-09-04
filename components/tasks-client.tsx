"use client"

import { useState } from "react"
import { TaskList } from "@/components/task-list"
import { TaskSearchFilter } from "@/components/task-search-filter"

import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null
}

interface TasksClientProps {
  initialTasks: TaskWithProfile[]
}

export function TasksClient({ initialTasks }: TasksClientProps) {
  const [filteredTasks, setFilteredTasks] = useState<TaskWithProfile[]>(initialTasks)

  return (
    <>
      <TaskSearchFilter 
        onTasksChange={setFilteredTasks} 
        initialTasks={initialTasks}
      />
      <TaskList initialTasks={filteredTasks} />
    </>
  )
}