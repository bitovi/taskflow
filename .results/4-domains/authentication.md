# Authentication Domain

## Overview

Authentication uses **session-based authentication** with database-stored sessions. Passwords are hashed with bcryptjs. Session tokens are stored in HTTP-only cookies.

## Required Patterns

### 1. getCurrentUser Check

All protected operations must call `getCurrentUser()`:

```typescript
// app/login/actions.ts
"use server"

import { cookies } from "next/headers"
import { PrismaClient } from "@/app/generated/prisma"

const prisma = new PrismaClient()

export async function getCurrentUser() {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value
    if (!sessionToken) return null
    
    const session = await prisma.session.findUnique({
        where: { token: sessionToken },
        include: { user: true },
    })
    
    return session?.user || null
}
```

Pattern: Returns `User | null`, never throws.

### 2. Session Token Generation

Generate cryptographically secure session tokens:

```typescript
// app/login/actions.ts
import { randomBytes } from "crypto"

export async function login(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    
    // Validate credentials
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return { error: "Invalid email or password." }
    
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return { error: "Invalid email or password." }
    
    // Create session
    const sessionToken = randomBytes(32).toString("hex")
    await prisma.session.create({
        data: {
            token: sessionToken,
            userId: user.id,
        },
    })
    
    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set("session", sessionToken, {
        httpOnly: true,
        path: "/",
    })
    
    // Redirect
    const { redirect } = await import("next/navigation")
    redirect("/")
}
```

Pattern: Use `randomBytes(32).toString("hex")` for session tokens.

### 3. bcrypt Password Hashing

Hash passwords before storing:

```typescript
// app/signup/actions.ts
import bcrypt from "bcryptjs"

export async function signup(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Create user
    await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
        },
    })
}
```

Pattern: Use `bcrypt.hash(password, 10)` with 10 salt rounds.

### 4. Cookie-Based Sessions

Store session tokens in HTTP-only cookies:

```typescript
// app/login/actions.ts
import { cookies } from "next/headers"

export async function login(formData: FormData) {
    // ... authenticate user
    
    const cookieStore = await cookies()
    const headers = await import('next/headers').then(m => m.headers())
    const userAgent = (await headers).get('user-agent') || ''
    const isVSCode = userAgent.includes('Code/') && userAgent.includes('Electron/')

    if (isVSCode) {
        // VS Code Simple Browser
        cookieStore.set("session", sessionToken, {
            httpOnly: true,
            path: "/",
            sameSite: "none",
            secure: true,
            partitioned: true,
        })
    } else {
        // Normal browsers
        cookieStore.set("session", sessionToken, {
            httpOnly: true,
            path: "/",
        })
    }
}
```

Pattern: Different cookie settings for VS Code Simple Browser vs. normal browsers.

### 5. Logout Flow

Delete session from database and clear cookie:

```typescript
// app/login/actions.ts
export async function logout() {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value
    
    if (sessionToken) {
        // Delete from database
        await prisma.session.deleteMany({ where: { token: sessionToken } })
        
        // Clear cookie
        const headers = await import('next/headers').then(m => m.headers())
        const userAgent = (await headers).get('user-agent') || ''
        const isVSCode = userAgent.includes('Code/') && userAgent.includes('Electron/')

        if (isVSCode) {
            cookieStore.set("session", "", {
                maxAge: 0,
                path: "/",
                sameSite: "none",
                secure: true,
                partitioned: true,
            })
        } else {
            cookieStore.set("session", "", {
                maxAge: 0,
                path: "/",
            })
        }
    }
    
    const { redirect } = await import("next/navigation")
    redirect("/login")
}
```

Pattern: Delete session from DB, set cookie maxAge to 0, redirect to login.

### 6. Protected Routes

Protect routes in layout:

```tsx
// app/(dashboard)/layout.tsx
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/login/actions"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
```

Pattern: Check auth in layout to protect all child routes.

## Database Models

### User Model

