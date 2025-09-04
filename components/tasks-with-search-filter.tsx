"use client"

import { useState } from "react"
import { TasksSearchFilter } from "@/components/tasks-search-filter"
import { TaskList } from "@/components/task-list"
import { NoTasksFound } from "@/components/no-tasks-found"
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

interface TasksWithSearchFilterProps {
  initialTasks: TaskWithProfile[]
}

export function TasksWithSearchFilter({ initialTasks }: TasksWithSearchFilterProps) {
  const [filteredTasks, setFilteredTasks] = useState<TaskWithProfile[]>(initialTasks)

  const handleTasksUpdate = (tasks: TaskWithProfile[]) => {
    setFilteredTasks(tasks)
  }

  return (
    <div>
      <TasksSearchFilter 
        onTasksUpdate={handleTasksUpdate} 
      />
      {filteredTasks.length > 0 ? (
        <TaskList initialTasks={filteredTasks} />
      ) : (
        <NoTasksFound />
      )}
    </div>
  )
}