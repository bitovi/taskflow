# Taskflow - GitHub Copilot Instructions

## Overview

This document enables AI coding assistants to generate features aligned with the Taskflow project's architecture and style conventions. All patterns documented here are **observed from the actual codebase** - not invented best practices.

**Purpose**: Ensure AI-generated code matches existing project conventions for consistency and maintainability.

**Tech Stack**: Next.js 15 App Router, React 19, TypeScript, Prisma + PostgreSQL, Tailwind CSS 4

**Domain**: Team task management application with Kanban boards and collaboration features.

**Project Scripts**: See `package.json` for available scripts. Use corresponding task defined in `.vscode/tasks.json` to run scripts (never use `npm run <script>` directly unless there is no corresponding task).

---

## File Category Reference

### Next.js Pages (`next-pages`)

**Purpose**: Route-level page and layout components using Next.js App Router

**Location**: `app/` directory with file-based routing

**Examples**:
- `app/(dashboard)/page.tsx` - Dashboard page
- `app/layout.tsx` - Root layout

**Key Conventions**:
- Use route groups `(name)` for shared layouts without URL segments
- Pages are async server components that fetch data directly
- Apply authentication checks in layout, not individual pages
- Export metadata in root layout
- Fonts applied via className from `lib/fonts.ts`

### Server Actions (`server-actions`)

**Purpose**: Server-side data mutation and fetching functions

**Location**: `app/*/actions.ts` files collocated with routes

**Examples**:
- `app/login/actions.ts` - Authentication actions
- `app/tasks/actions.ts` - Task CRUD operations

**Key Conventions**:
- `"use server"` directive at file level
- PrismaClient instantiated in each actions file
- Functions receive `FormData` parameter
- Return `{ error, success, message? }` shape (never throw)
- Call `getCurrentUser()` first for protected actions
- Use `revalidatePath("/path")` after mutations
- Map form field names to database field names
- Use Prisma `include` with nested `select` for relations

### React Components - UI (`react-components-ui`)

**Purpose**: Reusable UI primitive components (shadcn/ui pattern)

**Location**: `components/ui/`

**Examples**:
- `components/ui/button.tsx` - Button primitive
- `components/ui/dialog.tsx` - Modal dialog

**Key Conventions**:
- Build on Radix UI primitives
- Use Class Variance Authority (CVA) for variants
- All components use `React.forwardRef` with `displayName`
- Support `asChild` prop via Radix Slot
- Extend both HTML props and VariantProps
- Use `cn()` for all className composition
- TypeScript interfaces extend native HTML element props

### React Components - Feature (`react-components-feature`)

**Purpose**: Feature-specific components with business logic

**Location**: `components/` (not `components/ui/`)

**Examples**:
- `components/kanban-board.tsx` - Drag-and-drop board
- `components/task-form.tsx` - Task creation form

**Key Conventions**:
- Mark interactive components with `"use client"`
- Receive server-fetched data via props (never fetch in component)
- Use Poppins font for headings via `className={poppins.className}`
- Implement optimistic updates with `useTransition`
- All icons from `lucide-react` library
- Charts are client-only, always wrapped in `ResponsiveContainer`
- Drag-and-drop uses `@hello-pangea/dnd` with optimistic state

### React Contexts (`react-contexts`)

**Purpose**: Client-side context providers for shared state

**Location**: `lib/`

**Examples**:
- `lib/session-context.tsx` - Session context provider

**Key Conventions**:
- Mark context provider with `"use client"`
- Receive server-fetched data via props
- Provide custom hook for context access with error checking
- Type context as `Type | null` for safety

### Utility Functions (`utility-functions`)

**Purpose**: Shared helper functions

**Location**: `lib/`

**Examples**:
- `lib/utils.ts` - `cn()` utility
- `lib/date-utils.ts` - Date helpers

**Key Conventions**:
- `cn()` combines clsx and tailwind-merge to prevent class conflicts
- Date parsing returns `undefined` for invalid dates (not throw)
- Date formatting has explicit fallback strings
- Use `cn()` universally for className composition

