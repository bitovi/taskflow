# Font Definitions Style Guide

## Unique Patterns in TaskFlow

### Google Fonts Import Pattern
Font definitions use Next.js Google Fonts with specific weight configurations:

```typescript
import { Poppins } from "next/font/google"

export const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"]
})
```

### Export Convention
Fonts are exported as named constants (not default exports):

```typescript
export const fontName = FontFunction({
    // configuration
})
```

### Weight Selection Pattern
Font weights are explicitly defined as string arrays rather than using ranges:

```typescript
weight: ["400", "500", "600", "700", "800", "900"]
// Not weight: "400..900"
```

### Subset Specification
All fonts specify Latin subset explicitly:

```typescript
subsets: ["latin"]
```

### Usage Pattern in Components
Fonts are imported and applied via className:

```typescript
import { poppins } from "@/lib/fonts"

// Usage
<h1 className={`text-2xl font-semibold ${poppins.className}`}>
  Heading Text
</h1>
```

### File Organization
Font definitions are centralized in `lib/fonts.ts` for reuse across components.

### Primary vs Secondary Fonts
- Root layout uses Inter from Google Fonts for body text
- Poppins is used for headings and emphasis elements
- Both fonts are imported separately where needed

### Configuration Consistency
All Google Font imports use consistent configuration structure:

```typescript
const fontVariable = FontName({
    subsets: ["latin"],
    weight: ["specific", "weights", "array"]
})
```