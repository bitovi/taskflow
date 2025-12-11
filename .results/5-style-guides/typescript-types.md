# TypeScript Types Style Guide

## Unique Conventions

### 1. Extend Prisma Generated Types

Types extend Prisma models with includes:

```tsx
import { Task, User } from "@/app/generated/prisma/client"

export type TaskWithRelations = Task & {
  assignee: User | null
  creator: User | null
}
```

**Why unique**: Prisma types from custom output directory, augmented with relations.

### 2. Kanban Data Structure

Nested structure for drag-and-drop state:

```tsx
export type KanbanTask = Task & {
  assignee: User | null
  creator: User | null
}

export type KanbanColumn = {
  id: string
  title: string
  tasks: KanbanTask[]
}

export type KanbanData = {
  columns: KanbanColumn[]
}
```

**Why unique**: Specific nested structure for Kanban board state management.

### 3. Prisma Import from Generated Directory

All Prisma types from custom output:

```tsx
import { Task, User } from "@/app/generated/prisma/client"
```

**Why unique**: Prisma client generated to `app/generated/prisma` (not default).

## File Structure

Types in `lib/`:

```
lib/
└── types.ts
```

## Key Takeaways

1. Import Prisma types from `@/app/generated/prisma/client`
2. Extend Prisma types with relations using intersection (`&`)
3. Define nested structures for complex UI state (e.g., Kanban)
4. Locate type definitions in `lib/` directory
