# Forms Domain

## Overview

Forms use **native HTML forms with FormData and server actions**. No react-hook-form or other form libraries. Controlled inputs use React useState for client-side state.

## Required Patterns

### 1. Server Action with FormData

Server actions receive FormData parameter:

```typescript
// app/(dashboard)/tasks/actions.ts
"use server"

export async function createTask(formData: FormData) {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const priority = formData.get("priority") as string
    const status = formData.get("status") as string
    const dueDate = formData.get("dueDate") as string
    const assigneeId = formData.get("assigneeId") as string

    if (!title) return { error: "Title is required.", success: false }

    try {
        await prisma.task.create({
            data: {
                name: title,
                description,
                priority,
                status,
                dueDate: dueDate ? parseDateString(dueDate) : null,
                assigneeId: assigneeId ? parseInt(assigneeId) : null,
                creatorId: user.id,
            },
        })
        revalidatePath("/tasks")
        return { error: null, success: true, message: "Task created successfully!" }
    } catch (e) {
        return { error: "Failed to create task.", success: false }
    }
}
```

Pattern: Use `formData.get('fieldName')` to extract values.

### 2. Form with Action Attribute

Forms use `action` attribute pointing to server action:

```tsx
// Uncontrolled form (server-only)
import { createTask } from "./actions"

export default function NewTaskPage() {
  return (
    <form action={createTask}>
      <input name="title" required />
      <textarea name="description" />
      <button type="submit">Create Task</button>
    </form>
  )
}
```

Pattern: Pass server action directly to form `action` attribute.

### 3. Controlled Inputs for Client Interactivity

Client forms use controlled inputs with useState:

```tsx
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function TaskForm() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  return (
    <form>
      <Input
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </form>
  )
}
```

Pattern: One `useState` per form field.

### 4. Field Name Mapping

Form field names may differ from model fields:

```typescript
// Form field "title" maps to model field "name"
export async function createTask(formData: FormData) {
    const title = formData.get("title") as string  // Form uses "title"
    
    await prisma.task.create({
        data: {
            name: title,  // Model uses "name"
            // ...
        },
    })
}
```

Pattern: Extract with form name, save with model name.

### 5. Date Parsing

Dates are parsed with custom utility:

```typescript
// lib/date-utils.ts
export function parseDateString(dateStr: string): Date | null {
    if (!dateStr) return null
    const date = new Date(dateStr)
    return isNaN(date.getTime()) ? null : date
}
```

```typescript
// app/(dashboard)/tasks/actions.ts
import { parseDateString } from "@/lib/date-utils"

export async function createTask(formData: FormData) {
    const dueDate = formData.get("dueDate") as string
    
    await prisma.task.create({
        data: {
            dueDate: dueDate ? parseDateString(dueDate) : null,
            // ...
        },
    })
}
```

Pattern: Use `parseDateString()` for date fields.

### 6. Server-Side Validation

Validation happens in server actions:

```typescript
export async function createTask(formData: FormData) {
    const title = formData.get("title") as string
    const email = formData.get("email") as string
    
    // Validate required fields
    if (!title) return { error: "Title is required.", success: false }
    
    // Validate format
    if (email && !email.includes("@")) {
        return { error: "Invalid email format.", success: false }
    }
    
    // Validate length
    if (title.length > 200) {
        return { error: "Title too long.", success: false }
    }
    
    try {
        await prisma.task.create({ data: { name: title } })
        revalidatePath("/tasks")
        return { error: null, success: true, message: "Task created!" }
    } catch (e) {
        return { error: "Failed to create task.", success: false }
    }
}
```

Pattern: Validate in server action, return error messages in result object.

### 7. Error Handling in Client

Display errors from server action result:

```tsx
"use client"

import { useState } from "react"
import { createTask } from "@/app/(dashboard)/tasks/actions"

export function CreateTaskForm() {
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    const result = await createTask(formData)
    
    if (result.error) {
      setError(result.error)
    } else {
      // Success - maybe clear form or show toast
    }
    
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input name="title" />
      {error && <p className="text-destructive text-sm">{error}</p>}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Task"}
      </Button>
    </form>
  )
}
```