### TypeScript Types (`typescript-types`)

**Purpose**: Type definitions for application domain

**Location**: `lib/types.ts`

**Examples**:
- `TaskWithRelations` - Task with related User data
- `KanbanData` - Nested structure for board state

**Key Conventions**:
- Import Prisma types from `@/app/generated/prisma/client`
- Extend Prisma types with relations using intersection (`&`)
- Define nested structures for complex UI state

### Fonts Configuration (`fonts-configuration`)

**Purpose**: Next.js font optimization setup

**Location**: `lib/fonts.ts`

**Key Conventions**:
- Import fonts from `next/font/google`
- Inter for body text, Poppins for headings
- Configure with subsets, weights, and CSS variables
- Apply via `className` prop (not global CSS import)

### Database Schema (`database-schema`)

**Purpose**: Prisma schema defining database structure

**Location**: `prisma/schema.prisma`

**Key Conventions**:
- Generate Prisma client to `app/generated/prisma`
- Include binary targets for Docker (ARM64 Linux) and macOS (ARM64)
- Use named relations for self-referencing models (`"AssignedTasks"`, `"CreatedTasks"`)
- Set `onDelete: Cascade` for dependent records
- Optional `assigneeId`, required `creatorId` for tasks

### Database Scripts (`database-scripts`)

**Purpose**: Database seeding and management scripts

**Location**: `prisma/` directory

**Examples**:
- `prisma/seed.js` - Seed data
- `prisma/clear.js` - Clear all data

**Key Conventions**:
- Import Prisma from `./app/generated/prisma/client`
- Hash passwords with bcryptjs in seed data
- Generate sessions with token and expiry
- Provide clear script for development resets

### Config Files (`config-files`)

**Purpose**: Build tool and framework configuration

**Location**: Root directory

**Key Conventions**:
- Enable Turbopack in dev: `next dev --turbopack`
- Use root-level path alias `@/*`
- Configure Jest for custom Prisma output directory
- Playwright global setup/teardown for server lifecycle
- Tailwind CSS 4 with `@theme` directive for design tokens
- ESLint flat config with FlatCompat
- Separate Jest TypeScript config (`tsconfig.jest.json`) for JSX handling

### Docker Files (`docker-files`)

**Purpose**: Containerization for dev/test/production

**Location**: Root directory

**Key Conventions**:
- Multi-stage Dockerfile for production (deps → builder → runner)
- Generate Prisma client in builder stage
- Separate Dockerfile for test environment
- Three docker-compose files (prod/dev/test)
- Mount volumes in dev mode for hot reload
- Include PostgreSQL in all environments

### Test Setup (`test-setup`)

**Purpose**: Global test configuration

**Location**: `jest.setup.ts`

**Key Conventions**:
- Import `@testing-library/jest-dom` for custom matchers
- Use jsdom environment for React component tests
- Keep setup file minimal (no global mocks)

### Unit Tests (`unit-tests`)

**Purpose**: Component and utility tests

**Location**: `tests/unit/`

**Key Conventions**:
- Use Testing Library queries: getByRole → getByLabelText → getByText
- Use `userEvent` for interactions (not `fireEvent`)
- Mock server actions at module level with `jest.mock`
- Use `waitFor` for async state updates
- Name files with `.test.tsx` suffix
- Organize with nested `describe` blocks

### E2E Tests (`e2e-tests`)

**Purpose**: End-to-end integration tests

**Location**: `tests/e2e/`

**Key Conventions**:
- Use page locators directly (no page object classes)
- Manage server in global setup/teardown
- Name files with `.spec.ts` suffix
- Use relative URLs with baseURL config
- Use data attributes for drag-and-drop testing

### E2E Test Utilities (`e2e-test-utilities`)

**Purpose**: Global setup/teardown for E2E tests

**Location**: `tests/e2e/`

**Examples**:
- `global-setup.js` - Start server before tests
- `global-teardown.js` - Stop server after tests

