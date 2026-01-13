# Taskflow - GitHub Copilot Instructions

## ⚠️ CRITICAL: Running Scripts

**ALWAYS use VS Code tasks via the `run_task` tool. NEVER use `npm run` commands directly.**

When you need to run any project script (dev server, tests, linting, building, etc.):

1. ✅ Use `run_task` with the task ID from `.vscode/tasks.json`
2. ❌ DO NOT use `run_in_terminal` with `npm run` commands
3. ❌ DO NOT suggest running `npm run` commands to the user

**Examples:**

- To run tests: Use task `shell: test` (NOT `npm run test`)
- To run E2E tests: Use task `shell: test:e2e` (NOT `npm run test:e2e`)
- To start dev server: Use task `shell: dev` (NOT `npm run dev`)
- To lint: Use task `shell: lint` (NOT `npm run lint`)

Only use `npm` directly for package installation (e.g., `npm install -D package-name`).

---

## Overview

**Tech Stack**: Next.js 15 App Router, React 19, TypeScript, Prisma + PostgreSQL, Tailwind CSS 4

**Domain**: Team task management application with Kanban boards and collaboration features.

## File Categories

### Next.js Pages (`app/`)

- Route groups `(name)` for shared layouts without URL segments
- Pages are async server components that fetch data directly
- Auth checks in layout, fonts via `className` from `lib/fonts.ts`

### Server Actions (`app/*/actions.ts`)

- `"use server"` directive at file level, PrismaClient per file
- Receive `FormData`, return `{ error, success, message? }` (never throw)
- Call `getCurrentUser()` first, use `revalidatePath()` after mutations
- Prisma import: `@/app/generated/prisma/client`

### React Components - UI (`components/ui/`)

- Build on Radix UI primitives with CVA for variants
- Use `React.forwardRef` with `displayName`, support `asChild` via Radix Slot
- Use `cn()` for all className composition

### React Components - Feature (`components/`)

- Mark interactive components with `"use client"`
- Receive server-fetched data via props (never fetch in component)
- Poppins font for headings, Lucide React for icons
- Charts client-only with `ResponsiveContainer`, DnD uses `@hello-pangea/dnd`

### Utility Functions (`lib/`)

- `cn()` combines clsx + tailwind-merge
- Date parsing returns `undefined` for invalid dates
- Custom hooks for contexts with error checking

### Types (`lib/types.ts`)

- Import Prisma types from `@/app/generated/prisma/client`
- Extend Prisma types with relations using `&`

### Database (`prisma/`)

- Generate client to `app/generated/prisma`
- Binary targets: ARM64 Linux (Docker) + ARM64 macOS
- Named relations for self-referencing (`"AssignedTasks"`, `"CreatedTasks"`)
- Hash passwords with bcryptjs in seed data

### Tests

- **Unit** (`tests/unit/*.test.tsx`): Jest + Testing Library, mock server actions with `jest.mock`
- **E2E** (`tests/e2e/*.spec.ts`): Playwright with global setup/teardown for server

---

## Feature Scaffold Guide

### Adding a New Feature Component

**Example**: Create a "Priority Badge" component

1. **Determine file types needed**:

   - UI primitive: `components/ui/priority-badge.tsx`
   - Feature usage: Import in task components
   - Types (if needed): Add to `lib/types.ts`

2. **Create UI primitive**:

```tsx
// components/ui/priority-badge.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      priority: {
        low: "bg-green-100 text-green-800",
        medium: "bg-yellow-100 text-yellow-800",
        high: "bg-red-100 text-red-800",
      },
    },
    defaultVariants: {
      priority: "medium",
    },
  }
);

export interface PriorityBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const PriorityBadge = React.forwardRef<HTMLSpanElement, PriorityBadgeProps>(
  ({ className, priority, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ priority, className }))}
        {...props}
      />
    );
  }
);
PriorityBadge.displayName = "PriorityBadge";

export { PriorityBadge, badgeVariants };
```

3. **Use in feature component**:

```tsx
// components/task-list.tsx
import { PriorityBadge } from "@/components/ui/priority-badge";

<PriorityBadge priority={task.priority as "low" | "medium" | "high"}>
  {task.priority}
</PriorityBadge>;
```

### Adding a New Page with Data Fetching

**Example**: Create a "Reports" page

1. **Create route structure**:

```
app/(dashboard)/reports/
├── page.tsx          # Server component
├── actions.ts        # Server actions
└── _components/      # Private components
    └── reports-client.tsx
```

2. **Server page fetches data**:

```tsx
// app/(dashboard)/reports/page.tsx
import { PrismaClient } from "@/app/generated/prisma/client";
import { getCurrentUser } from "@/app/login/actions";
import { redirect } from "next/navigation";
import { ReportsClient } from "./_components/reports-client";

const prisma = new PrismaClient();

export default async function ReportsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const reports = await prisma.task.groupBy({
    by: ["status"],
    _count: { id: true },
  });

  return <ReportsClient reports={reports} />;
}
```

3. **Client component for interactivity**:

