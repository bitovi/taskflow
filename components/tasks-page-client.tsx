"use client"

import { useState, useTransition } from "react"
import { TaskList } from "@/components/task-list"
import { TaskSearchFilter } from "@/components/task-search-filter"
import { getFilteredTasks } from "@/app/(dashboard)/tasks/actions"

import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

interface TasksPageClientProps {
    initialTasks: TaskWithProfile[]
}

export function TasksPageClient({ initialTasks }: TasksPageClientProps) {
    const [tasks, setTasks] = useState<TaskWithProfile[]>(initialTasks)
    const [isPending, startTransition] = useTransition()

    const handleSearch = (searchQuery: string, statusFilters: string[], priorityFilters: string[]) => {
        startTransition(async () => {
            const { tasks: filteredTasks, error } = await getFilteredTasks(
                searchQuery || undefined,
                statusFilters.length === 4 ? undefined : statusFilters, // Don't filter if all statuses are selected
                priorityFilters.length === 3 ? undefined : priorityFilters // Don't filter if all priorities are selected
            )
            
            if (!error) {
                setTasks(filteredTasks || [])
            }
        })
    }

    return (
        <div>
            <TaskSearchFilter onSearch={handleSearch} />
            {isPending && (
                <div className="text-center text-muted-foreground mb-4">
                    Searching...
                </div>
            )}
            {tasks.length === 0 && !isPending && (
                <div className="text-center py-12">
                    <div className="text-muted-foreground text-lg mb-2">
                        No tasks match your search criteria
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Try adjusting your search query or filters
                    </div>
                </div>
            )}
            {tasks.length > 0 && <TaskList initialTasks={tasks} />}
        </div>
    )
}
