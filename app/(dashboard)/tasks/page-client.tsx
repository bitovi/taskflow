"use client"

import React, { useState, useCallback, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Search, X, Filter } from "lucide-react"
import Link from "next/link"
import { TaskList } from "@/components/task-list"
import { poppins } from "@/lib/fonts"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"

import { getFilteredTasks } from "./actions"
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

type TaskWithProfile = PrismaTask & {
    assignee?: Pick<User, "name"> | null;
};

interface TasksPageClientProps {
    initialTasks: TaskWithProfile[];
}

const STATUS_OPTIONS = [
    { value: "todo", label: "Todo" },
    { value: "in_progress", label: "In Progress" },
    { value: "review", label: "Review" },
    { value: "done", label: "Done" }
]

const PRIORITY_OPTIONS = [
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" }
]

export function TasksPageClient({ initialTasks }: TasksPageClientProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilters, setStatusFilters] = useState<string[]>(STATUS_OPTIONS.map(s => s.value))
    const [priorityFilters, setPriorityFilters] = useState<string[]>(PRIORITY_OPTIONS.map(p => p.value))
    const [tasks, setTasks] = useState<TaskWithProfile[]>(initialTasks)
    const [isPending, startTransition] = useTransition()

    const applyFilters = useCallback(() => {
        startTransition(async () => {
            const { tasks: filteredTasks, error } = await getFilteredTasks(
                searchQuery || undefined,
                statusFilters.length === STATUS_OPTIONS.length ? undefined : statusFilters,
                priorityFilters.length === PRIORITY_OPTIONS.length ? undefined : priorityFilters
            )
            if (!error) {
                setTasks(filteredTasks || [])
            }
        })
    }, [searchQuery, statusFilters, priorityFilters])

    const handleSearchChange = (value: string) => {
        setSearchQuery(value)
    }

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        applyFilters()
    }

    const clearSearch = () => {
        setSearchQuery("")
        if (searchQuery) {
            // Only apply filters if there was actually a search query to clear
            setTimeout(applyFilters, 0)
        }
    }

    const handleStatusFilterChange = (status: string, checked: boolean) => {
        const newFilters = checked
            ? [...statusFilters, status]
            : statusFilters.filter(s => s !== status)
        setStatusFilters(newFilters)
    }

    const handlePriorityFilterChange = (priority: string, checked: boolean) => {
        const newFilters = checked
            ? [...priorityFilters, priority]
            : priorityFilters.filter(p => p !== priority)
        setPriorityFilters(newFilters)
    }

    // Apply filters whenever search query or filters change
    React.useEffect(() => {
        const timeoutId = setTimeout(applyFilters, 300) // Debounce search
        return () => clearTimeout(timeoutId)
    }, [searchQuery, statusFilters, priorityFilters, applyFilters])

    const hasActiveFilters = searchQuery || 
        statusFilters.length !== STATUS_OPTIONS.length || 
        priorityFilters.length !== PRIORITY_OPTIONS.length

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

            {/* Search and Filter Controls */}
            <div className="flex items-center gap-4">
                <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-9 pr-9"
                    />
                    {searchQuery && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={clearSearch}
                            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </form>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Filter className="h-4 w-4" />
                            Filters
                            {hasActiveFilters && (
                                <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                                    {(statusFilters.length !== STATUS_OPTIONS.length ? 1 : 0) + 
                                     (priorityFilters.length !== PRIORITY_OPTIONS.length ? 1 : 0) +
                                     (searchQuery ? 1 : 0)}
                                </span>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64" align="end">
                        <DropdownMenuLabel>Status</DropdownMenuLabel>
                        {STATUS_OPTIONS.map((status) => (
                            <DropdownMenuCheckboxItem
                                key={status.value}
                                checked={statusFilters.includes(status.value)}
                                onCheckedChange={(checked) => handleStatusFilterChange(status.value, checked)}
                            >
                                {status.label}
                            </DropdownMenuCheckboxItem>
                        ))}
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuLabel>Priority</DropdownMenuLabel>
                        {PRIORITY_OPTIONS.map((priority) => (
                            <DropdownMenuCheckboxItem
                                key={priority.value}
                                checked={priorityFilters.includes(priority.value)}
                                onCheckedChange={(checked) => handlePriorityFilterChange(priority.value, checked)}
                            >
                                {priority.label}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Task List */}
            <div className="relative">
                {isPending && (
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
                        <div className="text-sm text-muted-foreground">Loading...</div>
                    </div>
                )}
                
                {tasks.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">No tasks match the current search and filter criteria.</p>
                    </div>
                ) : (
                    <TaskList initialTasks={tasks} />
                )}
            </div>
        </div>
    )
}