**Key Conventions**:
- Spawn server in global setup with retry logic
- Poll for server readiness with timeout
- Store server process in global variable
- Kill server in global teardown

### Build Scripts (`build-scripts`)

**Purpose**: Custom build and test orchestration

**Location**: `scripts/`

**Examples**:
- `scripts/test-e2e-with-server.js` - E2E test runner

**Key Conventions**:
- Orchestrate server lifecycle around test execution
- Poll for server readiness before tests
- Cleanup processes on test exit

### Styles (`styles`)

**Purpose**: Global CSS and design tokens

**Location**: `app/globals.css`

**Key Conventions**:
- Import Tailwind with `@import "tailwindcss"`
- Define design tokens in `@theme` directive
- Use space-separated HSL values (no `hsl()`)
- Apply global utilities in `@layer base`
- Define dark mode tokens in media query

### Documentation (`documentation`)

**Purpose**: Project documentation

**Location**: `README.md`, `scripts/backup-scripts.md`

**Key Conventions**:
- README focuses on setup and development
- List all available npm scripts
- Include tech stack overview
- Separate operational docs from main README

### VS Code Tasks (`vscode-tasks`)

**Purpose**: IDE task automation

**Location**: `.vscode/tasks.json`

**Key Conventions**:
- Use task dependencies to prevent port conflicts
- Mark server tasks as `isBackground: true`
- Set dev as default build task
- Provide tasks for database operations
- Separate unit and E2E test tasks

### Devcontainer (`devcontainer`)

**Purpose**: VS Code development container configuration

**Location**: `.devcontainer/devcontainer.json`

**Key Conventions**:
- Use Node.js 18 base image
- Include PostgreSQL feature
- Forward ports for Next.js (3000) and PostgreSQL (5432)
- Run setup commands on container creation
- Pre-install ESLint, Prettier, Prisma extensions

### Git Ignore (`git-ignore`)

**Purpose**: Exclude files from version control

**Location**: `.gitignore`

**Key Conventions**:
- Ignore Next.js build directories (`.next/`, `out/`)
- Ignore Prisma generated client (`app/generated/`)
- Ignore test outputs (`test-results/`, `coverage/`)
- Ignore environment files (`.env`, `.env*.local`)

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
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

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
)

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
    )
  }
)
PriorityBadge.displayName = "PriorityBadge"

export { PriorityBadge, badgeVariants }
```

3. **Use in feature component**:
```tsx
// components/task-list.tsx
import { PriorityBadge } from "@/components/ui/priority-badge"

<PriorityBadge priority={task.priority as "low" | "medium" | "high"}>
  {task.priority}
</PriorityBadge>
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
import { PrismaClient } from "@/app/generated/prisma/client"
import { getCurrentUser } from "@/app/login/actions"
import { redirect } from "next/navigation"
import { ReportsClient } from "./_components/reports-client"

const prisma = new PrismaClient()

export default async function ReportsPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const reports = await prisma.task.groupBy({
    by: ["status"],
    _count: { id: true },
  })

  return <ReportsClient reports={reports} />
}
```

3. **Client component for interactivity**:
```tsx
// app/(dashboard)/reports/_components/reports-client.tsx
"use client"

import { useState } from "react"
import { BarChart, Bar, ResponsiveContainer } from "recharts"

export function ReportsClient({ reports }) {
  const [filter, setFilter] = useState("all")
  // ... interactive logic
}
```

4. **Server actions for mutations**:
```tsx
// app/(dashboard)/reports/actions.ts
"use server"

import { PrismaClient } from "@/app/generated/prisma/client"
import { getCurrentUser } from "@/app/login/actions"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

export async function generateReport(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) return { error: "Unauthorized" }

  const type = formData.get("type") as string

  // ... report generation logic

  revalidatePath("/reports")
  return { success: "Report generated successfully" }
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
import { Project, User, Task } from "@/app/generated/prisma/client"