```tsx
// app/(dashboard)/reports/_components/reports-client.tsx
"use client";

import { useState } from "react";
import { BarChart, Bar, ResponsiveContainer } from "recharts";

export function ReportsClient({ reports }) {
  const [filter, setFilter] = useState("all");
  // ... interactive logic
}
```

4. **Server actions for mutations**:

```tsx
// app/(dashboard)/reports/actions.ts
"use server";

import { PrismaClient } from "@/app/generated/prisma/client";
import { getCurrentUser } from "@/app/login/actions";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function generateReport(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Unauthorized" };

  const type = formData.get("type") as string;

  // ... report generation logic

  revalidatePath("/reports");
  return { success: "Report generated successfully" };
}
```

### Adding Database Model and CRUD

**Example**: Add "Project" model

1. **Update Prisma schema**:

```prisma
// prisma/schema.prisma
model Project {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  createdAt   DateTime @default(now())
  ownerId     Int
  owner       User     @relation(fields: [ownerId], references: [id])
  tasks       Task[]
}

// Update Task model
model Task {
  // ... existing fields
  projectId   Int?
  project     Project? @relation(fields: [projectId], references: [id])
}
```

2. **Run migration**:

```bash
npm run db:setup
```

3. **Create type definitions**:

```tsx
// lib/types.ts
import { Project, User, Task } from "@/app/generated/prisma/client";

export type ProjectWithRelations = Project & {
  owner: User;
  tasks: Task[];
};
```

4. **Create server actions**:

```tsx
// app/(dashboard)/projects/actions.ts
"use server";

import { PrismaClient } from "@/app/generated/prisma/client";
import { getCurrentUser } from "@/app/login/actions";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function createProject(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  await prisma.project.create({
    data: {
      name,
      description,
      ownerId: user.id,
    },
  });

  revalidatePath("/projects");
  return { success: "Project created" };
}

export async function deleteProject(projectId: number) {
  const user = await getCurrentUser();
  if (!user) return { error: "Unauthorized" };

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (project?.ownerId !== user.id) {
    return { error: "Not authorized to delete this project" };
  }

  await prisma.project.delete({
    where: { id: projectId },
  });

  revalidatePath("/projects");
  return { success: "Project deleted" };
}
```

---

## Critical Rules

### UI Components

- All UI primitives use Radix UI + CVA + forwardRef with displayName
- Use `cn()` for className composition, Lucide React for icons
- Tailwind CSS 4 only (`@import "tailwindcss"`, `@theme` for tokens)

### Routing & Data

- Routes in `app/`, route groups `(name)` for layouts
- Server components default, `"use client"` for interactivity
- No `/api` routes - use server actions in `actions.ts`
- Import Prisma from `@/app/generated/prisma/client`
- Server actions: return `{ error, success, message? }`, call `revalidatePath()` after mutations

### State & Auth

- Server actions for mutations, props for data to client components
- No Redux/Zustand - use useState/useTransition
- `getCurrentUser()` required for protected actions
- Session-based auth (database sessions, not JWT)

### Forms & Testing

- FormData in server actions, controlled inputs with useState
- Jest + Testing Library for unit tests (`.test.tsx`)
- Playwright for E2E tests (`.spec.ts`), global setup/teardown for server---

## Quick Examples

### Status Filter Dropdown

```tsx
// components/ui/status-select.tsx - UI primitive with CVA
// components/task-status-filter.tsx - "use client" with useState
```

### Task Comments Feature

1. Add Comment model to `prisma/schema.prisma`, run `npm run db:setup`
2. Add CRUD actions to `app/(dashboard)/tasks/actions.ts`
3. Create `components/ui/comment-card.tsx` + `components/comment-form.tsx`
4. Add types to `lib/types.ts`, add tests

### Due Date Notifications

````tsx
// lib/date-utils.ts
export function isDueSoon(dueDate: Date): boolean {
  const diff = dueDate.getTime() - new Date().getTime()
  const hours = diff / (1000 * 60 * 60)
  return hours > 0 && hours <= 24
}

// components/ui/notification-badge.tsx - CVA badge primitive
// components/task-due-indicator.tsx - "use client" wrapper
```---

## Key Patterns

1. Prisma from `@/app/generated/prisma/client`, not `@prisma/client`
2. Route group `(dashboard)` for authenticated routes
3. `inter.className` for body, `poppins.className` for headings
4. Return error objects in server actions, never throw
5. `useTransition` for optimistic updates
6. `getCurrentUser()` + `revalidatePath()` in protected server actions
7. Mark interactive components with `"use client"`

## Common Mistakes

❌ CSS modules or styled-components → ✅ Tailwind only
❌ Fetch in client components → ✅ Server fetches, pass via props
❌ Throw in server actions → ✅ Return `{ error, success }`
❌ Skip `revalidatePath` → ✅ Always call after mutations
❌ Manual className concat → ✅ Use `cn()` utility
❌ Missing forwardRef/displayName → ✅ Required for UI components
❌ API routes `/api` → ✅ Server actions only
````
