"use client"

import { useState, useMemo } from "react"
import { TaskList } from "@/components/task-list"
import { TaskSearchFilter, FilterState } from "@/components/task-search-filter"
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

type TaskWithProfile = PrismaTask & {
    assignee?: Pick<User, "name"> | null;
};

interface TasksClientProps {
    initialTasks: TaskWithProfile[];
}

export function TasksClient({ initialTasks }: TasksClientProps) {
    const [filters, setFilters] = useState<FilterState>({
        search: "",
        statuses: ["todo", "in_progress", "review", "done"],
        priorities: ["high", "medium", "low"]
    })

    const filteredTasks = useMemo(() => {
        return initialTasks.filter(task => {
            // Search filter
            if (filters.search) {
                const searchLower = filters.search.toLowerCase()
                const matchesName = task.name.toLowerCase().includes(searchLower)
                const matchesDescription = task.description?.toLowerCase().includes(searchLower)
                if (!matchesName && !matchesDescription) {
                    return false
                }
            }

            // Status filter
            if (filters.statuses.length > 0 && !filters.statuses.includes(task.status)) {
                return false
            }

            // Priority filter
            if (filters.priorities.length > 0 && !filters.priorities.includes(task.priority)) {
                return false
            }

            return true
        })
    }, [initialTasks, filters])

    const handleFilterChange = (newFilters: FilterState) => {
        setFilters(newFilters)
    }

    return (
        <>
            <TaskSearchFilter 
                onFilterChange={handleFilterChange}
            />
            {filteredTasks.length === 0 && (filters.search || 
                filters.statuses.length < 4 || 
                filters.priorities.length < 3) ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                        No tasks match the current search and filter criteria
                    </p>
                    <p className="text-muted-foreground text-sm mt-2">
                        Try adjusting your search terms or filters
                    </p>
                </div>
            ) : (
                <TaskList initialTasks={filteredTasks} />
            )}
        </>
    )
}