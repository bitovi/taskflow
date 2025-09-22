"use client"

import { Suspense, useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { TaskList } from "@/components/task-list"
import { SearchAndFilter } from "@/components/search-and-filter"
import { poppins } from "@/lib/fonts"
import { getAllTasks, getFilteredTasks } from "@/app/(dashboard)/tasks/actions"
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<TaskWithProfile[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["todo", "in_progress", "review", "done"])
    const [selectedPriorities, setSelectedPriorities] = useState<string[]>(["high", "medium", "low"])

    // Load tasks initially
    useEffect(() => {
        loadInitialTasks()
    }, [])

    const loadInitialTasks = async () => {
        try {
            setLoading(true)
            const { tasks: allTasks, error } = await getAllTasks()
            if (error) {
                setError(error)
            } else {
                setTasks(allTasks || [])
            }
        } catch (e) {
            setError("Failed to load tasks")
        } finally {
            setLoading(false)
        }
    }

    // Load filtered tasks when search or filter changes
    const loadFilteredTasks = useCallback(async (search: string, statuses: string[], priorities: string[]) => {
        try {
            setLoading(true)
            const { tasks: filteredTasks, error } = await getFilteredTasks(
                search || undefined,
                statuses.length > 0 ? statuses : undefined,
                priorities.length > 0 ? priorities : undefined
            )
            if (error) {
                setError(error)
            } else {
                setTasks(filteredTasks || [])
            }
        } catch (e) {
            setError("Failed to load tasks")
        } finally {
            setLoading(false)
        }
    }, [])

    const handleSearchChange = useCallback((query: string) => {
        setSearchQuery(query)
        loadFilteredTasks(query, selectedStatuses, selectedPriorities)
    }, [selectedStatuses, selectedPriorities, loadFilteredTasks])

    const handleFilterChange = useCallback((statuses: string[], priorities: string[]) => {
        setSelectedStatuses(statuses)
        setSelectedPriorities(priorities)
        loadFilteredTasks(searchQuery, statuses, priorities)
    }, [searchQuery, loadFilteredTasks])

    if (error) {
        return <p className="p-8">Could not load data. Please try again later.</p>
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

            <SearchAndFilter
                onSearchChange={handleSearchChange}
                onFilterChange={handleFilterChange}
                initialSearch={searchQuery}
                initialStatuses={selectedStatuses}
                initialPriorities={selectedPriorities}
            />

            {loading ? (
                <div>Loading tasks...</div>
            ) : (
                <TaskList initialTasks={tasks} />
            )}
        </div>
    )
}
