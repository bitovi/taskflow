# UI Domain Implementation

## Component Structure

All UI components follow a consistent TypeScript pattern with either client-side interactivity or server-side rendering:

**Client Components** (components requiring interactivity):
```typescript
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
// ... other imports

export function ComponentName() {
  // Component logic
}
```

**Server Components** (components for data fetching):
```typescript
import { getCurrentUser } from "@/app/login/actions"
import { ComponentName } from "@/components/component-name"

export default async function PageComponent() {
  const data = await fetchData()
  return <ComponentName data={data} />
}
```

## Styling Approach

All styling uses Tailwind CSS utility classes with the `cn()` utility function for conditional styling:

```typescript
import { cn } from "@/lib/utils"

export function Card({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}>
      {children}
    </div>
  )
}
```

## Design System Implementation

The project uses Radix UI as the foundation with custom styling. All interactive components are built on Radix primitives:

**Button Component Pattern:**
```typescript
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        // ... other variants
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    }
  }
)
```

**Dialog Pattern:**
```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function TaskDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogHeader>
        {/* Dialog content */}
      </DialogContent>
    </Dialog>
  )
}
```

## Icon Usage

All icons use Lucide React with consistent import and usage patterns:

```typescript
import { MoreHorizontal, Clock, Edit, Trash2 } from "lucide-react"

export function TaskActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## Font Implementation

Custom fonts are defined in `lib/fonts.ts` and applied via className:

```typescript
// lib/fonts.ts
import { Poppins } from "next/font/google"

export const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"]
})

// Usage in components
import { poppins } from "@/lib/fonts"

export function Header() {
  return (
    <h1 className={`${poppins.className} text-2xl font-semibold`}>
      Task Management
    </h1>
  )
}
```

## Type Safety

All components use proper TypeScript typing with Prisma-generated types:

```typescript
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

export function TaskList({ tasks }: { tasks: TaskWithProfile[] }) {
  // Component implementation
}
```