# Styles Style Guide

## Unique Conventions

### 1. Tailwind CSS 4 with @import

Tailwind imported at top of globals.css:

```css
/* app/globals.css */
@import "tailwindcss";
```

**Why unique**: Tailwind CSS 4 uses `@import` instead of `@tailwind` directives.

### 2. Design Tokens with @theme

CSS custom properties defined in @theme:

```css
@theme {
  --color-background: 0 0% 100%;
  --color-foreground: 222.2 84% 4.9%;
  
  --color-card: 0 0% 100%;
  --color-card-foreground: 222.2 84% 4.9%;
  
  --color-primary: 222.2 47.4% 11.2%;
  --color-primary-foreground: 210 40% 98%;
  
  --color-muted: 210 40% 96.1%;
  --color-muted-foreground: 215.4 16.3% 46.9%;
  
  --color-accent: 210 40% 96.1%;
  --color-accent-foreground: 222.2 47.4% 11.2%;
  
  --color-destructive: 0 84.2% 60.2%;
  --color-destructive-foreground: 210 40% 98%;
  
  --color-border: 214.3 31.8% 91.4%;
  --color-input: 214.3 31.8% 91.4%;
  --color-ring: 222.2 84% 4.9%;
  
  --radius: 0.5rem;
}
```

**Why unique**: Tailwind CSS 4 `@theme` directive for design system tokens.

### 3. HSL Color Values

Colors defined in HSL without `hsl()`:

```css
--color-primary: 222.2 47.4% 11.2%;  /* Not hsl(222.2, 47.4%, 11.2%) */
```

**Why unique**: Tailwind CSS 4 parses space-separated HSL values.

### 4. Global Utility Classes

Base styles applied globally:

```css
@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
  }
}
```

**Why unique**: Tailwind utilities applied in base layer for global defaults.

### 5. Dark Mode Tokens

Dark mode colors in media query:

```css
@media (prefers-color-scheme: dark) {
  @theme {
    --color-background: 222.2 84% 4.9%;
    --color-foreground: 210 40% 98%;
    /* ... */
  }
}
```

**Why unique**: Dark mode tokens redefined in media query, not separate file.

## File Structure

Global styles in `app/`:

```
app/
└── globals.css
```

## Key Takeaways

1. Import Tailwind with `@import "tailwindcss"`
2. Define design tokens in `@theme` directive
3. Use space-separated HSL values (no `hsl()`)
4. Apply global utilities in `@layer base`
5. Define dark mode tokens in media query
6. Locate in `app/` directory
