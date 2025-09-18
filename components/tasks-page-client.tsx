"use client"

import { useState, useEffect, useTransition } from "react"
import { TaskList } from "@/components/task-list"
import { TaskSearchFilter } from "@/components/task-search-filter"
import { getFilteredTasks } from "@/app/(dashboard)/tasks/actions"
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
    assignee?: Pick<User, "name"> | null
    creator?: Pick<User, "name"> | null
}

interface TasksPageClientProps {
    initialTasks: TaskWithProfile[]
}

export function TasksPageClient({ initialTasks }: TasksPageClientProps) {
    const [tasks, setTasks] = useState<TaskWithProfile[]>(initialTasks)
    const [isLoading, setIsLoading] = useState(false)
    const [isPending, startTransition] = useTransition()

    const handleFilterChange = async (searchText: string, status: string, priority: string) => {
        setIsLoading(true)
        startTransition(async () => {
            try {
                const { tasks: filteredTasks, error } = await getFilteredTasks(
                    searchText.trim() || undefined,
                    status === "all" ? undefined : status,
                    priority === "all" ? undefined : priority
                )

                if (error) {
                    console.error("Error filtering tasks:", error)
                    // On error, keep showing current tasks
                } else {
                    setTasks(filteredTasks || [])
                }
            } catch (err) {
                console.error("Error filtering tasks:", err)
                // On error, keep showing current tasks
            } finally {
                setIsLoading(false)
            }
        })
    }

    return (
        <div className="space-y-6">
            <TaskSearchFilter 
                onFilterChange={handleFilterChange} 
                isLoading={isLoading || isPending}
            />
            {isLoading || isPending ? (
                <div className="text-center py-8 text-muted-foreground">
                    Filtering tasks...
                </div>
            ) : (
                <TaskList initialTasks={tasks} />
            )}
        </div>
    )
}