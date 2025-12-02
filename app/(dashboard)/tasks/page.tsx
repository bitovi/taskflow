import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { TaskSearchResults } from "@/components/task-search-results"
import { poppins } from "@/lib/fonts"

export const revalidate = 0


export default async function TasksPage() {
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

            <Suspense fallback={<div>Loading tasks...</div>}>
                <TaskSearchResults />
            </Suspense>
        </div>
    )
}