Pattern: Check `result.error`, display to user.

## Form Submission Patterns

### Uncontrolled Form (Server-Only)

```tsx
// No client JavaScript needed
import { createTask } from "./actions"

export default function NewTaskPage() {
  return (
    <form action={createTask}>
      <input name="title" placeholder="Task title" required />
      <textarea name="description" placeholder="Description" />
      <select name="priority">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button type="submit">Create Task</button>
    </form>
  )
}
```

Use when: No client-side validation or interactivity needed.

### Controlled Form (Client)

```tsx
"use client"

import { useState, FormEvent } from "react"
import { createTask } from "@/app/(dashboard)/tasks/actions"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function CreateTaskForm() {
  const [title, setTitle] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    
    const formData = new FormData(e.currentTarget)
    const result = await createTask(formData)
    
    if (result.error) {
      setError(result.error)
    } else {
      setTitle("") // Reset form
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
      />
      {error && <p className="text-destructive">{error}</p>}
      <Button type="submit">Create Task</Button>
    </form>
  )
}
```

Use when: Need client-side interactivity, validation, or state management.

## Field Types

### Text Input

```tsx
<Input
  name="title"
  type="text"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  placeholder="Enter title"
/>
```

### Textarea

```tsx
<Textarea
  name="description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  placeholder="Enter description"
/>
```

### Select Dropdown

```tsx
<Select name="priority" value={priority} onValueChange={setPriority}>
  <SelectTrigger>
    <SelectValue placeholder="Select priority" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="low">Low</SelectItem>
    <SelectItem value="medium">Medium</SelectItem>
    <SelectItem value="high">High</SelectItem>
  </SelectContent>
</Select>
```

### Date Input

```tsx
<Input
  name="dueDate"
  type="date"
  value={dueDate}
  onChange={(e) => setDueDate(e.target.value)}
/>
```

### Checkbox

```tsx
<Checkbox
  name="completed"
  checked={completed}
  onCheckedChange={setCompleted}
/>
```

## Real-World Example: Complete Task Form

```tsx
"use client"

import { useState, FormEvent } from "react"
import { createTask } from "@/app/(dashboard)/tasks/actions"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function CreateTaskForm({ users }: { users: User[] }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("medium")
  const [status, setStatus] = useState("todo")
  const [dueDate, setDueDate] = useState("")
  const [assigneeId, setAssigneeId] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    const result = await createTask(formData)
    
    if (result.error) {
      setError(result.error)
    } else {
      // Reset form
      setTitle("")
      setDescription("")
      setPriority("medium")
      setStatus("todo")
      setDueDate("")
      setAssigneeId("")
    }
    
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
        />
      </div>

      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select name="priority" value={priority} onValueChange={setPriority}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select name="status" value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="review">Review</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          name="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="assigneeId">Assignee</Label>
        <Select name="assigneeId" value={assigneeId} onValueChange={setAssigneeId}>
          <SelectTrigger>
            <SelectValue placeholder="Select assignee" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.id} value={String(user.id)}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && (
        <p className="text-destructive text-sm">{error}</p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Task"}
      </Button>
    </form>
  )
}
```

## Constraints

1. **No react-hook-form**: Use native HTML forms
2. **FormData for server actions**: Extract values with `formData.get()`
3. **Server-side validation**: Validate in server actions, not client
4. **Return error objects**: `{ error, success, message? }` pattern
5. **Field name mapping**: Form names may differ from model fields
6. **Date parsing utility**: Use `parseDateString()` for dates
7. **Controlled inputs for client**: Use useState for interactive forms
8. **action attribute**: Can pass server action directly to form

## Tools and Patterns

- **FormData API**: Native form data extraction
- **Server Actions**: Form submission handlers
- **useState**: Controlled input state
- **parseDateString**: Date field parsing
- **revalidatePath**: Cache invalidation after mutations
