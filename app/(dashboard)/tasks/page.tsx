"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { TaskList } from "@/components/task-list"
import { TaskSearchFilter, FilterState } from "@/components/task-search-filter"
import { poppins } from "@/lib/fonts"
import { getAllTasks } from "@/app/(dashboard)/tasks/actions"
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
  creator?: Pick<User, "name"> | null;
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<TaskWithProfile[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [filters, setFilters] = useState<FilterState>({
        status: ["todo", "in_progress", "review", "done"],
        priority: ["high", "medium", "low"]
    })

    // Load tasks on mount
    useEffect(() => {
        const loadTasks = async () => {
            try {
                const { tasks: fetchedTasks, error: fetchError } = await getAllTasks()
                if (fetchError) {
                    setError(fetchError)
                } else {
                    setTasks(fetchedTasks || [])
                }
            } catch {
                setError("Failed to load tasks")
            } finally {
                setLoading(false)
            }
        }
        
        loadTasks()
    }, [])

    // Filter tasks based on search term and filters
    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            // Search filter - check name and description
            const matchesSearch = !searchTerm || 
                task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))

            // Status filter
            const matchesStatus = filters.status.length === 0 || filters.status.includes(task.status)

            // Priority filter  
            const matchesPriority = filters.priority.length === 0 || filters.priority.includes(task.priority)

            return matchesSearch && matchesStatus && matchesPriority
        })
    }, [tasks, searchTerm, filters])

    // Check if user has active filters (not all options selected)
    const hasActiveFilters = useMemo(() => {
        return filters.status.length < 4 || filters.priority.length < 3
    }, [filters])

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
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filters={filters}
                onFiltersChange={setFilters}
            />

            <TaskList 
                initialTasks={tasks}
                filteredTasks={filteredTasks}
                searchTerm={searchTerm}
                hasActiveFilters={hasActiveFilters}
            />
        </div>
    )
}
