# React Components - UI Style Guide

## Unique Conventions

### 1. Class Variance Authority (CVA) Pattern

All UI components use CVA for variants:

```tsx
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-background",
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

**Why unique**: Consistent CVA pattern across all UI primitives.

### 2. forwardRef + displayName Pattern

All components use forwardRef and set displayName:

```tsx
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  }
)
Button.displayName = "Button"
```

**Why unique**: Mandatory displayName setting for all forwardRef components.

### 3. asChild Pattern with Radix Slot

Components support rendering as different elements:

```tsx
import { Slot } from "@radix-ui/react-slot"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Comp = asChild ? Slot : "button"
return <Comp {...props} />
```

**Why unique**: Radix Slot pattern enables flexible composition.

### 4. cn() for All ClassName Composition

Never manually concatenate classes:

```tsx
<Comp className={cn("cursor-pointer", buttonVariants({ variant, size, className }))} />
```

**Why unique**: `cn()` utility used universally, no string concatenation.

### 5. TypeScript Interface Extension

Extend native HTML element props:

```tsx
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}
```

**Why unique**: Extends both HTML props AND CVA variant props.

## Radix UI Components

All UI primitives built on Radix:

- Avatar → `@radix-ui/react-avatar`
- Button → `@radix-ui/react-slot`
- Checkbox → `@radix-ui/react-checkbox`
- Dialog → `@radix-ui/react-dialog`
- DropdownMenu → `@radix-ui/react-dropdown-menu`
- Label → `@radix-ui/react-label`
- Select → `@radix-ui/react-select`

## File Structure

All UI primitives in `components/ui/`:

```
components/ui/
├── avatar.tsx
├── badge.tsx
├── button.tsx
├── card.tsx
├── checkbox.tsx
├── dialog.tsx
├── dropdown-menu.tsx
├── input.tsx
├── label.tsx
├── select.tsx
└── textarea.tsx
```

## Key Takeaways

1. Use CVA for all component variants
2. Always use `React.forwardRef` for UI primitives
3. Set `displayName` after every forwardRef component
4. Support `asChild` prop via Radix Slot
5. Extend both HTML props and VariantProps
6. Use `cn()` for all className composition
7. Build on Radix UI primitives
8. Locate in `components/ui/` directory
