import { TasksPageClient } from "@/components/tasks-page-client"

export const revalidate = 0

export default async function TasksPage() {
    return <TasksPageClient />
}
