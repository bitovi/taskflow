# Next.js Pages Style Guide

## Unique Patterns in TaskFlow

### Page Structure Convention
Every page follows a consistent container structure with padding and responsive design:

```typescript
export default function PageName() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-3xl font-bold tracking-tight ${poppins.className}`}>Page Title</h2>
      </div>
      {/* Page content */}
    </div>
  )
}
```

### Header Pattern with Poppins Font
All pages use the same header structure with imported Poppins font:

```typescript
import { poppins } from "@/lib/fonts"

// Header usage
<h2 className={`text-3xl font-bold tracking-tight ${poppins.className}`}>Page Title</h2>
```

### Client vs Server Page Distinction
- **Server pages** (data fetching): No "use client" directive, use async functions
- **Client pages** (interactivity): Start with "use client" directive

### Server Page Pattern
```typescript
import { ComponentName } from "@/components/component-name"
import { getDataAction } from "./actions"

export default async function ServerPage() {
  const data = await getDataAction()
  return <ComponentName initialData={data} />
}
```

### Client Page Pattern
```typescript
"use client"

import { useState } from "react"
import { ComponentName } from "@/components/component-name"

export default function ClientPage() {
  const [state, setState] = useState()
  return <ComponentName />
}
```

### Card Wrapper Pattern
Pages consistently use Card components for content organization:

```typescript
<Card className="max-w-2xl">
  <CardHeader>
    <CardTitle>Section Title</CardTitle>
    <CardDescription>Section description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

### Navigation Integration
Client pages that need navigation use useRouter:

```typescript
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()
  
  const handleAction = () => {
    router.push("/target-route")
  }
}
```