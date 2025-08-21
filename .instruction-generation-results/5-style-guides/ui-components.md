# UI Components Style Guide

## Unique Patterns in TaskFlow

### Component Structure Convention
All UI components follow the React.forwardRef pattern with className merging:

```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

const ComponentName = React.forwardRef<
  HTMLElementType,
  React.HTMLAttributes<HTMLElementType> & CustomProps
>(({ className, ...props }, ref) => (
  <element
    ref={ref}
    className={cn("base-classes", className)}
    {...props}
  />
))
ComponentName.displayName = "ComponentName"
```

### Font Integration in UI Components
Some UI components directly import and use custom fonts:

```typescript
import { Poppins } from "next/font/google"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
})

// Applied in component
className={cn("base-classes", poppins.className, className)}
```

### Class Variance Authority Pattern
Interactive components use cva for variant management:

```typescript
import { cva, type VariantProps } from "class-variance-authority"

const componentVariants = cva(
  "base-utility-classes",
  {
    variants: {
      variant: {
        default: "variant-specific-classes",
        secondary: "other-variant-classes",
      },
      size: {
        default: "size-specific-classes",
        sm: "small-size-classes",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ComponentProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof componentVariants> {
  asChild?: boolean
}
```

### Slot Integration Pattern
Components that can render as different elements use Radix Slot:

```typescript
import { Slot } from "@radix-ui/react-slot"

const Component = React.forwardRef<HTMLButtonElement, ComponentProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(componentVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
```

### Composite Component Pattern
Related components are exported together:

```typescript
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  // Card implementation
)

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  // CardHeader implementation
)

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  // CardContent implementation
)

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
```

### Styling Convention
Base classes emphasize utility-first approach with consistent patterns:

```typescript
// Button base classes
"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"

// Card base classes
"rounded-lg border shadow-sm text-card-foreground bg-card-background"
```

### Color System Integration
Components reference CSS custom properties for theming:

```typescript
// Using CSS variables for colors
"bg-primary text-primary-foreground hover:bg-primary/90"
"text-muted-foreground"
"border-input bg-background"
```

### Export Pattern
All components are exported as named exports at the bottom:

```typescript
export { ComponentName, ComponentVariant1, ComponentVariant2 }
```