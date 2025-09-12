"use client"

import { useState } from "react"
import { TaskList } from "./task-list"
import { TaskSearchFilter, TaskFilters } from "./task-search-filter"
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

interface TasksPageClientProps {
  initialTasks: TaskWithProfile[];
  assignees: Array<{ id: number; name: string }>;
}

export function TasksPageClient({ initialTasks, assignees }: TasksPageClientProps) {
  const [filters, setFilters] = useState<TaskFilters>({
    search: "",
    status: "all",
    priority: "all",
    assignee: "all"
  });

  const handleFiltersChange = (newFilters: TaskFilters) => {
    setFilters(newFilters);
  };

  return (
    <div>
      <TaskSearchFilter 
        onFiltersChange={handleFiltersChange}
        assignees={assignees}
      />
      <TaskList 
        initialTasks={initialTasks} 
        filters={filters}
      />
    </div>
  );
}