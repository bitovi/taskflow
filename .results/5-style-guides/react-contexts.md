# React Contexts Style Guide

## Unique Conventions

### 1. "use client" for Context Provider

Context provider is a client component:

```tsx
"use client"

import { createContext, useContext, ReactNode } from "react"

const SessionContext = createContext<SessionContextType | null>(null)
```

**Why unique**: Context requires client boundary even when data is from server.

### 2. Server-Fetched Props Pattern

Context receives server data via props:

```tsx
export function SessionProvider({ children, user }: { children: ReactNode; user: User | null }) {
  return (
    <SessionContext.Provider value={{ user }}>
      {children}
    </SessionContext.Provider>
  )
}
```

**Why unique**: Data fetched on server, passed down to client context.

### 3. Custom Hook with Error Handling

Context access via custom hook with error:

```tsx
export function useSession() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider")
  }
  return context
}
```

**Why unique**: Mandatory custom hook with error checking.

### 4. Type Definition Pattern

Context type explicitly defined:

```tsx
type SessionContextType = {
  user: User | null
}

const SessionContext = createContext<SessionContextType | null>(null)
```

**Why unique**: Context typed as `Type | null` for uninitialized state.

## File Structure

Contexts in `lib/`:

```
lib/
└── session-context.tsx
```

## Key Takeaways

1. Mark context providers with "use client"
2. Receive server-fetched data via props
3. Provide custom hook for context access with error checking
4. Type context as `Type | null` for safety
5. Locate in `lib/` directory
