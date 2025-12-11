# Routing Domain

## Overview

The routing domain uses **Next.js 15 App Router** with file-based routing. Server components are the default, and client interactivity requires explicit "use client" directives. Route groups organize layouts without affecting URLs.

## Required Patterns

### 1. App Directory Structure

All routes are defined in the `app/` directory:

```
app/
├── layout.tsx              # Root layout
├── (dashboard)/            # Route group
│   ├── layout.tsx          # Dashboard layout
│   ├── page.tsx            # Dashboard page (/)
│   ├── tasks/
│   │   ├── page.tsx        # Tasks page (/tasks)
│   │   ├── actions.ts      # Server actions for tasks
│   │   └── new/
│   │       └── page.tsx    # New task page (/tasks/new)
│   ├── board/
│   │   └── page.tsx        # Board page (/board)
│   └── team/
│       └── page.tsx        # Team page (/team)
├── login/
│   ├── page.tsx            # Login page (/login)
│   └── actions.ts          # Login server actions
└── signup/
    ├── page.tsx            # Signup page (/signup)
    └── actions.ts          # Signup server actions
```

### 2. Route Groups

Route groups use parentheses `()` to organize layouts without affecting URLs:

```tsx
// app/(dashboard)/layout.tsx
// This layout applies to:
// - /
// - /tasks
// - /tasks/new
// - /board
// - /team

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
```

Pattern: The `(dashboard)` folder name doesn't appear in URLs, but its `layout.tsx` wraps all child routes.

### 3. Page Files

Each route must have a `page.tsx` file:

```tsx
// app/(dashboard)/page.tsx - This is the "/" route
export default async function DashboardPage() {
  const stats = await getTeamStats()
  // ... render dashboard
}
```

### 4. Root Layout

The root layout defines global HTML structure:

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaskFlow",
  description: "Task management made easy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground text-xl`}>
        {children}
      </body>
    </html>
  );
}
```

Pattern: Root layout exports `metadata` object and renders `<html>` and `<body>` tags.

### 5. Server Components by Default

Components are server components unless marked with "use client":

```tsx
// app/(dashboard)/tasks/page.tsx - Server component by default
import { getAllTasks } from "./actions"

export default async function TasksPage() {
  const tasks = await getAllTasks()
  
  return <TasksPageClient tasks={tasks} />
}
```

Pattern: Server components can use async/await directly in the component function.

### 6. Client Components

Interactive components require "use client" directive:

```tsx
// components/tasks-page-client.tsx
"use client"

import { useState } from "react"

export function TasksPageClient({ tasks }: { tasks: Task[] }) {
  const [filter, setFilter] = useState("all")
  // ... interactive logic
}
```

### 7. Nested Layouts

Layouts can nest within route groups:

```tsx
// app/(dashboard)/layout.tsx - Applies to all dashboard routes
export default async function DashboardLayout({ children }) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
```

## Navigation

### 1. Sidebar Navigation

Navigation is centralized in the Sidebar component:

```tsx
// components/sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CheckSquare, LayoutDashboard, ListTodo, Users } from "lucide-react"

const sidebarNavItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Tasks", href: "/tasks", icon: ListTodo },
  { title: "Board", href: "/board", icon: CheckSquare },
  { title: "Team", href: "/team", icon: Users },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-card border-r border-border">
      <nav className="space-y-2 p-4">
        {sidebarNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-md",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
```

Pattern: Use `usePathname()` hook to highlight active routes.

### 2. Server-Side Redirects

Redirects in server components/actions:

```tsx
// app/(dashboard)/layout.tsx
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/login/actions"

export default async function DashboardLayout({ children }) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")
  
  return (/* ... */)
}
```

```tsx
// app/login/actions.ts
"use server"

export async function login(formData: FormData) {
  // ... validation and authentication
  
  const { redirect } = await import("next/navigation");
  redirect("/");
}
```

Pattern: Use `redirect()` from "next/navigation" in server components/actions.

## Server Actions Pattern

Server actions are collocated with routes in `actions.ts` files:

```tsx
// app/(dashboard)/tasks/actions.ts
"use server"

import { revalidatePath } from "next/cache"
import { PrismaClient } from "@/app/generated/prisma"
import { getCurrentUser } from "@/app/login/actions"

const prisma = new PrismaClient()

export async function createTask(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) return { error: "Unauthorized", success: false }
  
  // ... create task
  
  revalidatePath("/tasks")
  return { error: null, success: true, message: "Task created!" }
}
```

Pattern:
1. Mark file with "use server"
2. Collocate with route in `actions.ts`
3. Export async functions
4. Use `revalidatePath()` after mutations

## Development Configuration

### Turbopack Dev Mode

Development uses Turbopack:

```json
// package.json
{
  "scripts": {
    "dev": "next dev --turbopack",
  }
}
```

### Next.js Config

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
```

Pattern: Enable experimental server actions features in config.

## Constraints

1. **No /api directory**: This project uses server actions instead of API routes
2. **Route groups don't affect URLs**: `(dashboard)` folder doesn't appear in paths
3. **One page.tsx per route**: Only one page file per route segment
4. **Layouts nest automatically**: Child layouts inherit parent layouts
5. **Server components by default**: Client interactivity requires "use client"
6. **Metadata only in layouts**: Only layouts can export metadata
7. **Root layout is required**: Must have app/layout.tsx with html/body
8. **actions.ts collocated**: Server actions live next to their routes
9. **revalidatePath required**: Must revalidate after mutations
10. **Turbopack for dev**: Development uses `next dev --turbopack`

## Route Structure

### Dashboard Routes (Protected)

All routes in `(dashboard)` require authentication:

- `/` - Dashboard page with charts
- `/tasks` - Task list page
- `/tasks/new` - Create new task page
- `/board` - Kanban board view
- `/team` - Team statistics page

### Public Routes

- `/login` - Login page
- `/signup` - Signup page

## Real-World Examples

### Protected Route Pattern

```tsx
// app/(dashboard)/layout.tsx
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/login/actions"
import { Sidebar } from "@/components/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
```

### Data Fetching in Server Component

```tsx
// app/(dashboard)/page.tsx
import { getTeamStats } from "./tasks/actions"
import { DashboardCharts } from "@/components/dashboard-charts"
import { TeamStats } from "@/components/team-stats"

export default async function DashboardPage() {
  const stats = await getTeamStats()
  
  return (
    <div className="p-8">
      <TeamStats stats={stats} />
      <DashboardCharts data={chartData} />
    </div>
  )
}
```

### Client Component Wrapper Pattern

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

export function TasksPageClient({ tasks }: { tasks: Task[] }) {
  const [filter, setFilter] = useState("all")
  // ... client-side interactivity
}
```

Pattern: Server component fetches data, passes to client component for interactivity.

## Tools and Technologies

- **Next.js 15.5.7**: App Router framework
- **Turbopack**: Development bundler
- **File-based routing**: Automatic route generation
- **Route groups**: Layout organization
- **Server components**: Default rendering strategy
- **Server actions**: Form handling and mutations