export type ProjectWithRelations = Project & {
  owner: User
  tasks: Task[]
}
```

4. **Create server actions**:
```tsx
// app/(dashboard)/projects/actions.ts
"use server"

import { PrismaClient } from "@/app/generated/prisma/client"
import { getCurrentUser } from "@/app/login/actions"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

export async function createProject(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) return { error: "Unauthorized" }

  const name = formData.get("name") as string
  const description = formData.get("description") as string

  await prisma.project.create({
    data: {
      name,
      description,
      ownerId: user.id,
    },
  })

  revalidatePath("/projects")
  return { success: "Project created" }
}

export async function deleteProject(projectId: number) {
  const user = await getCurrentUser()
  if (!user) return { error: "Unauthorized" }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  })

  if (project?.ownerId !== user.id) {
    return { error: "Not authorized to delete this project" }
  }

  await prisma.project.delete({
    where: { id: projectId },
  })

  revalidatePath("/projects")
  return { success: "Project deleted" }
}
```

---

## Integration Rules

### UI Domain Constraints

- **Radix UI Required**: All UI primitives must build on Radix UI components
- **CVA for Variants**: Use Class Variance Authority for component variants
- **cn() Utility**: All className concatenation must use `cn()` from `lib/utils`
- **forwardRef Pattern**: UI components must use React.forwardRef
- **displayName Required**: Set displayName on all forwardRef components
- **Lucide Icons Only**: Use Lucide React for all icons
- **Component Location**: UI primitives in `components/ui/`, features in `components/`
- **Tailwind Only**: Use Tailwind utility classes exclusively

### Routing Domain Constraints

- **App Directory**: All routes in `app/` directory
- **Route Groups**: Use `(name)` for shared layouts without URL segments
- **Server Components Default**: Components are server by default
- **Client Directive Explicit**: Mark client components with `"use client"`
- **No API Routes**: Use server actions instead of `/api` directory
- **Turbopack Dev**: Run development with `next dev --turbopack`

### Data Layer Constraints

- **Prisma Only**: All database access through PrismaClient
- **Custom Prisma Path**: Import from `@/app/generated/prisma/client`
- **Server Actions**: Data mutations via `"use server"` functions in `actions.ts`
- **revalidatePath Required**: Call after mutations for cache invalidation
- **Error Return Pattern**: Return `{ error, success, message? }` (never throw)
- **getCurrentUser Auth**: Protected actions must call `getCurrentUser()` first
- **Collocated Actions**: Server actions in `actions.ts` files with routes
- **PostgreSQL Only**: Database is PostgreSQL (not database-agnostic)
- **No GraphQL**: Direct Prisma usage
- **Session-Based Auth**: Use Session model with tokens
- **Server-Only DB**: Database operations only in server actions

### State Management Constraints

- **Server Actions for Mutations**: All data mutations through server actions
- **useState for Client**: Client UI state with React useState
- **No Global State Library**: No Redux, Zustand, or other libraries
- **Server Components Fetch**: Server components fetch data directly
- **Props for Data**: Pass data to client components via props
- **Optimistic Updates**: Use `useTransition` for optimistic UI

### Authentication Constraints

- **getCurrentUser Check**: All protected actions call `getCurrentUser()`
- **Session Tokens**: Store sessions in database with unique tokens
- **bcrypt Hashing**: Hash passwords with bcryptjs
- **Return User or Null**: `getCurrentUser()` returns `User | null`
- **Login Actions Location**: Auth functions in `app/login/actions.ts`
- **Cookie Storage**: Session tokens stored in cookies
- **No JWT**: Use database sessions
- **No OAuth**: Email/password only

### Forms Domain Constraints

- **FormData Parameter**: Server actions receive FormData
- **formData.get()**: Extract fields with `formData.get('fieldName')`
- **Action Attribute**: Forms use `action={serverAction}`
- **Controlled Inputs**: Client forms use controlled inputs (useState)
- **Date Parsing**: Use `parseDateString` from `lib/date-utils`
- **No react-hook-form**: Native HTML forms with server actions
- **Server-Side Validation**: Validation logic in server actions
- **Return Success/Error**: Form submissions return structured response

### Testing Constraints

- **Jest for Units**: Use Jest + React Testing Library
- **Playwright for E2E**: Use Playwright for end-to-end tests
- **jsdom Environment**: Configure Jest with jsdom
- **Testing Library Matchers**: Import `@testing-library/jest-dom`
- **Unit Test Naming**: Use `.test.tsx` suffix
- **E2E Test Naming**: Use `.spec.ts` suffix
- **Global Setup**: E2E tests use global setup/teardown for server

### Styling Constraints

- **Tailwind Only**: Use Tailwind utility classes exclusively
- **cn() Function**: Use `cn()` for class composition
- **Design Tokens**: Use CSS custom properties from `@theme`
- **Mobile-First**: Responsive design with mobile-first approach
- **Tailwind CSS 4**: Use `@import "tailwindcss"` and `@theme` directive

### Typography Constraints

- **Next.js Font Optimization**: Import from `next/font/google`
- **Inter for Body**: Use Inter variable font for body text
- **Poppins for Headings**: Use Poppins (weights 400-900) for headings
- **className Application**: Apply fonts via className prop

### Data Visualization Constraints

- **Recharts Required**: Use Recharts for charts
- **Client Component**: Charts must be client components
- **ResponsiveContainer**: Always wrap charts in ResponsiveContainer
- **Chart Data Format**: Array of objects for chart data

### Drag and Drop Constraints

- **@hello-pangea/dnd**: Use this library for drag-and-drop
- **DragDropContext**: Wrap draggable areas
- **Client Component**: DnD must be client component
- **Optimistic Updates**: Use `useTransition` for state updates
- **Server Sync**: Sync state to server after drag completes

---

## Example Prompt Usage

### Example 1: Create a Status Filter Dropdown

**Prompt**:
> "Create a status filter dropdown component for the tasks page that lets users filter tasks by status (todo, in-progress, done, cancelled)"

**Expected Files**:
```
components/ui/status-select.tsx         # Select UI primitive with CVA variants
components/task-status-filter.tsx       # Feature component with filter logic
lib/types.ts                            # Add TaskStatus type if needed
```

**Implementation Pattern**:

1. **UI Primitive** (`components/ui/status-select.tsx`):
```tsx
import { Select } from "@/components/ui/select"
import { forwardRef } from "react"

