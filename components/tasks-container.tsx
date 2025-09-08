"use client"

import { useState, useEffect, useTransition } from "react"
import { TaskList } from "@/components/task-list"
import { TaskSearchAndFilter } from "@/components/task-search-and-filter"
import { getFilteredTasks } from "@/app/(dashboard)/tasks/actions"

import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
  creator?: Pick<User, "name"> | null;
};

type TasksContainerProps = {
    initialTasks: TaskWithProfile[]
}

export function TasksContainer({ initialTasks }: TasksContainerProps) {
    const [tasks, setTasks] = useState<TaskWithProfile[]>(initialTasks)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedPriorities, setSelectedPriorities] = useState<string[]>(["high", "medium", "low"])
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["todo", "in_progress", "review", "done"])
    const [isPending, startTransition] = useTransition()

    const handleSearchChange = (newSearchTerm: string) => {
        setSearchTerm(newSearchTerm)
        updateTasks(newSearchTerm, selectedPriorities, selectedStatuses)
    }

    const handleFiltersChange = (newPriorities: string[], newStatuses: string[]) => {
        setSelectedPriorities(newPriorities)
        setSelectedStatuses(newStatuses)
        updateTasks(searchTerm, newPriorities, newStatuses)
    }

    const updateTasks = (search: string, priorities: string[], statuses: string[]) => {
        startTransition(async () => {
            const { tasks: filteredTasks, error } = await getFilteredTasks(search, priorities, statuses)
            if (!error && filteredTasks) {
                setTasks(filteredTasks)
            }
        })
    }

    return (
        <div>
            <TaskSearchAndFilter
                onSearchChange={handleSearchChange}
                onFiltersChange={handleFiltersChange}
                searchTerm={searchTerm}
                selectedPriorities={selectedPriorities}
                selectedStatuses={selectedStatuses}
            />
            
            {isPending && (
                <div className="text-center py-4 text-muted-foreground">
                    Loading tasks...
                </div>
            )}
            
            {!isPending && tasks.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-muted-foreground text-lg">No tasks match the current search and filter criteria</p>
                    <p className="text-muted-foreground text-sm mt-2">Try adjusting your search terms or filters</p>
                </div>
            )}
            
            {!isPending && tasks.length > 0 && (
                <TaskList initialTasks={tasks} />
            )}
        </div>
    )
}