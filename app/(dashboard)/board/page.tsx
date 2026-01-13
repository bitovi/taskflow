import { KanbanBoard } from "@/components/kanban-board"
import { getAllTasks } from "@/app/(dashboard)/tasks/actions"
import type { KanbanData } from "@/lib/types"
import { poppins } from "@/lib/fonts"


export default async function BoardPage() {
    const { tasks, error } = await getAllTasks()
    const boardTitle = "Kanban Board";
    let columnCount = 4;

    if (error) {
        console.error("Error fetching tasks:", error)
        return <p className="p-8">Could not load data. Please try again later.</p>
    }

    console.log(initialColumns);
    
    const initialColumns: KanbanData = {
        todo: { id: "todo", title: "To Do", tasks: [] },
        in_progress: { id: "in_progress", title: "In Progress", tasks: [] },
        review: { id: "review", title: "Review", tasks: [] },
        done: { id: "done", title: "Done", tasks: [] },
    }

    tasks?.forEach((task) => {
        // Ensure task status is a valid key for initialColumns
        if (task.status && task.status in initialColumns) {
            initialColumns[task.status as keyof KanbanData].tasks.push(task)
        }
    })

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className={`text-3xl font-bold tracking-tight ${poppins.className}`}>Board</h2>
            </div>
            <KanbanBoard initialData={initialColumns} />
        </div>
    )
}
