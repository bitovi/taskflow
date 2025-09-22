import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { TaskList } from "@/components/task-list"
import { TaskSearch } from "@/components/task-search"
import { poppins } from "@/lib/fonts"

import { getFilteredTasks } from "@/app/(dashboard)/tasks/actions"

export const revalidate = 0

type SearchProps = {
    search?: string
    statuses?: string
    priorities?: string
}

export default async function TasksPage({ 
    searchParams 
}: { 
    searchParams: Promise<SearchProps>
}) {
    const params = await searchParams
    const search = params?.search || undefined
    const statuses = params?.statuses?.split(',') || undefined
    const priorities = params?.priorities?.split(',') || undefined
    
    const { tasks, error } = await getFilteredTasks(search, statuses, priorities);
    
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

            <TaskSearch />

            <Suspense fallback={<div>Loading tasks...</div>}>
                <TaskList initialTasks={tasks || []} />
            </Suspense>
        </div>
    )
}
