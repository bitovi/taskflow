import { KanbanBoard } from "@/components/kanban-board"
import { getAllTasks } from "@/app/(dashboard)/tasks/actions"
import type { KanbanData, KanbanColumn } from "@/lib/types"
import { poppins } from "@/lib/fonts"


export default async function BoardPage() {
    console.log("[board/page.tsx - BoardPage] Fetching tasks for board view");
    const { tasks, error } = await getAllTasks()

    if (error) {
        console.error("[board/page.tsx - BoardPage] Error fetching tasks:", error)
        return <p className="p-8">Could not load data. Please try again later.</p>
    }

    console.log(`[board/page.tsx - BoardPage] Received ${tasks?.length || 0} tasks from getAllTasks`);

    const initialColumns: KanbanData = {
        todo: { id: "todo", title: "To Do", tasks: [] },
        in_progress: { id: "in_progress", title: "In Progress", tasks: [] },
        review: { id: "review", title: "Review", tasks: [] },
        done: { id: "done", title: "Done", tasks: [] },
    }

    let matchedCount = 0;
    let unmatchedCount = 0;
    const unmatchedTasks: any[] = [];

    tasks?.forEach((task) => {
        // Normalize the status to lowercase and replace spaces with underscores
        const normalizedStatus = task.status?.toLowerCase().replace(/\s+/g, '_');
        console.log(`[board/page.tsx - BoardPage] Processing task ${task.id}: name="${task.name}", status="${task.status}", normalized="${normalizedStatus}", status in columns: ${normalizedStatus in initialColumns}`);
        // Ensure task status is a valid key for initialColumns after normalization
        if (normalizedStatus && normalizedStatus in initialColumns) {
            initialColumns[normalizedStatus as keyof KanbanData].tasks.push(task)
            matchedCount++;
        } else {
            unmatchedCount++;
            unmatchedTasks.push({ id: task.id, name: task.name, status: task.status, normalized: normalizedStatus });
        }
    })

    console.log(`[board/page.tsx - BoardPage] Task distribution summary:`);
    console.log(`  - Matched tasks: ${matchedCount}`);
    console.log(`  - Unmatched tasks: ${unmatchedCount}`);
    if (unmatchedTasks.length > 0) {
        console.log(`  - Unmatched task details:`, unmatchedTasks);
    }
    console.log(`  - Column counts:`, {
        todo: initialColumns.todo.tasks.length,
        in_progress: initialColumns.in_progress.tasks.length,
        review: initialColumns.review.tasks.length,
        done: initialColumns.done.tasks.length,
    });

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className={`text-3xl font-bold tracking-tight ${poppins.className}`}>Board</h2>
            </div>
            <KanbanBoard initialData={initialColumns} />
        </div>
    )
}
