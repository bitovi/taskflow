"use client"

import { Suspense, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { TaskList } from "@/components/task-list"
import { poppins } from "@/lib/fonts"
import { getAllTasks } from "@/app/(dashboard)/tasks/actions"
import { useEffect } from "react"

import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

export default function TasksPage() {
    const [tasks, setTasks] = useState<TaskWithProfile[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const { tasks: fetchedTasks, error: fetchError } = await getAllTasks();
                if (fetchError) {
                    setError(fetchError);
                } else {
                    setTasks(fetchedTasks || []);
                }
            } catch {
                setError("Failed to fetch tasks");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTasks();
    }, []);

    if (error && !isLoading) {
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

            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search tasks by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            {isLoading ? (
                <div>Loading tasks...</div>
            ) : (
                <Suspense fallback={<div>Loading tasks...</div>}>
                    <TaskList initialTasks={tasks || []} searchQuery={searchQuery} />
                </Suspense>
            )}
        </div>
    )
}
