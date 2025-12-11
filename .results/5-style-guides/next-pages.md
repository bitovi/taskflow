# Next Pages Style Guide

## Unique Conventions

### 1. Route Group Pattern for Layouts

Protected routes use `(dashboard)` route group to share authentication layout:

```tsx
// app/(dashboard)/layout.tsx
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

**Why unique**: Route group name `(dashboard)` doesn't appear in URL but applies layout to all child routes.

### 2. Async Server Components for Data Fetching

Pages fetch data directly using async/await:

```tsx
// app/(dashboard)/page.tsx
export default async function DashboardPage() {
  const stats = await getTeamStats()
  const tasks = await getAllTasks()
  
  return <div>{/* render with data */}</div>
}
```

**Why unique**: No useEffect or client-side data fetching - server components fetch directly.

### 3. Server Component + Client Wrapper Pattern

Pages fetch data server-side, pass to client components for interactivity:

```tsx
// app/(dashboard)/tasks/page.tsx
import { getAllTasks } from "./actions"
import { TasksPageClient } from "@/components/tasks-page-client"

export default async function TasksPage() {
  const tasks = await getAllTasks()
  return <TasksPageClient tasks={tasks} />
}
```

**Why unique**: Clear separation: server fetches, client handles interaction.

### 4. Authentication Check in Layout

Auth check happens in layout, not individual pages:

```tsx
// app/(dashboard)/layout.tsx
const user = await getCurrentUser()
if (!user) redirect("/login")
```

**Why unique**: Single auth check protects all dashboard routes.

### 5. Root Layout Font Application

Fonts applied in root layout via className:

```tsx
// app/layout.tsx
const inter = Inter({ subsets: ["latin"] })

<body className={`${inter.className} bg-background text-foreground text-xl`}>
```

**Why unique**: Uses Next.js font optimization with className string interpolation.

## File Structure Pattern

```
app/
├── layout.tsx              # Root layout with metadata
├── globals.css             # Global styles
├── login/
│   ├── page.tsx           # Public route
│   └── actions.ts         # Collocated server actions
├── signup/
│   ├── page.tsx
│   └── actions.ts
└── (dashboard)/           # Protected route group
    ├── layout.tsx         # Auth-protected layout
    ├── page.tsx           # Dashboard home
    ├── tasks/
    │   ├── page.tsx
    │   ├── actions.ts
    │   └── new/
    │       └── page.tsx
    ├── board/page.tsx
    └── team/page.tsx
```

## Metadata Export

Root layout exports metadata object:

```tsx
export const metadata: Metadata = {
  title: "TaskFlow",
  description: "Task management made easy",
}
```

## Key Takeaways

1. Use route groups `()` for shared layouts without URL segments
2. Server components are async and fetch data directly
3. Pass data from server to client components via props
4. Protect routes in layout, not individual pages
5. Apply fonts in root layout using Next.js font optimization
6. Collocate server actions with routes in `actions.ts` files
7. Export metadata only from layouts
