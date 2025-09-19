"use client"

import { Suspense, useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { TaskList } from "@/components/task-list"
import { TaskSearchFilter } from "@/components/task-search-filter"
import { poppins } from "@/lib/fonts"

import { getAllTasks, searchAndFilterTasks } from "@/app/(dashboard)/tasks/actions"
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

export default function TasksPage() {
    const [allTasks, setAllTasks] = useState<TaskWithProfile[]>([])
    const [filteredTasks, setFilteredTasks] = useState<TaskWithProfile[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilters, setStatusFilters] = useState<string[]>(["todo", "in_progress", "review", "done"])
    const [priorityFilters, setPriorityFilters] = useState<string[]>(["high", "medium", "low"])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Load initial tasks
    useEffect(() => {
        const loadTasks = async () => {
            const { tasks, error } = await getAllTasks()
            if (error) {
                setError(error)
            } else {
                setAllTasks(tasks || [])
                setFilteredTasks(tasks || [])
            }
            setIsLoading(false)
        }
        loadTasks()
    }, [])

    // Apply search and filters
    const applyFilters = useCallback(async () => {
        if (allTasks.length === 0) return

        const hasActiveSearch = searchQuery.trim() !== ""
        const hasActiveStatusFilters = statusFilters.length > 0 && statusFilters.length < 4
        const hasActivePriorityFilters = priorityFilters.length > 0 && priorityFilters.length < 3

        // If no filters are active, show all tasks
        if (!hasActiveSearch && !hasActiveStatusFilters && !hasActivePriorityFilters) {
            setFilteredTasks(allTasks)
            return
        }

        const { tasks, error } = await searchAndFilterTasks(
            hasActiveSearch ? searchQuery : undefined,
            hasActiveStatusFilters ? statusFilters : undefined,
            hasActivePriorityFilters ? priorityFilters : undefined
        )

        if (error) {
            setError(error)
        } else {
            setFilteredTasks(tasks || [])
        }
    }, [searchQuery, statusFilters, priorityFilters, allTasks])

    useEffect(() => {
        applyFilters()
    }, [applyFilters])

    const handleSearchChange = useCallback((query: string) => {
        setSearchQuery(query)
    }, [])

    const handleFiltersChange = useCallback((newStatusFilters: string[], newPriorityFilters: string[]) => {
        setStatusFilters(newStatusFilters)
        setPriorityFilters(newPriorityFilters)
    }, [])

    const hasActiveFilters = searchQuery.trim() !== "" || 
                             statusFilters.length < 4 || 
                             priorityFilters.length < 3

    if (isLoading) {
        return (
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between">
                    <h2 className={`text-3xl font-bold tracking-tight ${poppins.className}`}>Tasks</h2>
                </div>
                <div>Loading tasks...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between">
                    <h2 className={`text-3xl font-bold tracking-tight ${poppins.className}`}>Tasks</h2>
                </div>
                <p className="p-8">Could not load data. Please try again later.</p>
            </div>
        )
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

            <TaskSearchFilter
                onSearchChange={handleSearchChange}
                onFiltersChange={handleFiltersChange}
                searchQuery={searchQuery}
                statusFilters={statusFilters}
                priorityFilters={priorityFilters}
            />

            <Suspense fallback={<div>Loading tasks...</div>}>
                <TaskList 
                    initialTasks={allTasks} 
                    filteredTasks={filteredTasks}
                    hasFilters={hasActiveFilters}
                />
            </Suspense>
        </div>
    )
}
