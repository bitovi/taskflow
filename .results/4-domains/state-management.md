# State Management Domain

## Overview

The state management approach is **server-first** using Next.js server components and server actions. Client-side state is managed with React hooks (`useState`, `useEffect`, `useTransition`). No global state management libraries (Redux, Zustand) are used.

## Required Patterns

### 1. Server Components Fetch Data Directly

Server components fetch data using async/await:

```tsx
// app/(dashboard)/page.tsx
import { getTeamStats } from "./tasks/actions"
import { TeamStats } from "@/components/team-stats"

export default async function DashboardPage() {
  const stats = await getTeamStats()
  
  return (
    <div className="p-8">
      <TeamStats stats={stats} />
    </div>
  )
}
```

Pattern: Server components are async functions that fetch data directly.

### 2. Pass Data to Client Components via Props

Server components fetch, client components receive via props:

```tsx
// app/(dashboard)/tasks/page.tsx - Server component
import { getAllTasks } from "./actions"
import { TasksPageClient } from "@/components/tasks-page-client"

export default async function TasksPage() {
  const tasks = await getAllTasks()
  
  return <TasksPageClient tasks={tasks} />
}
```

```tsx
// components/tasks-page-client.tsx - Client component
"use client"

import { useState } from "react"
import type { Task } from "@/lib/types"

export function TasksPageClient({ tasks }: { tasks: Task[] }) {
  const [filter, setFilter] = useState("all")
  
  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true
    return task.status === filter
  })
  
  return (/* ... */)
}
```

Pattern: Server component fetches data, passes to client component for interactivity.

### 3. Local State with useState

Client-side UI state uses `useState`:

```tsx
// components/kanban-board.tsx
"use client"

import { useState } from "react"

export function KanbanBoard({ initialData }: { initialData: KanbanData }) {
  const [columns, setColumns] = useState(initialData)
  
  // ... component logic
}
```

### 4. Side Effects with useEffect

Data fetching or subscriptions in client components use `useEffect`:

```tsx
"use client"

import { useEffect, useState } from "react"

export function SomeComponent() {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    // Fetch data or subscribe to changes
    fetchData().then(setData)
  }, [])
  
  return (/* ... */)
}
```

Pattern: Use `useEffect` for client-side data fetching or subscriptions.

### 5. Optimistic Updates with useTransition

Handle mutations optimistically with `useTransition`:

```tsx
// components/kanban-board.tsx
"use client"

import { useState, useTransition } from "react"
import { updateTaskStatus } from "@/app/(dashboard)/tasks/actions"

export function KanbanBoard({ initialData }: { initialData: KanbanData }) {
  const [columns, setColumns] = useState(initialData)
  const [isPending, startTransition] = useTransition()

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result

    if (!destination) return

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

  return (/* ... */)
}
```

Pattern:
1. Update local state immediately (optimistic update)
2. Wrap server action in `startTransition`
3. Use `isPending` for loading indicators if needed

### 6. Server Actions for Mutations

All data mutations go through server actions:

```tsx
// Client component calling server action
import { createTask } from "@/app/(dashboard)/tasks/actions"

async function handleSubmit(formData: FormData) {
  const result = await createTask(formData)
  
  if (result.error) {
    // Handle error
  } else {
    // Success
  }
}
```

Pattern: Server actions return `{ error, success, message? }` objects.

## State Patterns by Use Case

### Form State

```tsx
"use client"

import { useState } from "react"

export function TaskForm() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("medium")
  
  return (
    <form>
      <Input 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Select value={priority} onValueChange={setPriority}>
        {/* options */}
      </Select>
    </form>
  )
}
```

Pattern: One `useState` per form field for controlled inputs.

### Filter State

```tsx
"use client"

import { useState } from "react"

export function TaskList({ tasks }) {
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  
  const filteredTasks = tasks.filter(task => {
    if (statusFilter !== "all" && task.status !== statusFilter) return false
    if (priorityFilter !== "all" && task.priority !== priorityFilter) return false
    return true
  })
  
  return (/* ... */)
}
```

Pattern: Derive filtered data from state and props.

### Drag and Drop State

