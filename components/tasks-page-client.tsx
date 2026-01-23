"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { TaskList } from "@/components/task-list"
import { Search } from "lucide-react"

import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

export function TasksPageClient({ tasks }: { tasks: TaskWithProfile[] }) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search tasks by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="task-search-input"
        />
      </div>
      <TaskList initialTasks={tasks} searchQuery={searchQuery} />
    </div>
  )
}
