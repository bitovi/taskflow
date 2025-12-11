# React Components - Feature Style Guide

## Unique Conventions

### 1. "use client" Directive for Interactive Components

All interactive feature components marked with "use client":

```tsx
// components/kanban-board.tsx
"use client"

import { useState, useTransition } from "react"
```

**Why unique**: Explicit client boundary for interactivity.

### 2. Server Data via Props Pattern

Components receive server-fetched data as props:

```tsx
export function TasksPageClient({ tasks }: { tasks: Task[] }) {
  const [filter, setFilter] = useState("all")
  // ... use tasks prop
}
```

**Why unique**: Never fetch data in feature components - receive via props.

### 3. Poppins Font for Titles

Headings and titles use Poppins font:

```tsx
import { poppins } from "@/lib/fonts"

<h4 className={`font-medium text-sm ${poppins.className}`}>
  {task.name}
</h4>
```

**Why unique**: Consistent font application for emphasis.

### 4. Optimistic Updates with useTransition

State updates optimistically before server confirmation:

```tsx
const [columns, setColumns] = useState(initialData)
const [isPending, startTransition] = useTransition()

const handleUpdate = () => {
  // 1. Update local state
  setColumns(newColumns)
  
  // 2. Sync with server
  startTransition(async () => {
    await updateTaskStatus(id, status)
  })
}
```

**Why unique**: Consistent optimistic update pattern across features.

### 5. Icon Usage from Lucide React

All icons from `lucide-react`:

```tsx
import { CheckSquare, LayoutDashboard, ListTodo, Users, Clock, Plus } from "lucide-react"

<Clock className="h-3 w-3" />
<Plus className="h-4 w-4" />
```

**Why unique**: Single icon library, consistent sizing.

### 6. Chart Components Client-Only

Charts always client components with ResponsiveContainer:

```tsx
"use client"

import { Bar, BarChart, ResponsiveContainer } from "recharts"

<ResponsiveContainer width="100%" height={350}>
  <BarChart data={data}>
```

**Why unique**: Charts don't support SSR, always wrapped in ResponsiveContainer.

### 7. Drag and Drop Pattern

DnD uses @hello-pangea/dnd with optimistic updates:

```tsx
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

<DragDropContext onDragEnd={onDragEnd}>
  <Droppable droppableId="column-id">
    {(provided, snapshot) => (
      <div ref={provided.innerRef} {...provided.droppableProps}>
        {provided.placeholder}
      </div>
    )}
  </Droppable>
</DragDropContext>
```

**Why unique**: Consistent DnD pattern with optimistic state updates.

## Component Organization

Feature components in `components/`:

```
components/
├── auth-dropdown.tsx       # Auth UI
├── create-task-form.tsx    # Form components
├── edit-task-form.tsx
├── task-form.tsx
├── dashboard-charts.tsx    # Data visualization
├── kanban-board.tsx        # Drag and drop
├── sidebar.tsx             # Navigation
├── task-list.tsx           # List views
├── task-overview.tsx
├── tasks-page-client.tsx   # Page wrappers
├── team-stats.tsx          # Statistics display
└── ui/                     # UI primitives
```

## Key Takeaways

1. Mark interactive components with "use client"
2. Receive server data via props, don't fetch in component
3. Use Poppins font for headings and titles
4. Implement optimistic updates with `useTransition`
5. Use Lucide React for all icons
6. Charts are client-only, always use ResponsiveContainer
7. DnD uses @hello-pangea/dnd with optimistic updates
8. Locate in `components/` directory (not `components/ui/`)