```tsx
"use client"

import { useState } from "react"

export function KanbanBoard({ initialData }) {
  const [columns, setColumns] = useState(initialData)
  
  // Update columns optimistically
  const handleDragEnd = (result) => {
    // ... calculate new state
    setColumns(newColumns)
    // ... then sync with server
  }
  
  return (/* ... */)
}
```

Pattern: Keep draggable state in component, sync with server after drag.

### Dialog/Modal State

```tsx
"use client"

import { useState } from "react"
import { Dialog } from "@/components/ui/dialog"

export function TaskActions() {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  
  return (
    <>
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        {/* Edit form */}
      </Dialog>
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        {/* Delete confirmation */}
      </Dialog>
    </>
  )
}
```

Pattern: Boolean state per dialog/modal.

## Server-First Data Flow

```
┌─────────────────────────────────────────────┐
│ Server Component (async)                    │
│ - Fetches data directly from database      │
│ - Passes data as props to client component │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ Client Component ("use client")             │
│ - Receives data via props                   │
│ - Manages local UI state (useState)         │
│ - Handles user interactions                 │
│ - Calls server actions for mutations        │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ Server Action ("use server")                │
│ - Validates input                           │
│ - Mutates database via Prisma               │
│ - Calls revalidatePath()                    │
│ - Returns { error, success, message? }      │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ Next.js Cache Revalidation                  │
│ - Refetches data in server components       │
│ - Updates UI automatically                  │
└─────────────────────────────────────────────┘
```

## Real-World Examples

### Dashboard Page Flow

```tsx
// Server component fetches stats
// app/(dashboard)/page.tsx
export default async function DashboardPage() {
  const stats = await getTeamStats()
  const tasks = await getAllTasks()
  
  const chartData = [
    { month: "Jan", total: 12, completed: 8 },
    { month: "Feb", total: 15, completed: 11 },
    // ...
  ]
  
  return (
    <div className="p-8 space-y-8">
      <TeamStats stats={stats} />
      <TaskOverview tasks={tasks} />
      <DashboardCharts data={chartData} />
    </div>
  )
}
```

### Kanban Board with Optimistic Updates

```tsx
// components/kanban-board.tsx
"use client"

import { useState, useTransition } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { updateTaskStatus } from "@/app/(dashboard)/tasks/actions"

export function KanbanBoard({ initialData }) {
  const [columns, setColumns] = useState(initialData)
  const [isPending, startTransition] = useTransition()

  const onDragEnd = (result) => {
    // 1. Optimistically update local state
    const newColumns = calculateNewColumns(result, columns)
    setColumns(newColumns)
    
    // 2. Sync with server in background
    startTransition(async () => {
      await updateTaskStatus(taskId, newStatus)
    })
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {/* Kanban board UI */}
    </DragDropContext>
  )
}
```

### Task Form with Validation

```tsx
"use client"

import { useState } from "react"
import { createTask } from "@/app/(dashboard)/tasks/actions"

export function CreateTaskForm() {
  const [title, setTitle] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    const result = await createTask(formData)
    
    if (result.error) {
      setError(result.error)
    } else {
      setTitle("") // Reset form
    }
    
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isSubmitting}
      />
      {error && <p className="text-destructive">{error}</p>}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Task"}
      </Button>
    </form>
  )
}
```

## Constraints

1. **No global state libraries**: No Redux, Zustand, MobX, or similar
2. **Server components can't use hooks**: Only client components use useState/useEffect
3. **Client components need "use client"**: Must mark client components explicitly
4. **Server actions for mutations**: Never mutate data from client directly
5. **Props for data flow**: Pass data from server to client via props
6. **Optimistic UI via local state**: Update local state before server confirmation
7. **useTransition for async updates**: Wrap server actions in startTransition
8. **revalidatePath triggers refetch**: Server-side cache invalidation refetches data

## Tools and Patterns

- **useState**: Local component state
- **useEffect**: Side effects and client-side data fetching
- **useTransition**: Non-blocking state transitions
- **Server Actions**: Data mutations
- **revalidatePath**: Cache revalidation
- **Props**: Data flow from server to client
- **Optimistic Updates**: Update UI before server confirms
