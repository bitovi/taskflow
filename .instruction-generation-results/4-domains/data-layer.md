# Data Layer Domain Implementation

## Prisma ORM Integration

The application uses Prisma ORM with SQLite database and generates the client to `app/generated/prisma`:

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  output   = "../app/generated/prisma"
}

datasource db {
  provider = "sqlite"
  url      = "file:app.db"
}
```

## Database Schema

Three main models with clear relationships:

```prisma
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

## Server Actions Pattern

All data mutations use Next.js Server Actions with the "use server" directive:

```typescript
// app/(dashboard)/tasks/actions.ts
"use server";

import { getCurrentUser } from "@/app/login/actions";
import { PrismaClient } from "@/app/generated/prisma";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function createTask(formData: FormData) {
    const name = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;
    const status = formData.get("status") as string;
    const dueDate = formData.get("dueDate") as string;
    const assigneeIdRaw = formData.get("assigneeId") as string;
    const assigneeId = assigneeIdRaw ? parseInt(assigneeIdRaw, 10) : null;

    const user = await getCurrentUser();
    if (!user) return { error: "Not authenticated.", success: false };

    const creatorId = user.id;

    if (!name) return { error: "Title is required.", success: false };

    try {
        await prisma.task.create({
            data: {
                name,
                description,
                priority,
                status,
                creatorId,
                assigneeId,
                dueDate: dueDate ? parseDateString(dueDate) : null,
            },
        });

        revalidatePath("/tasks");
        return { success: true, message: "Task created successfully." };
    } catch (error) {
        console.error("Error creating task:", error);
        return { error: "Failed to create task.", success: false };
    }
}
```

## Data Fetching in Server Components

Server Components handle initial data loading with Prisma queries:

```typescript
export async function getAllTasks() {
    const user = await getCurrentUser();
    if (!user) return [];

    try {
        const tasks = await prisma.task.findMany({
            include: {
                assignee: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return tasks;
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return [];
    }
}
```

## Type Safety with Generated Types

The application uses Prisma-generated types with custom extensions:

```typescript
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};
```

## Database Scripts

Database management uses Node.js scripts for seeding and clearing:

```javascript
// prisma/seed.js
const { PrismaClient } = require("../app/generated/prisma");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Create test users
  const hashedPassword = await bcrypt.hash("password123", 10);
  
  const alice = await prisma.user.create({
    data: {
      email: "alice@example.com",
      password: hashedPassword,
      name: "Alice Johnson",
    },
  });

  // Create sample tasks
  await prisma.task.createMany({
    data: [
      {
        name: "Design landing page",
        description: "Create a responsive landing page design",
        priority: "high",
        status: "in_progress",
        creatorId: alice.id,
        assigneeId: alice.id,
      },
      // ... more tasks
    ],
  });
}
```

## Cache Management

Server Actions include `revalidatePath` calls to update cached data:

```typescript
export async function updateTaskStatus(taskId: number, completed: boolean) {
    const newStatus = completed ? "done" : "todo";
    
    try {
        await prisma.task.update({
            where: { id: taskId },
            data: { status: newStatus },
        });

        revalidatePath("/tasks");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to update task" };
    }
}
```

This pattern ensures that cached data is invalidated after mutations, keeping the UI in sync with the database.