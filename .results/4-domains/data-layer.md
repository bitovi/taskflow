# Data Layer Domain

## Overview

The data layer uses **Prisma ORM 6.13.0** with PostgreSQL database. All database operations go through server actions marked with "use server". Cache revalidation after mutations uses `revalidatePath()`.

## Required Patterns

### 1. Prisma Client Instantiation

Prisma client is instantiated in each server action file:

```typescript
// app/(dashboard)/tasks/actions.ts
"use server"

import { PrismaClient } from "@/app/generated/prisma"

const prisma = new PrismaClient()
```

Pattern: Import from generated client at `@/app/generated/prisma`.

### 2. Server Actions for Data Operations

All database operations happen in server actions:

```typescript
// app/(dashboard)/tasks/actions.ts
"use server"

import { revalidatePath } from "next/cache"
import { PrismaClient } from "@/app/generated/prisma"
import { getCurrentUser } from "@/app/login/actions"

const prisma = new PrismaClient()

export async function createTask(formData: FormData) {
    const user = await getCurrentUser()
    if (!user) return { error: "Unauthorized", success: false }

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const priority = formData.get("priority") as string
    const status = formData.get("status") as string
    const dueDate = formData.get("dueDate") as string
    const assigneeId = formData.get("assigneeId") as string

    if (!title) return { error: "Title is required.", success: false }

    try {
        await prisma.task.create({
            data: {
                name: title,
                description,
                priority,
                status,
                dueDate: dueDate ? parseDateString(dueDate) : null,
                assigneeId: assigneeId ? parseInt(assigneeId) : null,
                creatorId: user.id,
            },
        })
        revalidatePath("/tasks")
        return { error: null, success: true, message: "Task created successfully!" }
    } catch (e) {
        return { error: "Failed to create task.", success: false }
    }
}
```

### 3. Prisma Includes for Relations

Use `include` to fetch related data:

```typescript
// app/(dashboard)/tasks/actions.ts
export async function getAllTasks() {
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
        orderBy: {
            createdAt: "desc",
        },
    })
    return tasks
}
```

Pattern: Use `include` with `select` to shape related data.

### 4. Error Handling Pattern

Return objects with `{ error, success, message? }` structure:

```typescript
export async function deleteTask(taskId: number) {
    try {
        await prisma.task.delete({
            where: { id: taskId },
        })
        revalidatePath("/tasks")
        return { error: null, success: true, message: "Task deleted successfully!" }
    } catch (e) {
        return { error: "Failed to delete task.", success: false }
    }
}
```

Pattern: 
- Success: `{ error: null, success: true, message: "..." }`
- Failure: `{ error: "...", success: false }`

### 5. Cache Revalidation

Call `revalidatePath()` after mutations:

```typescript
import { revalidatePath } from "next/cache"

export async function updateTaskStatus(taskId: number, status: string) {
    try {
        await prisma.task.update({
            where: { id: taskId },
            data: { status },
        })
        revalidatePath("/tasks")
        return { error: null, success: true }
    } catch (e) {
        return { error: "Failed to update task status.", success: false }
    }
}
```

Pattern: Always call `revalidatePath()` after create, update, or delete operations.

### 6. Authentication Check

Verify user authentication before operations:

```typescript
import { getCurrentUser } from "@/app/login/actions"

export async function createTask(formData: FormData) {
    const user = await getCurrentUser()
    if (!user) return { error: "Unauthorized", success: false }
    
    // ... proceed with operation
}
```

Pattern: Call `getCurrentUser()` first and return error if null.

## Database Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  output   = "../app/generated/prisma"
  engineType = "binary"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            Int @id @default(autoincrement())
  email         String @unique
  password      String
  name          String
  sessions      Session[]
  createdTasks  Task[] @relation("CreatedTasks")
  assignedTasks Task[] @relation("AssignedTasks")
}

model Session {
  id        Int      @id @default(autoincrement())
  token     String   @unique
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
}

