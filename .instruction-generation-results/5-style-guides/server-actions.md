# Server Actions Style Guide

## Unique Patterns in TaskFlow

### Server Action Header Convention
All server actions start with identical boilerplate:

```typescript
"use server";

import { getCurrentUser } from "@/app/login/actions";
import { PrismaClient } from "@/app/generated/prisma";
import { revalidatePath } from "next/cache";
import { parseDateString } from "@/lib/date-utils";

const prisma = new PrismaClient();
```

### Authentication Check Pattern
Every action that requires authentication follows this exact pattern:

```typescript
export async function actionName(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) return { error: "Not authenticated.", success: false, message: "Not authenticated." };
    
    // Action implementation
}
```

### FormData Extraction Pattern
Consistent pattern for extracting form data with type casting:

```typescript
const name = formData.get("title") as string; // Note: form uses 'title' but model uses 'name'
const description = formData.get("description") as string;
const priority = formData.get("priority") as string;
const assigneeIdRaw = formData.get("assigneeId") as string;
const assigneeId = assigneeIdRaw ? parseInt(assigneeIdRaw, 10) : null;
```

### Date Handling Convention
All date inputs are processed through the custom date utility:

```typescript
const dueDate = formData.get("dueDate") as string;
// In data creation
dueDate: dueDate ? parseDateString(dueDate) : null,
```

### Error Response Format
All actions return a consistent response format:

```typescript
// Success response
return { success: true, message: "Action completed successfully." };

// Error response
return { error: "Error message.", success: false, message: "Error message." };

// Validation error
if (!name) return { error: "Title is required.", success: false, message: "Title is required." };
```

### Try-Catch with Revalidation Pattern
Database operations follow this pattern:

```typescript
try {
    await prisma.model.action({
        // operation details
    });
    
    revalidatePath("/relevant-path");
    return { success: true, message: "Success message." };
} catch (error) {
    console.error("Error description:", error);
    return { error: "Failed to perform action.", success: false };
}
```

### Query Pattern with Relationships
Data fetching includes consistent relationship patterns:

```typescript
const tasks = await prisma.task.findMany({
    include: {
        assignee: {
            select: {
                name: true,
            },
        },
    },
    orderBy: {
        createdAt: "desc",
    },
});
```

### User ID Assignment Pattern
Tasks consistently use the authenticated user's ID:

```typescript
const user = await getCurrentUser();
const creatorId = user.id;

// In create operations
data: {
    // ... other fields
    creatorId,
    assigneeId,
}
```