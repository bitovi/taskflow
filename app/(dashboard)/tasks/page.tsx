import { Suspense } from "react"
import { TasksPageWithSearch } from "@/components/tasks-page-with-search"
import { getAllTasks } from "@/app/(dashboard)/tasks/actions"

export const revalidate = 0

export default async function TasksPage() {
    const { tasks, error } = await getAllTasks();
    if (error) {
        console.error("Error fetching data:", error)
        return <p className="p-8">Could not load data. Please try again later.</p>
    }

    return (
        <Suspense fallback={<div className="p-8">Loading...</div>}>
            <TasksPageWithSearch initialTasks={tasks || []} />
        </Suspense>
    )
}
