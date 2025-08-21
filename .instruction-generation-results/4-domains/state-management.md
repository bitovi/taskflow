# State Management Domain Implementation

## Server Components for Initial Data

The application relies on Server Components for initial data loading, passing data down as props:

```typescript
// app/(dashboard)/tasks/page.tsx
import { getAllTasks } from "./actions"
import { TasksPageClient } from "@/components/tasks-page-client"

export default async function TasksPage() {
  const tasks = await getAllTasks()
  return <TasksPageClient initialTasks={tasks} />
}
```

Client components receive this server-fetched data:

```typescript
// components/tasks-page-client.tsx
"use client"

import { TaskList } from "@/components/task-list"
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

export function TasksPageClient({ initialTasks }: { initialTasks: TaskWithProfile[] }) {
  return (
    <div className="space-y-6">
      <TaskList initialTasks={initialTasks} />
    </div>
  )
}
```

## Optimistic Updates Pattern

For immediate UI feedback, components use the `useOptimistic` hook:

```typescript
// components/task-list.tsx
"use client"

import { useOptimistic, useTransition } from "react"
import { deleteTask, updateTaskStatus } from "@/app/(dashboard)/tasks/actions"

export function TaskList({ initialTasks }: { initialTasks: TaskWithProfile[] }) {
  const [optimisticTasks, setOptimisticTasks] = useOptimistic(
    initialTasks,
    (state, { action, task }: { action: "delete" | "toggle"; task: TaskWithProfile | { id: number } }) => {
      if (action === "delete") {
        return state.filter((t) => t.id !== task.id)
      }
      if (action === "toggle") {
        return state.map((t) => 
          t.id === task.id 
            ? { ...t, status: t.status === "done" ? "todo" : "done" }
            : t
        )
      }
      return state
    }
  )

  const [isPending, startTransition] = useTransition()

  const handleDelete = (taskId: number) => {
    setOptimisticTasks({ action: "delete", task: { id: taskId } })
    startTransition(async () => {
      await deleteTask(taskId)
    })
  }

  const handleToggle = (task: TaskWithProfile) => {
    setOptimisticTasks({ action: "toggle", task })
    startTransition(async () => {
      await updateTaskStatus(task.id, task.status !== "done")
    })
  }

  // Render optimisticTasks instead of initialTasks
}
```

## Form State Management

Forms submit directly to Server Actions with built-in validation:

```typescript
// components/create-task-form.tsx
"use client"

import { useActionState } from "react"
import { createTask } from "@/app/(dashboard)/tasks/actions"

export function CreateTaskForm() {
  const [state, formAction] = useActionState(createTask, { 
    success: false, 
    message: "" 
  })

  return (
    <form action={formAction} className="space-y-4">
      <input
        name="title"
        placeholder="Task title"
        className="w-full rounded-md border px-3 py-2"
        required
      />
      
      {state.error && (
        <div className="text-red-500 text-sm">{state.error}</div>
      )}
      
      {state.success && (
        <div className="text-green-500 text-sm">{state.message}</div>
      )}
      
      <button type="submit" disabled={state.pending}>
        {state.pending ? "Creating..." : "Create Task"}
      </button>
    </form>
  )
}
```

## Local State for UI Interactions

Local component state is used sparingly for UI-only interactions:

```typescript
// components/task-list.tsx
export function TaskList({ initialTasks }: { initialTasks: TaskWithProfile[] }) {
  const [editingTask, setEditingTask] = useState<TaskWithProfile | null>(null)
  const [showCompleted, setShowCompleted] = useState(true)

  const filteredTasks = optimisticTasks.filter(task => 
    showCompleted || task.status !== "done"
  )

  return (
    <div>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={(e) => setShowCompleted(e.target.checked)}
            className="mr-2"
          />
          Show completed tasks
        </label>
      </div>
      
      {/* Task rendering */}
    </div>
  )
}
```

## No Global State Libraries

The application deliberately avoids global state management libraries like Redux or Zustand. Instead, it relies on:

1. **Server Components** for data fetching
2. **Props drilling** for passing data down
3. **Server Actions** for mutations
4. **Optimistic updates** for immediate feedback
5. **Local state** for UI-only interactions

This approach keeps the state management simple and leverages Next.js App Router patterns effectively.

## Error State Management

Error handling is built into Server Actions and displayed in components:

```typescript
// Server Action pattern
export async function createTask(formData: FormData) {
  try {
    // ... task creation logic
    revalidatePath("/tasks")
    return { success: true, message: "Task created successfully." }
  } catch (error) {
    console.error("Error creating task:", error)
    return { error: "Failed to create task.", success: false }
  }
}

// Component usage
const [state, formAction] = useActionState(createTask, { 
  success: false, 
  message: "" 
})

// Render error/success states based on returned state
```