"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { TaskList } from "@/components/task-list"
import { TaskSearchFilter } from "@/components/task-search-filter"
import { poppins } from "@/lib/fonts"

import { getAllTasks, getFilteredTasks } from "@/app/(dashboard)/tasks/actions"
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

// Type for task with profile info
type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
}

export default function TasksPage() {
    const [allTasks, setAllTasks] = useState<TaskWithProfile[]>([])
    const [filteredTasks, setFilteredTasks] = useState<TaskWithProfile[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilters, setStatusFilters] = useState<string[]>(["todo", "in_progress", "review", "done"])
    const [priorityFilters, setPriorityFilters] = useState<string[]>(["low", "medium", "high"])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Load initial tasks
    useEffect(() => {
        const loadTasks = async () => {
            setLoading(true)
            const { tasks, error } = await getAllTasks()
            if (error) {
                setError(error)
            } else {
                setAllTasks(tasks || [])
                setFilteredTasks(tasks || [])
            }
            setLoading(false)
        }
        loadTasks()
    }, [])

    // Apply filters whenever search or filter criteria change
    useEffect(() => {
        const applyFilters = async () => {
            const { tasks, error } = await getFilteredTasks(
                searchQuery,
                statusFilters.length > 0 ? statusFilters : undefined,
                priorityFilters.length > 0 ? priorityFilters : undefined
            )
            if (error) {
                setError(error)
            } else {
                setFilteredTasks(tasks || [])
            }
        }
        applyFilters()
    }, [searchQuery, statusFilters, priorityFilters])

    const handleSearchChange = (search: string) => {
        setSearchQuery(search)
    }

    const handleFiltersChange = (newStatusFilters: string[], newPriorityFilters: string[]) => {
        setStatusFilters(newStatusFilters)
        setPriorityFilters(newPriorityFilters)
    }

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

            <TaskSearchFilter
                searchQuery={searchQuery}
                statusFilters={statusFilters}
                priorityFilters={priorityFilters}
                onSearchChange={handleSearchChange}
                onFiltersChange={handleFiltersChange}
            />

            {loading ? (
                <div>Loading tasks...</div>
            ) : (
                <TaskList filteredTasks={filteredTasks} />
            )}
        </div>
    )
}
