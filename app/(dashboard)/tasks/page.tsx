import { getAllTasks } from "@/app/(dashboard)/tasks/actions"
import { TasksPageClient } from "./page.client"

export const revalidate = 0

export default async function TasksPage() {
    const { tasks, error } = await getAllTasks();
    if (error) {
        console.error("Error fetching data:", error)
        return <p className="p-8">Could not load data. Please try again later.</p>
    }

    return <TasksPageClient initialTasks={tasks || []} />
}
