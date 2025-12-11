# Styling Domain

## Overview

Styling uses **Tailwind CSS 4** with custom design tokens defined as CSS custom properties. All styling is done through utility classes - no CSS modules or styled-components.

## Required Patterns

### 1. Tailwind Utility Classes

All styling uses Tailwind utilities:

```tsx
// components/kanban-board.tsx
<div className="flex space-x-6 overflow-x-auto pb-4">
  <div className="flex-shrink-0 w-80 transition-colors rounded-lg">
    <CardHeader className="pb-3 px-4 pt-4">
```

### 2. cn() Function for Class Composition

Combine classes with `cn()` utility:

```tsx
// lib/utils.ts
export function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(" ");
}
```

```tsx
// Usage
<div className={cn(
  "flex-shrink-0 w-80 transition-colors rounded-lg",
  snapshot.isDraggingOver ? "bg-background-light" : "bg-background-dark"
)}>
```

### 3. Design Tokens (CSS Custom Properties)

Use semantic color tokens:

```css
/* app/globals.css */
:root {
  --background: 180 20% 7%;
  --foreground: 180 5% 95%;
  --card: 180 20% 9%;
  --card-foreground: 180 5% 95%;
  --primary: 13 100% 57%;
  --primary-foreground: 0 0% 100%;
  --secondary: 180 20% 15%;
  --secondary-foreground: 180 5% 95%;
  --muted: 180 20% 15%;
  --muted-foreground: 180 5% 60%;
  --accent: 180 20% 15%;
  --accent-foreground: 180 5% 95%;
  --destructive: 0 63% 31%;
  --destructive-foreground: 180 5% 95%;
  --border: 180 20% 20%;
  --input: 180 20% 20%;
  --ring: 13 100% 57%;
}
```

Usage:
```tsx
<div className="bg-background text-foreground">
<Button className="bg-primary text-primary-foreground">
<Card className="bg-card border-border">
```

### 4. Responsive Design

Mobile-first responsive classes:

```tsx
<div className="text-sm md:text-base lg:text-lg">
<Button size="sm" className="md:h-10 md:px-4 lg:h-11 lg:px-8">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### 5. Conditional Styling

Dynamic classes based on state:

```tsx
<Link
  className={cn(
    "flex items-center space-x-3 px-3 py-2 rounded-md",
    pathname === item.href
      ? "bg-primary text-primary-foreground"
      : "hover:bg-accent"
  )}
>
```

### 6. Global Styles

Global styles in `app/globals.css`:

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: var(--font-inter), sans-serif;
}

/* Custom scrollbar styles, etc. */
```

## Tailwind Configuration

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... more color definitions
      },
    },
  },
  plugins: [],
}
```

## Common Patterns

### Layout Classes

```tsx
<div className="flex min-h-screen">
  <aside className="w-64 bg-card border-r border-border">
  <main className="flex-1 overflow-auto">
```

### Spacing

```tsx
<div className="space-y-4">  {/* Vertical spacing */}
<div className="space-x-2">  {/* Horizontal spacing */}
<div className="p-8">        {/* Padding all sides */}
<div className="px-4 py-2">  {/* Padding x and y */}
<div className="mb-4">       {/* Margin bottom */}
```

### Typography

```tsx
<h1 className="text-2xl font-bold">
<p className="text-sm text-muted-foreground">
<span className="text-xs text-destructive">
```

### Borders and Shadows

```tsx
<div className="border border-border rounded-md">
<Card className="shadow-lg">
<div className="ring-2 ring-primary">
```

### Transitions

```tsx
<div className="transition-colors duration-200">
<Button className="hover:bg-primary/90">
<div className="transition-shadow hover:shadow-md">
```

## Real-World Examples

### Sidebar Navigation

```tsx
<aside className="w-64 bg-card border-r border-border">
  <nav className="space-y-2 p-4">
    <Link
      className={cn(
        "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
        pathname === "/"
          ? "bg-primary text-primary-foreground"
          : "hover:bg-accent text-foreground"
      )}
    >
      <LayoutDashboard className="h-5 w-5" />
      <span>Dashboard</span>
    </Link>
  </nav>
</aside>
```

### Card Component

```tsx
<Card className="hover:shadow-md transition-shadow">
  <CardContent className="p-3">
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium text-sm leading-tight">
          {task.name}
        </h4>
        <Badge variant="destructive" className="text-xs flex-shrink-0">
          {task.priority}
        </Badge>
      </div>
    </div>
  </CardContent>
</Card>
```

### Form Styling

```tsx
<form className="space-y-4">
  <div>
    <Label htmlFor="title" className="text-sm font-medium">
      Title
    </Label>
    <Input
      id="title"
      className="mt-1"
      placeholder="Enter title"
    />
  </div>
  <Button
    type="submit"
    className="w-full"
  >
    Submit
  </Button>
</form>
```

## Constraints

1. **No CSS Modules**: Never use `.module.css` files
2. **No Styled Components**: No CSS-in-JS libraries
3. **Globals only in app/globals.css**: Global styles only in one file
4. **Always use cn()**: Never concatenate classNames manually
5. **Design tokens for colors**: Use semantic color names (--background, --primary, etc.)
6. **Mobile-first**: Use `md:` and `lg:` prefixes for larger screens
7. **Tailwind utilities only**: No custom CSS classes (except in globals.css)
8. **PostCSS required**: Tailwind processes through PostCSS

## Tools and Technologies

- **Tailwind CSS 4**: Utility-first CSS framework
- **PostCSS**: CSS processor
- **CSS Custom Properties**: Design tokens
- **cn() utility**: Class name composition
