"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { TaskList } from "@/components/task-list"
import { poppins } from "@/lib/fonts"
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
    assignee?: Pick<User, "name"> | null;
};

interface TasksPageClientProps {
    initialTasks: TaskWithProfile[];
}

export function TasksPageClient({ initialTasks }: TasksPageClientProps) {
    const [tasks, setTasks] = useState<TaskWithProfile[]>(initialTasks)
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredTasks, setFilteredTasks] = useState<TaskWithProfile[]>(initialTasks)

    // Update tasks when initialTasks prop changes
    useEffect(() => {
        setTasks(initialTasks)
    }, [initialTasks])

    // Filter tasks based on search term
    useEffect(() => {
        const filtered = tasks.filter(task => {
            const searchLower = searchTerm.toLowerCase()
            return (
                task.name.toLowerCase().includes(searchLower) ||
                (task.description && task.description.toLowerCase().includes(searchLower)) ||
                task.status.toLowerCase().includes(searchLower) ||
                task.priority.toLowerCase().includes(searchLower) ||
                (task.assignee?.name && task.assignee.name.toLowerCase().includes(searchLower))
            )
        })
        setFilteredTasks(filtered)
    }, [tasks, searchTerm])

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

            {/* Search functionality */}
            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                {searchTerm && (
                    <div className="text-sm text-muted-foreground">
                        {filteredTasks.length} of {tasks.length} tasks
                    </div>
                )}
            </div>

            <TaskList initialTasks={filteredTasks} />
        </div>
    )
}
