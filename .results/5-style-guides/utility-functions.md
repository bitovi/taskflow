# Utility Functions Style Guide

## Unique Conventions

### 1. cn() Utility Pattern

Uses clsx + tailwind-merge for className composition:

```tsx
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Why unique**: `twMerge` prevents Tailwind class conflicts, used universally.

### 2. parseDateString() for Date Handling

Converts date strings to Date objects:

```tsx
export function parseDateString(dateString: string | undefined): Date | undefined {
  if (!dateString) return undefined
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? undefined : date
}
```

**Why unique**: Explicit undefined handling for form date fields.

### 3. formatDate() for Display

Formats dates for UI display:

```tsx
export function formatDate(date: Date | string | undefined): string {
  if (!date) return "No date"
  const d = typeof date === "string" ? new Date(date) : date
  return format(d, "MMM d, yyyy")
}
```

**Why unique**: date-fns format with fallback to "No date".

## File Structure

Utilities in `lib/`:

```
lib/
├── utils.ts        # cn() utility
└── date-utils.ts   # Date helpers
```

## Key Takeaways

1. Use `cn()` for all className composition (never manual concat)
2. `cn()` combines clsx and tailwind-merge to prevent conflicts
3. Date parsing returns `undefined` for invalid dates (not throw)
4. Date formatting has explicit fallback string
5. Locate in `lib/` directory
