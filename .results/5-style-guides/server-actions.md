# Server Actions Style Guide

## Unique Conventions

### 1. "use server" Directive at File Level

All server action files start with "use server":

```typescript
// app/(dashboard)/tasks/actions.ts
"use server"

import { revalidatePath } from "next/cache"
import { PrismaClient } from "@/app/generated/prisma"
```

**Why unique**: File-level directive, not per-function.

### 2. PrismaClient Instantiation Pattern

Prisma client instantiated at file level, not injected:

```typescript
const prisma = new PrismaClient()

export async function getAllTasks() {
  return await prisma.task.findMany({ /* ... */ })
}
```

**Why unique**: Each actions file creates its own instance.

### 3. FormData Parameter Pattern

Server actions receive FormData, not typed objects:

```typescript
export async function createTask(formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const priority = formData.get("priority") as string
```

**Why unique**: Uses native FormData API, not custom request objects.

### 4. Error Return Pattern

Return structured error objects, never throw:

```typescript
try {
  await prisma.task.create({ data: { /* ... */ } })
  revalidatePath("/tasks")
  return { error: null, success: true, message: "Task created!" }
} catch (e) {
  return { error: "Failed to create task.", success: false }
}
```

**Why unique**: Consistent `{ error, success, message? }` return shape.

### 5. getCurrentUser Authentication Check

Every protected action starts with auth check:

```typescript
export async function createTask(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) return { error: "Unauthorized", success: false }
  
  // ... proceed with operation
}
```

**Why unique**: Repeated pattern across all protected actions.

### 6. revalidatePath After Mutations

Always call revalidatePath after data changes:

```typescript
await prisma.task.create({ data: { /* ... */ } })
revalidatePath("/tasks")
return { error: null, success: true }
```

**Why unique**: Cache invalidation is required after every mutation.

### 7. Field Name Mapping

Form fields may differ from database fields:

```typescript
export async function createTask(formData: FormData) {
  const title = formData.get("title") as string  // Form uses "title"
  
  await prisma.task.create({
    data: {
      name: title,  // Database uses "name"
    }
  })
}
```

**Why unique**: Explicit mapping between form and database field names.

### 8. Prisma Include Pattern

Related data fetched with `include` and `select`:

```typescript
const tasks = await prisma.task.findMany({
  include: {
    assignee: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
    creator: {
      select: {
        id: true,
        name: true,
      },
    },
  },
  orderBy: { createdAt: "desc" },
})
```

**Why unique**: Consistent use of `include` with nested `select` for shaping data.

## File Organization

Server actions are collocated with routes:

```
app/
├── login/
│   └── actions.ts          # Login/logout/getCurrentUser
├── signup/
│   └── actions.ts          # Signup actions
└── (dashboard)/
    └── tasks/
        └── actions.ts      # Task CRUD + stats
```

## Key Takeaways

1. Always start file with "use server"
2. Instantiate PrismaClient at file level
3. Accept FormData parameter for form submissions
4. Return `{ error, success, message? }` objects
5. Check authentication with `getCurrentUser()` first
6. Call `revalidatePath()` after mutations
7. Map form field names to database field names explicitly
8. Use Prisma `include` with `select` to shape related data
9. Never throw errors - always return error objects
10. Collocate actions with their related routes
