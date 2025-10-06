"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { TaskList } from "@/components/task-list"
import { TaskSearchFilter } from "@/components/task-search-filter"
import { poppins } from "@/lib/fonts"
import { getAllTasks } from "@/app/(dashboard)/tasks/actions"

import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};


export default function TasksPage() {
    const [tasks, setTasks] = useState<TaskWithProfile[]>([])
    const [filteredTasks, setFilteredTasks] = useState<TaskWithProfile[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilters, setStatusFilters] = useState<string[]>(["todo", "in_progress", "review", "done"])
    const [priorityFilters, setPriorityFilters] = useState<string[]>(["high", "medium", "low"])

    // Load initial tasks
    useEffect(() => {
        async function loadTasks() {
            const { tasks: initialTasks, error: fetchError } = await getAllTasks();
            if (fetchError) {
                setError(fetchError)
            } else {
                setTasks(initialTasks || [])
                setFilteredTasks(initialTasks || [])
            }
            setLoading(false)
        }
        loadTasks()
    }, [])

    // Apply filters when search or filters change
    const applyFilters = useCallback(() => {
        if (!tasks.length) return

        let filtered = tasks

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(task => 
                task.name.toLowerCase().includes(query) ||
                task.description?.toLowerCase().includes(query)
            )
        }

        // Apply status filter
        if (statusFilters.length > 0) {
            filtered = filtered.filter(task => statusFilters.includes(task.status))
        }

        // Apply priority filter
        if (priorityFilters.length > 0) {
            filtered = filtered.filter(task => priorityFilters.includes(task.priority))
        }

        setFilteredTasks(filtered)
    }, [tasks, searchQuery, statusFilters, priorityFilters])

    useEffect(() => {
        applyFilters()
    }, [applyFilters])

    const handleSearchChange = useCallback((search: string) => {
        setSearchQuery(search)
    }, [])

    const handleFiltersChange = useCallback((newStatusFilters: string[], newPriorityFilters: string[]) => {
        setStatusFilters(newStatusFilters)
        setPriorityFilters(newPriorityFilters)
    }, [])

    if (loading) {
        return <div className="p-8">Loading tasks...</div>
    }

    if (error) {
        console.error("Error fetching data:", error)
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

            <TaskSearchFilter
                onSearchChange={handleSearchChange}
                onFiltersChange={handleFiltersChange}
                initialSearch={searchQuery}
                initialStatusFilters={statusFilters}
                initialPriorityFilters={priorityFilters}
            />

            <TaskList initialTasks={filteredTasks} />
        </div>
    )
}
