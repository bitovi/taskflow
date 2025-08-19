# TaskFlow - AI Copilot Instructions

## Overview

This file enables AI coding assistants to generate features aligned with TaskFlow's architecture and conventions. These instructions are based on actual, observed patterns from the codebase analysis following the Bitovi instruction generation methodology.

TaskFlow is a task management application built with Next.js 15, React 19, TypeScript, Prisma ORM, and Tailwind CSS. It features authentication, CRUD operations, kanban boards, and data visualization.

## File Category Reference

### next-js-pages
**Purpose**: App Router pages that define routes and handle initial data loading
**Examples**: `app/(dashboard)/page.tsx`, `app/login/page.tsx`
**Key Conventions**:
- Use consistent padding structure: `className="flex-1 space-y-4 p-4 md:p-8 pt-6"`
- Headers with Poppins font: `className={`text-3xl font-bold tracking-tight ${poppins.className}`}`
- Server pages use async functions for data fetching
- Client pages start with "use client" directive

### server-actions
**Purpose**: Server-side functions for data mutations and authentication
**Examples**: `app/(dashboard)/tasks/actions.ts`, `app/login/actions.ts`
**Key Conventions**:
- Start with "use server" directive
- Authentication check: `const user = await getCurrentUser(); if (!user) return { error: "Not authenticated." }`
- Return format: `{ success: boolean, error?: string, message?: string }`
- Always include `revalidatePath()` after mutations
- Use `parseDateString()` for date handling

### react-components
**Purpose**: Interactive UI components with state management
**Examples**: `components/task-list.tsx`, `components/kanban-board.tsx`
**Key Conventions**:
- Use "use client" directive for interactivity
- Optimistic updates with `useOptimistic` hook
- Type extensions: `type TaskWithProfile = PrismaTask & { assignee?: Pick<User, "name"> | null }`
- Event handlers combine optimistic updates with server actions

### ui-components
**Purpose**: Reusable design system components built on Radix UI
**Examples**: `components/ui/button.tsx`, `components/ui/card.tsx`
**Key Conventions**:
- Use `React.forwardRef` pattern
- Class variance authority for variants
- Radix UI primitives as foundation
- Export all related components together

### utility-functions
**Purpose**: Helper functions for common operations
**Examples**: `lib/utils.ts`, `lib/date-utils.ts`
**Key Conventions**:
- Simple, focused functions
- Timezone-safe date operations
- JSDoc comments for complex logic
- Flexible input types (Date | string)

### type-definitions
**Purpose**: TypeScript type definitions extending Prisma types
**Examples**: `lib/types.ts`
**Key Conventions**:
- Extend Prisma types with relationships
- Use literal union types for status values
- Nullable relationship patterns with Pick utility
- Centralized in lib/types.ts

## Feature Scaffold Guide

### Creating a New Feature
1. **Determine file structure** based on feature scope:
   - Add page in `app/(dashboard)/feature-name/page.tsx`
   - Create server actions in `app/(dashboard)/feature-name/actions.ts`
   - Build components in `components/feature-name.tsx`
   - Add types to `lib/types.ts` if needed

2. **Follow naming conventions**:
   - Pages: `page.tsx` in feature folders
   - Components: kebab-case filenames, PascalCase exports
   - Actions: descriptive function names (createTask, updateTask)
   - Types: descriptive names with relationships (TaskWithProfile)

3. **Implement authentication protection**:
   - Server actions: Check `getCurrentUser()` first
   - Protected pages: Use dashboard route group
   - Forms: Handle error states from authentication

### Example: Adding a Comments Feature

**Files to create**:
- `app/(dashboard)/comments/page.tsx` - Comments list page
- `app/(dashboard)/comments/actions.ts` - CRUD operations
- `components/comment-list.tsx` - Comment display component
- `components/create-comment-form.tsx` - Comment creation
- Add Comment model to `prisma/schema.prisma`
- Add CommentWithUser type to `lib/types.ts`

## Integration Rules

### Data Layer Constraints
- All database access must use Prisma client from `@/app/generated/prisma`
- Server Actions must include authentication checks via `getCurrentUser()`
- Mutations must call `revalidatePath()` for cache invalidation
- Date inputs must use `parseDateString()` utility

### UI Constraints
- All interactive elements must use Radix UI components (Button, Dialog, etc.)
- Styling must use Tailwind CSS classes and `cn()` utility
- Icons must be imported from lucide-react package
- Fonts must use Poppins for headings, defined in `lib/fonts.ts`

### State Management Constraints
- Use Server Components for data fetching, not global state libraries
- Client components receive data as props from server components
- Optimistic updates must be paired with Server Actions
- Forms must submit to Server Actions, not client-side libraries

### Authentication Constraints
- Session-based authentication using httpOnly cookies
- All auth operations must be Server Actions
- Protected routes must check authentication at layout level
- Passwords must be hashed with bcryptjs

### Drag and Drop Constraints
- Must use Hello-Pangea DnD library components
- Kanban boards must follow DragDropContext/Droppable/Draggable structure
- Drag operations must update local state immediately and sync to server

### Data Visualization Constraints
- All charts must use Recharts library with ResponsiveContainer
- Chart components must be separate and receive processed data as props
- Use consistent theme colors defined in chart components

## Example Prompt Usage

**User Request**: "Create a searchable dropdown that lets users filter tasks by status"

**Expected AI Response**: Create these files following TaskFlow conventions:

1. `components/status-filter-dropdown.tsx`:
```typescript
"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StatusFilterProps {
  onStatusChange: (status: string | null) => void
  currentStatus?: string | null
}

export function StatusFilterDropdown({ onStatusChange, currentStatus }: StatusFilterProps) {
  return (
    <Select value={currentStatus || "all"} onValueChange={(value) => onStatusChange(value === "all" ? null : value)}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Statuses</SelectItem>
        <SelectItem value="todo">To Do</SelectItem>
        <SelectItem value="in_progress">In Progress</SelectItem>
        <SelectItem value="review">Review</SelectItem>
        <SelectItem value="done">Done</SelectItem>
      </SelectContent>
    </Select>
  )
}
```

2. Update `components/task-list.tsx` to integrate the filter:
```typescript
const [statusFilter, setStatusFilter] = useState<string | null>(null)

const filteredTasks = optimisticTasks.filter(task => 
  !statusFilter || task.status === statusFilter
)

// Add in render:
<StatusFilterDropdown onStatusChange={setStatusFilter} currentStatus={statusFilter} />
```

This example demonstrates:
- Using existing UI components (Select)
- Following TypeScript patterns with proper interfaces
- Integrating with existing state management patterns
- Using consistent naming conventions
- Respecting the established status literal types