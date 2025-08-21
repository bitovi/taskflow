# Drag and Drop Domain Implementation

## Hello-Pangea DnD Integration

The application uses Hello-Pangea DnD (successor to react-beautiful-dnd) for drag and drop functionality:

```typescript
// components/kanban-board.tsx
"use client"

import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { KanbanColumn, KanbanData } from "@/lib/types"
```

## Kanban Board Structure

The kanban board implements a three-level hierarchy: Context → Droppable → Draggable:

```typescript
export function KanbanBoard() {
  const [columns, setColumns] = useState<KanbanData>({
    todo: { id: "todo", title: "To Do", tasks: [] },
    in_progress: { id: "in_progress", title: "In Progress", tasks: [] },
    review: { id: "review", title: "Review", tasks: [] },
    done: { id: "done", title: "Done", tasks: [] },
  })

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    // Handle drag logic
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.values(columns).map((column) => (
          <div key={column.id} className="space-y-4">
            <h3 className="font-semibold text-lg">{column.title}</h3>
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-[200px] space-y-2 p-2 rounded-md transition-colors ${
                    snapshot.isDraggingOver ? "bg-accent/50" : "bg-muted/25"
                  }`}
                >
                  {column.tasks.map((task, index) => (
                    <Draggable
                      key={task.id.toString()}
                      draggableId={task.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`${
                            snapshot.isDragging ? "opacity-50" : "opacity-100"
                          }`}
                        >
                          <TaskCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  )
}
```

## Drag End Handler Logic

The drag end handler manages state updates and server synchronization:

```typescript
const handleDragEnd = (result: DropResult) => {
  const { destination, source, draggableId } = result

  if (!destination) return

  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  ) {
    return
  }

  const sourceColumn = columns[source.droppableId as keyof KanbanData]
  const destColumn = columns[destination.droppableId as keyof KanbanData]
  const draggedTask = sourceColumn.tasks.find(
    task => task.id.toString() === draggableId
  )

  if (!draggedTask) return

  // Remove from source
  const newSourceTasks = sourceColumn.tasks.filter(
    task => task.id.toString() !== draggableId
  )

  // Add to destination
  const newDestTasks = [...destColumn.tasks]
  newDestTasks.splice(destination.index, 0, draggedTask)

  // Update local state immediately (optimistic update)
  setColumns(prev => ({
    ...prev,
    [source.droppableId]: {
      ...sourceColumn,
      tasks: newSourceTasks
    },
    [destination.droppableId]: {
      ...destColumn,
      tasks: newDestTasks
    }
  }))

  // Sync to server
  updateTaskStatus(draggedTask.id, destination.droppableId as any)
}
```

## Task Card Component

Individual draggable task cards maintain their own styling and interactions:

```typescript
function TaskCard({ task }: { task: TaskWithProfile }) {
  const priorityColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800", 
    high: "bg-red-100 text-red-800"
  }

  return (
    <Card className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-2">
          <h4 className="font-medium text-sm leading-tight">{task.name}</h4>
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <Badge 
              variant="secondary" 
              className={priorityColors[task.priority as keyof typeof priorityColors]}
            >
              {task.priority}
            </Badge>
            {task.assignee && (
              <div className="text-xs text-muted-foreground">
                {task.assignee.name}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

## Visual Feedback During Drag

The implementation provides visual feedback during drag operations:

```typescript
// Droppable styling with isDraggingOver state
<div
  className={`min-h-[200px] space-y-2 p-2 rounded-md transition-colors ${
    snapshot.isDraggingOver ? "bg-accent/50" : "bg-muted/25"
  }`}
>

// Draggable styling with isDragging state
<div
  className={`${
    snapshot.isDragging ? "opacity-50" : "opacity-100"
  }`}
>
```

## State Synchronization

The drag and drop system combines optimistic updates with server actions:

1. **Immediate UI Update**: Local state changes instantly for responsiveness
2. **Server Sync**: Background server action updates the database
3. **Error Handling**: Rollback on server errors (implementation can be added)

```typescript
// Server action for status updates
export async function updateTaskStatus(taskId: number, newStatus: string) {
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { status: newStatus },
    })
    
    revalidatePath("/board")
    return { success: true }
  } catch (error) {
    console.error("Error updating task status:", error)
    return { success: false, error: "Failed to update task status" }
  }
}
```

## Type Safety for Drag Operations

The implementation uses proper TypeScript types for drag and drop data:

```typescript
// lib/types.ts
export type KanbanColumn = {
  id: "todo" | "in_progress" | "review" | "done"
  title: string
  tasks: TaskWithProfile[]
}

export type KanbanData = {
  [key in "todo" | "in_progress" | "review" | "done"]: KanbanColumn
}
```

This ensures type safety throughout the drag and drop implementation and prevents runtime errors from invalid column IDs or task data.