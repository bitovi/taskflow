# Drag and Drop Domain

## Overview

Drag and drop functionality uses **@hello-pangea/dnd** (fork of react-beautiful-dnd). Used for Kanban board task management with drag-to-reorder and drag-between-columns.

## Required Patterns

### 1. DragDropContext Wrapper

Wrap draggable area with DragDropContext:

```tsx
import { DragDropContext } from "@hello-pangea/dnd"

<DragDropContext onDragEnd={onDragEnd}>
  {/* Droppable areas */}
</DragDropContext>
```

Pattern: DragDropContext manages drag state, handles `onDragEnd` callback.

### 2. Droppable Areas

Define droppable zones (columns):

```tsx
import { Droppable } from "@hello-pangea/dnd"

<Droppable droppableId="todo">
  {(provided, snapshot) => (
    <div
      ref={provided.innerRef}
      {...provided.droppableProps}
      className={cn(
        "min-h-[100px]",
        snapshot.isDraggingOver && "bg-accent"
      )}
    >
      {/* Draggable items */}
      {provided.placeholder}
    </div>
  )}
</Droppable>
```

Pattern:
- `droppableId`: Unique identifier for the drop zone
- Render props pattern with `provided` and `snapshot`
- Spread `provided.innerRef` and `provided.droppableProps`
- Include `provided.placeholder` at the end

### 3. Draggable Items

Make items draggable:

```tsx
import { Draggable } from "@hello-pangea/dnd"

<Draggable draggableId={String(task.id)} index={index}>
  {(provided, snapshot) => (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={cn(
        "cursor-pointer",
        snapshot.isDragging && "shadow-lg ring-2 ring-primary"
      )}
    >
      {/* Task content */}
    </div>
  )}
</Draggable>
```

Pattern:
- `draggableId`: Unique string identifier
- `index`: Position in list
- Spread `provided.draggableProps` and `provided.dragHandleProps`
- Use `snapshot.isDragging` for visual feedback

### 4. onDragEnd Handler

Handle drag completion:

```tsx
const onDragEnd = (result: DropResult) => {
  const { source, destination, draggableId } = result

  // Dropped outside a droppable area
  if (!destination) return
  
  // Dropped in same position
  if (source.droppableId === destination.droppableId && source.index === destination.index) {
    return
  }

  const startColId = source.droppableId as keyof KanbanData
  const finishColId = destination.droppableId as keyof KanbanData

  // 1. Optimistically update local state
  const newColumns = updateColumns(startColId, finishColId, source.index, destination.index)
  setColumns(newColumns)

  // 2. Sync with server
  startTransition(async () => {
    await updateTaskStatus(Number.parseInt(draggableId), finishColId)
  })
}
```

Pattern:
- Check if `destination` exists
- Check if position actually changed
- Update local state immediately (optimistic)
- Sync with server in background using `startTransition`

### 5. Client Component Requirement

Drag and drop must be in client components:

```tsx
"use client"

import { useState, useTransition } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
```

Pattern: Always mark with "use client" directive.

### 6. Optimistic Updates

Update UI before server confirms:

```tsx
const [columns, setColumns] = useState(initialData)
const [isPending, startTransition] = useTransition()

const onDragEnd = (result: DropResult) => {
  // 1. Update local state immediately
  const newColumns = calculateNewState(result)
  setColumns(newColumns)
  
  // 2. Sync with server in background
  startTransition(async () => {
    await updateTaskStatus(taskId, newStatus)
  })
}
```

Pattern: Update state synchronously, then async server call.

## Complete Kanban Board Example

