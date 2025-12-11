# UI Domain

## Overview

The UI domain follows the **shadcn/ui component pattern**, which combines Radix UI primitives with class-variance-authority for component variants and Tailwind CSS for styling. All components use the `cn()` utility for conditional class application.

## Required Patterns

### 1. Radix UI Primitives

All UI components are built on top of Radix UI headless components:

```tsx
// components/ui/button.tsx
import { Slot } from "@radix-ui/react-slot"
```

Used Radix UI components:
- `@radix-ui/react-slot` - For asChild pattern
- `@radix-ui/react-avatar` - Avatar component
- `@radix-ui/react-checkbox` - Checkbox input
- `@radix-ui/react-dialog` - Modal dialogs
- `@radix-ui/react-dropdown-menu` - Dropdown menus
- `@radix-ui/react-label` - Form labels
- `@radix-ui/react-select` - Select dropdowns

### 2. Class Variance Authority (CVA)

Components use CVA for defining variant-based styling:

```tsx
// components/ui/button.tsx
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

Pattern: Define base classes as first argument, variants object as second argument, specify defaultVariants.

### 3. cn() Utility Function

All className concatenation uses the `cn()` helper:

```tsx
// lib/utils.ts
export function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(" ");
}
```

Usage:
```tsx
// components/ui/button.tsx
<Comp
  className={cn("cursor-pointer", buttonVariants({ variant, size, className }))}
  ref={ref}
  {...props}
/>
```

### 4. React.forwardRef Pattern

All UI primitives use forwardRef for proper ref handling:

```tsx
// components/ui/button.tsx
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn("cursor-pointer", buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
```

Pattern: Always set `displayName` after component definition for debugging.

### 5. Lucide React Icons

All icons come from `lucide-react`:

```tsx
// components/kanban-board.tsx
import { Plus, Clock } from "lucide-react"

// Usage
<Clock className="h-3 w-3" />
```

### 6. Client Component Directive

Interactive components explicitly use "use client":

```tsx
// components/kanban-board.tsx
"use client"

import { useState, useTransition } from "react"
```

## File Organization

### UI Primitives Location

All reusable UI primitives are in `components/ui/`:
- `components/ui/button.tsx` - Button component
- `components/ui/card.tsx` - Card component
- `components/ui/dialog.tsx` - Modal dialog
- `components/ui/input.tsx` - Text input
- `components/ui/label.tsx` - Form label
- `components/ui/select.tsx` - Dropdown select
- `components/ui/checkbox.tsx` - Checkbox input
- `components/ui/badge.tsx` - Badge/tag component
- `components/ui/avatar.tsx` - Avatar component
- `components/ui/dropdown-menu.tsx` - Dropdown menu
- `components/ui/textarea.tsx` - Textarea input

### Feature Components Location

Feature-specific components are in `components/`:
- `components/kanban-board.tsx` - Kanban board implementation
- `components/task-list.tsx` - Task list view
- `components/sidebar.tsx` - Navigation sidebar
- `components/dashboard-charts.tsx` - Chart components
- `components/task-form.tsx` - Task form component
- `components/create-task-form.tsx` - Create task form
- `components/edit-task-form.tsx` - Edit task form
- `components/auth-dropdown.tsx` - Authentication dropdown
- `components/team-stats.tsx` - Team statistics display
- `components/task-overview.tsx` - Task overview cards
- `components/tasks-page-client.tsx` - Tasks page client wrapper

## Styling Conventions

### Tailwind Utility Classes

All styling uses Tailwind CSS utilities:

```tsx
// components/kanban-board.tsx
<div className="flex space-x-6 overflow-x-auto pb-4">
  <div className="flex-shrink-0 w-80 transition-colors rounded-lg">
    <CardHeader className="pb-3 px-4 pt-4">
```

### Design Tokens

Use CSS custom properties for theme colors:
- `bg-background` - Main background
- `text-foreground` - Main text color
- `bg-primary` - Primary brand color
- `text-primary-foreground` - Primary text
- `bg-card` - Card background
- `bg-muted` - Muted background
- `text-muted-foreground` - Muted text
- `bg-accent` - Accent background
- `border` - Border color

### Responsive Classes

Mobile-first responsive design:

```tsx
className="h-9 rounded-md px-3 md:h-10 md:px-4 lg:h-11 lg:px-8"
```

### Conditional Styling with cn()

Combine static and dynamic classes:

```tsx
// components/kanban-board.tsx
className={cn(
  "flex-shrink-0 w-80 transition-colors rounded-lg",
  snapshot.isDraggingOver ? "bg-background-light" : "bg-background-dark",
)}
```

## Component Patterns

### asChild Pattern

Components support rendering as a different element:

```tsx
// components/ui/button.tsx
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp ... />
  }
)
```

### TypeScript Interface Extension

Extend native HTML element props:

```tsx
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}
```

### Variant Props Type

Extract variant types from CVA:

```tsx
import { type VariantProps } from "class-variance-authority"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
```

## Real-World Examples

### Button with Variants

```tsx
// Usage in components
<Button variant="destructive" size="sm">
  Delete Task
</Button>

<Button variant="outline" size="lg">
  Create New
</Button>

<Button variant="ghost" size="icon">
  <Plus className="h-4 w-4" />
</Button>
```

### Card Composition

```tsx
// components/kanban-board.tsx
<Card>
  <CardHeader className="pb-3 px-4 pt-4">
    <div className="flex items-center justify-between">
      <CardTitle className="text-sm font-medium">
        {column.title}
        <Badge variant="secondary" className="ml-2">
          {column.tasks.length}
        </Badge>
      </CardTitle>
    </div>
  </CardHeader>
  <CardContent className="space-y-3 min-h-[100px] px-4 pb-4">
    {/* Content */}
  </CardContent>
</Card>
```

### Badge Variants

```tsx
// components/kanban-board.tsx
<Badge
  variant={
    task.priority === "high"
      ? "destructive"
      : task.priority === "medium"
        ? "default"
        : "secondary"
  }
  className="text-xs flex-shrink-0 capitalize"
>
  {task.priority}
</Badge>
```

### Avatar with Fallback

```tsx
// components/kanban-board.tsx
<Avatar className="h-6 w-6">
  <AvatarName name={task.assignee?.name || "??"} />
</Avatar>
```

## Tools and Libraries

- **Radix UI**: Headless accessible components
- **class-variance-authority (CVA)**: Component variant management
- **Tailwind CSS 4**: Utility-first styling
- **Lucide React**: Icon library
- **cn() utility**: Conditional class name composition

## Constraints

1. **No CSS Modules**: Never use `.module.css` files
2. **No Styled Components**: No CSS-in-JS libraries
3. **UI primitives in components/ui/**: Reusable components only
4. **Feature components in components/**: Application-specific components
5. **Always use cn()**: Never manually concatenate classNames
6. **forwardRef required**: All UI primitives must use forwardRef
7. **displayName required**: Always set displayName for forwardRef components
8. **Client directive required**: Mark interactive components with "use client"
9. **Radix UI for primitives**: Use Radix UI for accessible base components
10. **CVA for variants**: Use CVA pattern for component variants
