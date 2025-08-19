# Utility Functions Style Guide

## Unique Patterns in TaskFlow

### Class Name Utility Convention
The `cn` utility function follows a simple filtering approach:

```typescript
// lib/utils.ts
export function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(" ");
}
```

### Date Utility Functions Structure
Date utilities focus on timezone-safe operations:

```typescript
/**
 * Utility functions for consistent date handling across the application
 */

/**
 * Convert a date string (YYYY-MM-DD) to a Date object at local noon
 * This prevents timezone issues when storing and displaying dates
 */
export function parseDateString(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day, 12, 0, 0) // month is 0-indexed, set to noon
}
```

### Documentation Convention
All date utilities include detailed JSDoc comments explaining timezone handling:

```typescript
/**
 * Convert a Date object to YYYY-MM-DD string format
 * Uses local date components to avoid timezone shifts
 */
export function formatDateForInput(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const day = String(dateObj.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}
```

### Flexible Input Types
Date functions accept both Date objects and strings:

```typescript
export function formatDateForDisplay(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    // Implementation
}
```

### Hardcoded Constants Pattern
Date utilities use inline constants rather than imports:

```typescript
// Get month names
const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]
```

### Timezone Safety Focus
All date operations explicitly handle timezone issues by:
- Setting dates to noon (12:00) to avoid DST problems
- Using local date components instead of UTC
- Clear documentation about timezone behavior

### Export Pattern
Utility functions are exported as named exports without default export.