```tsx
// components/kanban-board.tsx
"use client"

import { useState, useTransition } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { updateTaskStatus } from "@/app/(dashboard)/tasks/actions"
import { cn } from "@/lib/utils"
import type { KanbanColumn, KanbanData } from "@/lib/types"

export function KanbanBoard({ initialData }: { initialData: KanbanData }) {
  const [columns, setColumns] = useState(initialData)
  const [isPending, startTransition] = useTransition()

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result

    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const startColId = source.droppableId as keyof KanbanData
    const finishColId = destination.droppableId as keyof KanbanData

    const startCol = columns[startColId]
    const finishCol = columns[finishColId]

    const startTasks = Array.from(startCol.tasks)
    const [movedTask] = startTasks.splice(source.index, 1)

    // Optimistically update UI
    if (startColId === finishColId) {
      startTasks.splice(destination.index, 0, movedTask)
      const newCol = { ...startCol, tasks: startTasks }
      setColumns({ ...columns, [startColId]: newCol })
    } else {
      const finishTasks = Array.from(finishCol.tasks)
      finishTasks.splice(destination.index, 0, movedTask)
      const newStartCol = { ...startCol, tasks: startTasks }
      const newFinishCol = { ...finishCol, tasks: finishTasks }
      setColumns({ ...columns, [startColId]: newStartCol, [finishColId]: newFinishCol })
    }

    // Update the database
    startTransition(async () => {
      await updateTaskStatus(Number.parseInt(draggableId), finishColId)
    })
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-6 overflow-x-auto pb-4">
        {Object.values(columns).map((column) => (
          <Droppable key={column.id} droppableId={column.id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={cn(
                  "flex-shrink-0 w-80 transition-colors rounded-lg",
                  snapshot.isDraggingOver ? "bg-background-light" : "bg-background-dark"
                )}
              >
                <Card className="bg-transparent border-0 shadow-none">
                  <CardHeader className="pb-3 px-4 pt-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">
                        {column.title}
                        <Badge variant="secondary" className="ml-2">
                          {column.tasks.length}
                        </Badge>
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 min-h-[100px] px-4 pb-4">
                    {column.tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Card
                              className={cn(
                                "cursor-pointer hover:shadow-md transition-shadow",
                                snapshot.isDragging && "shadow-lg ring-2 ring-primary"
                              )}
                            >
                              <CardContent className="p-3">
                                {/* Task content */}
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </CardContent>
                </Card>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  )
}
```

## Data Structure

### Kanban Data Type

```typescript
// lib/types.ts
export interface KanbanColumn {
  id: string
  title: string
  tasks: Task[]
}

export interface KanbanData {
  todo: KanbanColumn
  in_progress: KanbanColumn
  review: KanbanColumn
  done: KanbanColumn
}
```

### Task Type

```typescript
export interface Task {
  id: number
  name: string
  description: string
  priority: string
  status: string
  dueDate: Date | null
  assignee: {
    id: number
    name: string
  } | null
}
```

## Visual Feedback

### Dragging State

```tsx
<Card
  className={cn(
    "cursor-pointer hover:shadow-md transition-shadow",
    snapshot.isDragging && "shadow-lg ring-2 ring-primary"
  )}
>
```

### Drag Over State

```tsx
<div
  className={cn(
    "flex-shrink-0 w-80 transition-colors rounded-lg",
    snapshot.isDraggingOver ? "bg-background-light" : "bg-background-dark"
  )}
>
```

## Constraints

1. **Client component required**: Must use "use client"
2. **@hello-pangea/dnd library**: Fork of react-beautiful-dnd
3. **Render props pattern**: Droppable and Draggable use render props
4. **provided.placeholder required**: Must include in Droppable
5. **String draggableId**: IDs must be strings, not numbers
6. **Optimistic updates**: Update local state before server
7. **useTransition for sync**: Wrap server action in startTransition
8. **Kanban board location**: Implementation in components/kanban-board.tsx
9. **Status-based columns**: Columns organized by task status (todo, in_progress, review, done)

## Server Integration

```typescript
// app/(dashboard)/tasks/actions.ts
"use server"

export async function updateTaskStatus(taskId: number, status: string) {
    try {
        await prisma.task.update({
            where: { id: taskId },
            data: { status },
        })
        revalidatePath("/board")
        return { error: null, success: true }
    } catch (e) {
        return { error: "Failed to update task status.", success: false }
    }
}
```

Pattern: Server action updates database, revalidates path.

## Tools and Technologies

- **@hello-pangea/dnd**: Drag and drop library
- **React useState**: Local drag state management
- **React useTransition**: Non-blocking server updates
- **Server Actions**: Database synchronization
