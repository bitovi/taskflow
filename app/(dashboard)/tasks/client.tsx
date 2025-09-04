"use client"

import { Suspense, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { TaskList } from "@/components/task-list"
import { TaskSearchFilter } from "@/components/task-search-filter"
import { poppins } from "@/lib/fonts"
import { getFilteredTasks } from "@/app/(dashboard)/tasks/actions"

import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

type TaskWithProfile = PrismaTask & {
    assignee?: Pick<User, "name"> | null;
};

interface TasksPageClientProps {
    initialTasks: TaskWithProfile[];
}

export default function TasksPageClient({ initialTasks }: TasksPageClientProps) {
    const [tasks, setTasks] = useState<TaskWithProfile[]>(initialTasks)
    const [isPending, startTransition] = useTransition()
    const [hasSearchOrFilter, setHasSearchOrFilter] = useState(false)

    const handleSearchAndFilter = async (searchText: string, statusFilters: string[], priorityFilters: string[]) => {
        const isSearching = searchText.trim() !== "" || statusFilters.length < 4 || priorityFilters.length < 3
        setHasSearchOrFilter(isSearching)
        
        startTransition(async () => {
            const { tasks: filteredTasks, error } = await getFilteredTasks(
                searchText.trim() || undefined,
                statusFilters.length === 4 ? undefined : statusFilters,
                priorityFilters.length === 3 ? undefined : priorityFilters
            )
            if (!error) {
                setTasks(filteredTasks)
            }
        })
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className={`text-3xl font-bold tracking-tight ${poppins.className}`}>Tasks</h2>
                <Link href="/tasks/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Task
                    </Button>
                </Link>
            </div>

            <TaskSearchFilter onSearchAndFilter={handleSearchAndFilter} />

            <Suspense fallback={<div>Loading tasks...</div>}>
                {isPending ? (
                    <div>Loading tasks...</div>
                ) : tasks.length > 0 ? (
                    <TaskList initialTasks={tasks} />
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">
                            {hasSearchOrFilter 
                                ? "No tasks match the current search and filter criteria" 
                                : "No tasks found"}
                        </p>
                    </div>
                )}
            </Suspense>
        </div>
    )
}