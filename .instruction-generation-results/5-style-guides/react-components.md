# React Components Style Guide

## Unique Patterns in TaskFlow

### Client Component Header Convention
All interactive components start with this pattern:

```typescript
"use client"

import { useOptimistic, useTransition, useState, useEffect } from "react"
import { ComponentName } from "@/components/ui/component-name"
import { actionName } from "@/app/(dashboard)/actions"
import { poppins } from "@/lib/fonts"
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"
```

### Type Definition Pattern
Components define extended types inline:

```typescript
type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

export function ComponentName({ initialTasks }: { initialTasks: TaskWithProfile[] }) {
```

### Optimistic Updates Pattern
Interactive components use a specific optimistic update structure:

```typescript
const [optimisticData, setOptimisticData] = useOptimistic(
  initialData,
  (state, { action, item }: { action: "delete" | "toggle" | "update"; item: DataType }) => {
    if (action === "delete") {
      return state.filter((t) => t.id !== item.id)
    }
    if (action === "toggle") {
      return state.map((t) => 
        t.id === item.id 
          ? { ...t, status: t.status === "done" ? "todo" : "done" }
          : t
      )
    }
    return state
  }
)

const [isPending, startTransition] = useTransition()
```

### Handler Function Pattern
Event handlers follow this optimistic + server action pattern:

```typescript
const handleAction = (item: DataType) => {
  setOptimisticData({ action: "actionType", item })
  startTransition(async () => {
    await serverAction(item.id)
  })
}
```

### Poppins Font Application
Headers within components use the font class pattern:

```typescript
<h1 className={`text-2xl font-semibold ${poppins.className}`}>
  Component Title
</h1>
```

### Form Integration Pattern
Components with forms use useActionState:

```typescript
const createActionWrapper = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
  return serverAction(formData)
}

const [state, formAction] = useActionState(createActionWrapper, initialState)
```

### Conditional Rendering with Data
Components handle empty states and loading states:

```typescript
{optimisticData.length === 0 ? (
  <div className="text-center py-8">
    <p className="text-muted-foreground">No items found.</p>
  </div>
) : (
  optimisticData.map((item) => (
    <ItemComponent key={item.id} item={item} />
  ))
)}
```

### Icon Usage Pattern
Lucide icons are imported and used consistently:

```typescript
import { MoreHorizontal, Clock, Edit, Trash2 } from "lucide-react"

// Usage
<Edit className="mr-2 h-4 w-4" />
<span>Edit</span>
```

### Button Actions with State
Buttons reflect pending states:

```typescript
<Button 
  onClick={handleAction} 
  disabled={isPending}
  variant="ghost"
  className="h-8 w-8 p-0"
>
  {isPending ? <LoadingIcon /> : <ActionIcon />}
</Button>
```

### Props Interface Convention
Components explicitly type their props:

```typescript
interface ComponentProps {
  initialData: DataType[]
  onAction?: (item: DataType) => void
  className?: string
}

export function ComponentName({ initialData, onAction, className }: ComponentProps) {
```