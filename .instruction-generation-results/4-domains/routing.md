# Routing Domain Implementation

## App Router Structure

The application uses Next.js 15 App Router with a clear folder-based routing structure:

```
app/
├── layout.tsx                 # Root layout
├── login/
│   ├── page.tsx              # Login page
│   └── actions.ts            # Login server actions
├── signup/
│   ├── page.tsx              # Signup page
│   └── actions.ts            # Signup server actions
└── (dashboard)/              # Route group for authenticated pages
    ├── layout.tsx            # Dashboard layout with auth protection
    ├── page.tsx              # Dashboard home
    ├── tasks/
    │   ├── page.tsx          # Tasks list
    │   ├── actions.ts        # Task server actions
    │   └── new/
    │       └── page.tsx      # Create task
    ├── board/
    │   └── page.tsx          # Kanban board
    └── team/
        └── page.tsx          # Team overview
```

## Route Groups

Protected routes are organized under the `(dashboard)` route group with shared authentication:

```typescript
// app/(dashboard)/layout.tsx
import { getCurrentUser } from "@/app/login/actions";
import { redirect } from "next/navigation";

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
                {children}
            </main>
        </div>
    );
}
```

## Authentication Protection

Server-side authentication checks happen at the layout level using `getCurrentUser()`:

```typescript
// Example from dashboard layout
const user = await getCurrentUser();
if (!user) redirect("/login");
```

The authentication function pattern:
```typescript
// app/login/actions.ts
export async function getCurrentUser() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    if (!sessionToken) return null;

    const session = await prisma.session.findUnique({
        where: { token: sessionToken },
        include: { user: true },
    });

    return session?.user || null;
}
```

## Navigation Implementation

Client-side navigation uses Next.js Link component with active state tracking:

```typescript
// components/sidebar.tsx
import Link from "next/link"
import { usePathname } from "next/navigation"

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  // ... more items
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <nav className="space-y-2">
      {sidebarNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === item.href ? "bg-accent" : "transparent"
          )}
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
```

## Page Component Patterns

**Server Component Pages** (for data fetching):
```typescript
// app/(dashboard)/tasks/page.tsx
import { getAllTasks } from "./actions"
import { TasksPageClient } from "@/components/tasks-page-client"

export default async function TasksPage() {
  const tasks = await getAllTasks()
  return <TasksPageClient initialTasks={tasks} />
}
```

**Client Component Pages** (for interactivity):
```typescript
// app/(dashboard)/board/page.tsx
"use client"

import { KanbanBoard } from "@/components/kanban-board"

export default function BoardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Board</h1>
      <KanbanBoard />
    </div>
  )
}
```

## Route-Based File Organization

Each route maintains its server actions in co-located `actions.ts` files:

```typescript
// app/(dashboard)/tasks/actions.ts
"use server";

export async function createTask(formData: FormData) {
  // Implementation
}

export async function getAllTasks() {
  // Implementation
}

export async function deleteTask(taskId: number) {
  // Implementation
}
```

This pattern keeps route-specific logic close to the pages that use it while maintaining clear separation of concerns.