const StatusSelect = forwardRef((props, ref) => (
  <Select ref={ref} {...props} />
))
StatusSelect.displayName = "StatusSelect"

export { StatusSelect }
```

2. **Feature Component** (`components/task-status-filter.tsx`):
```tsx
"use client"

import { useState } from "react"
import { StatusSelect } from "@/components/ui/status-select"

export function TaskStatusFilter({ onFilterChange }) {
  const [status, setStatus] = useState("all")

  const handleChange = (value: string) => {
    setStatus(value)
    onFilterChange(value)
  }

  return (
    <StatusSelect value={status} onValueChange={handleChange}>
      {/* Select options */}
    </StatusSelect>
  )
}
```

### Example 2: Add Task Comments Feature

**Prompt**:
> "Add a comments feature to tasks where users can add, view, and delete comments on tasks"

**Expected Files**:
```
prisma/schema.prisma                    # Add Comment model
app/(dashboard)/tasks/actions.ts        # Add comment CRUD actions
components/task-comments.tsx            # Comments list (client component)
components/comment-form.tsx             # Comment form (client component)
components/ui/comment-card.tsx          # Comment card UI primitive
lib/types.ts                            # Add CommentWithUser type
tests/unit/comment-form.test.tsx        # Unit tests
tests/e2e/task-comments.spec.ts         # E2E tests
```

**Implementation Steps**:

1. Update Prisma schema
2. Run migration: `npm run db:setup`
3. Create types in `lib/types.ts`
4. Add server actions to `app/(dashboard)/tasks/actions.ts`
5. Create UI primitives in `components/ui/`
6. Create feature components in `components/`
7. Add unit tests
8. Add E2E tests

### Example 3: Add Task Due Date Notifications

**Prompt**:
> "Show a notification badge on tasks that are due within 24 hours"

**Expected Files**:
```
components/ui/notification-badge.tsx    # Badge UI primitive with CVA
components/task-due-indicator.tsx       # Feature component with logic
lib/date-utils.ts                       # Add isDueSoon() helper
tests/unit/date-utils.test.ts           # Test isDueSoon logic
```

**Implementation Pattern**:

1. **Date Utility** (`lib/date-utils.ts`):
```tsx
export function isDueSoon(dueDate: Date): boolean {
  const now = new Date()
  const diff = dueDate.getTime() - now.getTime()
  const hours = diff / (1000 * 60 * 60)
  return hours > 0 && hours <= 24
}
```

2. **UI Primitive** (`components/ui/notification-badge.tsx`):
```tsx
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full",
  {
    variants: {
      variant: {
        warning: "bg-yellow-500 text-white",
        danger: "bg-red-500 text-white",
      },
    },
  }
)

