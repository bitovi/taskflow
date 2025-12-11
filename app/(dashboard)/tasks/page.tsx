import { Suspense } from "react"
import { TasksPageClient } from "@/components/tasks-page-client"
import { getAllTasks, searchTasks } from "@/app/(dashboard)/tasks/actions"

export const revalidate = 0

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function TasksPage(props: { searchParams: SearchParams }) {
    const searchParams = await props.searchParams
    const query = typeof searchParams.q === "string" ? searchParams.q : ""
    
    // Fetch tasks based on query
    const { tasks, error } = query ? await searchTasks(query) : await getAllTasks()
    
    if (error) {
        console.error("Error fetching data:", error)
        return <p className="p-8">Could not load data. Please try again later.</p>
    }

    return (
        <Suspense fallback={<div>Loading tasks...</div>}>
            <TasksPageClient initialTasks={tasks || []} initialQuery={query} />
        </Suspense>
    )
}
