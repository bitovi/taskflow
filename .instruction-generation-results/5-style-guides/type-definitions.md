# Type Definitions Style Guide

## Unique Patterns in TaskFlow

### Prisma Type Extensions
Custom types extend Prisma-generated types with relationship data:

```typescript
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};
```

### Kanban-Specific Types
Domain-specific types use literal union types for status values:

```typescript
export type KanbanColumn = {
  id: "todo" | "in_progress" | "review" | "done"
  title: string
  tasks: TaskWithProfile[]
}

export type KanbanData = {
  [key in "todo" | "in_progress" | "review" | "done"]: KanbanColumn
}
```

### Relationship Type Picking
Types use `Pick` utility to select specific fields from related models:

```typescript
// Only include name from User relation
assignee?: Pick<User, "name"> | null;
```

### Status Literal Types
Status and priority values are defined as strict literal unions:

```typescript
id: "todo" | "in_progress" | "review" | "done"
```

### Export Convention
All types are exported as named type exports:

```typescript
export type TypeName = {
  // type definition
}
```

### File Organization
Types are centralized in `lib/types.ts` rather than co-located with components.

### Nullable Relationship Pattern
Related data uses optional and nullable patterns:

```typescript
assignee?: Pick<User, "name"> | null;
```

This pattern acknowledges that:
1. The relationship might not be loaded (`?` optional)
2. The relationship might not exist (`| null`)
3. Only specific fields are needed (`Pick<User, "name">`)

### Mapped Type Usage
Complex type mappings use TypeScript's mapped types:

```typescript
export type KanbanData = {
  [key in "todo" | "in_progress" | "review" | "done"]: KanbanColumn
}
```

This ensures type safety while maintaining flexibility for the kanban board structure.