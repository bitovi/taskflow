# Fonts Configuration Style Guide

## Unique Conventions

### 1. Next.js Font Optimization

Fonts imported from `next/font/google`:

```tsx
import { Inter, Poppins } from "next/font/google"

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
})
```

**Why unique**: Variable fonts with CSS custom properties for optimization.

### 2. Dual Font System

Two fonts with specific roles:

- **Inter**: Body text and UI (variable font)
- **Poppins**: Headings and emphasis (weights 400-900)

**Why unique**: Explicit font pairing for hierarchy.

### 3. CSS Variable Export

Fonts export CSS custom properties:

```tsx
variable: "--font-inter"
variable: "--font-poppins"
```

**Why unique**: Can be used as Tailwind utilities or CSS variables.

### 4. className Application

Applied via `className` prop:

```tsx
// Root layout
<body className={inter.className}>

// Headings
<h1 className={poppins.className}>
```

**Why unique**: Direct className application (not CSS import).

## File Structure

Font configuration in `lib/`:

```
lib/
└── fonts.ts
```

## Key Takeaways

1. Import fonts from `next/font/google`
2. Use Inter for body, Poppins for headings
3. Configure with subsets, weights, and CSS variables
4. Apply via `className` prop (not global CSS)
5. Locate in `lib/` directory