model Task {
  id          Int      @id @default(autoincrement())
  name        String
  description String
  priority    String
  status      String
  dueDate     DateTime?
  assigneeId  Int?
  assignee    User?    @relation("AssignedTasks", fields: [assigneeId], references: [id])
  creatorId   Int
  creator     User     @relation("CreatedTasks", fields: [creatorId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Relations

- **User → Task (createdTasks)**: One-to-many, user creates many tasks
- **User → Task (assignedTasks)**: One-to-many, user assigned to many tasks
- **User → Session**: One-to-many, user has many sessions

## CRUD Operations

### Create

```typescript
export async function createTask(formData: FormData) {
    const user = await getCurrentUser()
    if (!user) return { error: "Unauthorized", success: false }

    const title = formData.get("title") as string
    if (!title) return { error: "Title is required.", success: false }

    try {
        await prisma.task.create({
            data: {
                name: title,
                description: formData.get("description") as string,
                priority: formData.get("priority") as string,
                status: formData.get("status") as string,
                dueDate: formData.get("dueDate") ? parseDateString(formData.get("dueDate") as string) : null,
                assigneeId: formData.get("assigneeId") ? parseInt(formData.get("assigneeId") as string) : null,
                creatorId: user.id,
            },
        })
        revalidatePath("/tasks")
        return { error: null, success: true, message: "Task created successfully!" }
    } catch (e) {
        return { error: "Failed to create task.", success: false }
    }
}
```

### Read

```typescript
export async function getAllTasks() {
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
        orderBy: {
            createdAt: "desc",
        },
    })
    return tasks
}
```

### Update

```typescript
export async function updateTask(taskId: number, formData: FormData) {
    const name = formData.get("title") as string
    const description = formData.get("description") as string
    const priority = formData.get("priority") as string
    const status = formData.get("status") as string
    const dueDate = formData.get("dueDate") as string
    const assigneeId = formData.get("assigneeId") ? parseInt(formData.get("assigneeId") as string) : null

    if (!name) return { error: "Title is required.", success: false }

    try {
        await prisma.task.update({
            where: { id: taskId },
            data: {
                name,
                description,
                priority,
                status,
                dueDate: dueDate ? parseDateString(dueDate) : null,
                assigneeId,
            },
        })
        revalidatePath("/tasks")
        return { error: null, success: true, message: "Task updated successfully!" }
    } catch (e) {
        return { error: "Failed to update task.", success: false }
    }
}
```

### Delete

```typescript
export async function deleteTask(taskId: number) {
    try {
        await prisma.task.delete({
            where: { id: taskId },
        })
        revalidatePath("/tasks")
        return { error: null, success: true, message: "Task deleted successfully!" }
    } catch (e) {
        return { error: "Failed to delete task.", success: false }
    }
}
```

### Partial Update

```typescript
export async function updateTaskStatus(taskId: number, status: string) {
    try {
        await prisma.task.update({
            where: { id: taskId },
            data: { status },
        })
        revalidatePath("/tasks")
        return { error: null, success: true }
    } catch (e) {
        return { error: "Failed to update task status.", success: false }
    }
}
```

## Complex Queries

### Aggregations

```typescript
export async function getTeamStats() {
    try {
        // Count total members
        const totalMembers = await prisma.user.count()

        // Count open tasks
        const openTasks = await prisma.task.count({
            where: {
                status: {
                    in: ["todo", "in_progress", "review"],
                },
            },
        })

        // Count completed tasks
        const tasksCompleted = await prisma.task.count({
            where: {
                status: "done",
            },
        })

        // Find top performer
        const topPerformer = await prisma.user.findFirst({
            include: {
                _count: {
                    select: {
                        assignedTasks: {
                            where: {
                                status: "done",
                            }
                        }
                    }
                }
            },
            orderBy: {
                assignedTasks: {
                    _count: "desc",
                },
            },
            where: {
                assignedTasks: {
                    some: {
                        status: "done",
                    },
                },
            },
        })

        return {
            totalMembers,
            openTasks,
            tasksCompleted,
            topPerformer: topPerformer
                ? {
                    name: topPerformer.name,
                    completedCount: topPerformer._count.assignedTasks,
                }
                : null,
            error: null,
        }
    } catch (e) {
        return {
            totalMembers: 0,
            openTasks: 0,
            tasksCompleted: 0,
            topPerformer: null,
            error: "Failed to fetch team statistics.",
        }
    }
}
```

Pattern: Use Prisma `_count` aggregations and `orderBy` for rankings.

## Server Action File Structure

```typescript
// app/(dashboard)/tasks/actions.ts
"use server"

import { revalidatePath } from "next/cache"
import { PrismaClient } from "@/app/generated/prisma"
import { getCurrentUser } from "@/app/login/actions"
import { parseDateString } from "@/lib/date-utils"

const prisma = new PrismaClient()

// CREATE
export async function createTask(formData: FormData) { /* ... */ }

// READ
export async function getAllTasks() { /* ... */ }

// UPDATE
export async function updateTask(taskId: number, formData: FormData) { /* ... */ }
export async function updateTaskStatus(taskId: number, status: string) { /* ... */ }

// DELETE
export async function deleteTask(taskId: number) { /* ... */ }

// AGGREGATE
export async function getTeamStats() { /* ... */ }
```

Pattern: Group related operations in one actions.ts file.

## Prisma Configuration

### Schema Location

Source schema: `prisma/schema.prisma`
Generated client: `app/generated/prisma`

### Generator Config

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../app/generated/prisma"
  engineType = "binary"
}
```

### Database Scripts

```json
// package.json
{
  "scripts": {
    "db:setup": "node prisma/create-db.js && npx prisma migrate deploy",
    "db:seed": "node prisma/seed.js",
    "db:reset": "npx prisma migrate reset --force",
    "db:clear": "node prisma/clear.js"
  }
}
```

## Constraints

1. **Server-only database access**: Never access Prisma from client components
2. **PrismaClient from generated path**: Always import from `@/app/generated/prisma`
3. **actions.ts location**: Collocate with routes
4. **"use server" required**: Mark all data operation files
5. **revalidatePath after mutations**: Must revalidate cache
6. **Error handling pattern**: Return `{ error, success, message? }` objects
7. **Authentication check**: Call `getCurrentUser()` before protected operations
8. **PostgreSQL only**: Schema is PostgreSQL-specific
9. **Binary engine type**: Uses binary (not library) engine
10. **No GraphQL layer**: Direct Prisma usage only

## Tools and Technologies

- **Prisma 6.13.0**: ORM for PostgreSQL
- **PostgreSQL**: Database
- **Server Actions**: Data mutation mechanism
- **revalidatePath**: Cache invalidation
- **FormData**: Form submission handling