```prisma
model User {
  id            Int @id @default(autoincrement())
  email         String @unique
  password      String
  name          String
  sessions      Session[]
  createdTasks  Task[] @relation("CreatedTasks")
  assignedTasks Task[] @relation("AssignedTasks")
}
```

Fields:
- `email`: Unique, used for login
- `password`: bcrypt hashed
- `name`: Display name
- `sessions`: Related sessions

### Session Model

```prisma
model Session {
  id        Int      @id @default(autoincrement())
  token     String   @unique
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
}
```

Fields:
- `token`: Session token (unique)
- `userId`: Foreign key to User
- `createdAt`: Session creation time

## Complete Login Flow

```typescript
// app/login/actions.ts
"use server"

import { cookies } from "next/headers"
import { PrismaClient } from "@/app/generated/prisma"
import bcrypt from "bcryptjs"
import { randomBytes } from "crypto"

const prisma = new PrismaClient()

export async function login(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    
    // Validate input
    if (!email) return { error: "Email is required." }
    if (!password) return { error: "Password is required." }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
        return { error: "Invalid email or password." }
    }
    
    // Verify password
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
        return { error: "Invalid email or password." }
    }
    
    // Create session
    const sessionToken = randomBytes(32).toString("hex")
    await prisma.session.create({
        data: {
            token: sessionToken,
            userId: user.id,
        },
    })
    
    // Set cookie
    const cookieStore = await cookies()
    const headers = await import('next/headers').then(m => m.headers())
    const userAgent = (await headers).get('user-agent') || ''
    const isVSCode = userAgent.includes('Code/') && userAgent.includes('Electron/')

    if (isVSCode) {
        cookieStore.set("session", sessionToken, {
            httpOnly: true,
            path: "/",
            sameSite: "none",
            secure: true,
            partitioned: true,
        })
    } else {
        cookieStore.set("session", sessionToken, {
            httpOnly: true,
            path: "/",
        })
    }
    
    // Redirect to dashboard
    const { redirect } = await import("next/navigation")
    redirect("/")
}
```

## Complete Signup Flow

```typescript
// app/signup/actions.ts
"use server"

import { PrismaClient } from "@/app/generated/prisma"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function signup(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string
    
    // Validate input
    if (!email) return { error: "Email is required." }
    if (!password) return { error: "Password is required." }
    if (!name) return { error: "Name is required." }
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
        return { error: "User with this email already exists." }
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Create user
    try {
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        })
        
        // Redirect to login
        const { redirect } = await import("next/navigation")
        redirect("/login")
    } catch (e) {
        return { error: "Failed to create user." }
    }
}
```

## Auth Component

```tsx
// components/auth-dropdown.tsx
"use client"

import { logout } from "@/app/login/actions"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarName } from "@/components/ui/avatar"
import { LogOut } from "lucide-react"

export function AuthDropdown({ user }: { user: { name: string; email: string } }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarName name={user.name} />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => logout()}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## Constraints

1. **Session-based only**: No JWT tokens
2. **Database sessions**: Sessions stored in PostgreSQL
3. **HTTP-only cookies**: Never expose session token to JavaScript
4. **bcryptjs for hashing**: 10 salt rounds
5. **randomBytes for tokens**: 32 bytes, hex encoded
6. **getCurrentUser pattern**: Returns User | null
7. **No OAuth**: Only email/password authentication
8. **Protected routes via layout**: Check auth in layout component
9. **VS Code browser handling**: Special cookie settings for embedded browsers
10. **User model required**: Must have id, email, password, name fields

## Security Considerations

- **Password never returned**: Never include password in user queries
- **Generic error messages**: "Invalid email or password" (don't reveal which)
- **HTTP-only cookies**: Session token not accessible via JavaScript
- **Secure flag for production**: Should set `secure: true` in production
- **Session cleanup**: Should implement session expiration (not currently implemented)

## Tools and Libraries

- **bcryptjs**: Password hashing
- **crypto (Node.js)**: Session token generation
- **next/headers**: Cookie management
- **Prisma**: Session and user storage
