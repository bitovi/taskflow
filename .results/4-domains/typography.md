# Typography Domain

## Overview

Typography uses **Next.js font optimization** with Google Fonts. Inter is used for body text, Poppins for headings and titles.

## Required Patterns

### 1. Next.js Font Import

Import fonts from `next/font/google`:

```typescript
// lib/fonts.ts
import { Poppins } from "next/font/google"

export const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"]
})
```

```typescript
// app/layout.tsx
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })
```

### 2. Apply Font via className

Use font's `className` property:

```tsx
// app/layout.tsx
<body className={`${inter.className} bg-background text-foreground text-xl`}>
  {children}
</body>
```

```tsx
// components/kanban-board.tsx
import { poppins } from "@/lib/fonts"

<h4 className={`font-medium text-sm leading-tight ${poppins.className}`}>
  {task.name}
</h4>
```

### 3. Font Configuration

Font configurations in `lib/fonts.ts`:

```typescript
// lib/fonts.ts
import { Poppins } from "next/font/google"

export const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"]
})
```

Pattern:
- Specify `subsets`: `["latin"]`
- Specify `weight`: Array of needed weights
- Export font object

### 4. Font Usage by Purpose

**Inter**: Body text, general UI
```tsx
// Applied globally in root layout
<body className={inter.className}>
```

**Poppins**: Headings, titles, emphasis
```tsx
<h4 className={`font-medium ${poppins.className}`}>
  Task Title
</h4>
```

## Font Configurations

### Inter (Body Font)

```typescript
// app/layout.tsx
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

// Applied to body element
<body className={inter.className}>
```

- **Purpose**: Body text, UI elements
- **Weights**: Variable font (all weights available)
- **Subsets**: Latin

### Poppins (Heading Font)

```typescript
// lib/fonts.ts
import { Poppins } from "next/font/google"

export const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"]
})
```

- **Purpose**: Headings, titles, emphasis
- **Weights**: 400, 500, 600, 700, 800, 900
- **Subsets**: Latin

## Real-World Examples

### Root Layout Font Application

```tsx
// app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground text-xl`}>
        {children}
      </body>
    </html>
  )
}
```

### Heading with Poppins

```tsx
// components/kanban-board.tsx
import { poppins } from "@/lib/fonts"

<h4 className={`font-medium text-sm leading-tight ${poppins.className}`}>
  {task.name}
</h4>
```

### Sidebar Branding

```tsx
// components/sidebar.tsx
import { poppins } from "@/lib/fonts"

<div className={`flex items-center space-x-2 p-4 ${poppins.className}`}>
  <CheckSquare className="h-8 w-8 text-primary" />
  <span className="text-2xl font-bold">TaskFlow</span>
</div>
```

## Typography Utilities

### Tailwind Typography Classes

```tsx
<h1 className="text-2xl font-bold">        {/* 24px, bold */}
<h2 className="text-xl font-semibold">     {/* 20px, 600 */}
<h3 className="text-lg font-medium">       {/* 18px, 500 */}
<p className="text-base">                   {/* 16px, default */}
<span className="text-sm">                  {/* 14px */}
<span className="text-xs">                  {/* 12px */}
```

### Font Weights

```tsx
<span className="font-normal">    {/* 400 */}
<span className="font-medium">    {/* 500 */}
<span className="font-semibold">  {/* 600 */}
<span className="font-bold">      {/* 700 */}
```

### Line Heights

```tsx
<p className="leading-tight">    {/* 1.25 */}
<p className="leading-normal">   {/* 1.5 */}
<p className="leading-relaxed">  {/* 1.625 */}
<p className="leading-loose">    {/* 2 */}
```

## Constraints

1. **next/font/google required**: Import fonts from Next.js
2. **Fonts in lib/fonts.ts**: Font configurations in centralized file
3. **className application**: Apply fonts via className property
4. **Specify subsets**: Always include subsets: ["latin"]
5. **Specify weights**: Define weight array for Poppins
6. **Inter for body**: Use Inter as default body font
7. **Poppins for headings**: Use Poppins for titles and emphasis
8. **Variable fonts preferred**: Use Next.js variable fonts for optimization

## Performance

Next.js font optimization provides:
- **Automatic font subsetting**: Only includes used characters
- **Self-hosting**: Fonts served from your domain
- **Zero layout shift**: Font metrics included inline
- **Preloading**: Critical fonts preloaded
- **CSS optimization**: Font CSS inlined

## Tools and Technologies

- **next/font/google**: Next.js font optimization
- **Google Fonts**: Font source (Inter, Poppins)
- **Variable fonts**: Optimized font loading