export function NotificationBadge({ variant, children, className }) {
  return (
    <span className={cn(badgeVariants({ variant, className }))}>
      {children}
    </span>
  )
}
```

3. **Feature Component** (`components/task-due-indicator.tsx`):
```tsx
"use client"

import { NotificationBadge } from "@/components/ui/notification-badge"
import { isDueSoon } from "@/lib/date-utils"
import { Clock } from "lucide-react"

export function TaskDueIndicator({ dueDate }) {
  if (!dueDate || !isDueSoon(new Date(dueDate))) return null

  return (
    <NotificationBadge variant="warning">
      <Clock className="h-3 w-3" />
    </NotificationBadge>
  )
}
```

4. **Unit Test** (`tests/unit/date-utils.test.ts`):
```tsx
import { isDueSoon } from "@/lib/date-utils"

describe("isDueSoon", () => {
  it("returns true for dates within 24 hours", () => {
    const tomorrow = new Date(Date.now() + 12 * 60 * 60 * 1000)
    expect(isDueSoon(tomorrow)).toBe(true)
  })

  it("returns false for dates more than 24 hours away", () => {
    const nextWeek = new Date(Date.now() + 8 * 24 * 60 * 60 * 1000)
    expect(isDueSoon(nextWeek)).toBe(false)
  })
})
```

---

## Project-Specific Patterns to Remember

1. **Prisma client location**: Always import from `@/app/generated/prisma/client`
2. **Route groups for auth**: Use `(dashboard)` route group for authenticated routes
3. **Font application**: Use `inter.className` for body, `poppins.className` for headings
4. **Error handling**: Return objects, never throw in server actions
5. **Optimistic updates**: Use `useTransition` + local state for immediate UI feedback
6. **Form field mapping**: Form "title" → Database "name"
7. **Session auth**: Check `getCurrentUser()` first in protected actions
8. **Cache invalidation**: Always call `revalidatePath()` after mutations
9. **Client boundaries**: Mark interactive components with `"use client"`
10. **Tailwind CSS 4**: Use `@import` and `@theme` directive for design tokens

---

## Common Mistakes to Avoid

- ❌ Don't use CSS modules or styled-components (use Tailwind)
- ❌ Don't fetch data in client components (fetch in server, pass via props)
- ❌ Don't throw errors in server actions (return error objects)
- ❌ Don't skip `revalidatePath` after mutations (causes stale data)
- ❌ Don't concatenate classes manually (use `cn()` utility)
- ❌ Don't forget `forwardRef` + `displayName` in UI components
- ❌ Don't use different icon libraries (use Lucide React only)
- ❌ Don't create API routes in `/api` (use server actions)
- ❌ Don't skip `getCurrentUser()` check in protected actions
- ❌ Don't import Prisma from `@prisma/client` (use custom output path)

---

This document should be updated as the codebase evolves to maintain alignment between AI-generated code and project conventions.

