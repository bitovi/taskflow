# Auth Domain Implementation

## Session-Based Authentication

The application uses cookie-based sessions with database-stored tokens:

```typescript
// app/login/actions.ts
export async function login(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    if (!email) return { error: "Email is required." };
    if (!password) return { error: "Password is required." };

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return { error: "Invalid email or password." };
    }
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        return { error: "Invalid email or password." };
    }
    
    // Create session token
    const sessionToken = randomBytes(32).toString("hex");
    await prisma.session.create({
        data: {
            token: sessionToken,
            userId: user.id,
        },
    });
    
    // Set httpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set("session", sessionToken, { httpOnly: true, path: "/" });
    
    const { redirect } = await import("next/navigation");
    redirect("/");
}
```

## Password Hashing

All passwords are hashed using bcryptjs before storage:

```typescript
// app/signup/actions.ts
import bcrypt from "bcryptjs";

export async function signup(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    // Hash password before storage
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });

        // Auto-login after signup
        const sessionToken = randomBytes(32).toString("hex");
        await prisma.session.create({
            data: {
                token: sessionToken,
                userId: user.id,
            },
        });

        const cookieStore = await cookies();
        cookieStore.set("session", sessionToken, { httpOnly: true, path: "/" });
        
        redirect("/");
    } catch (error) {
        return { error: "Email already exists." };
    }
}
```

## Authentication Middleware

Authentication checks happen at the layout level using `getCurrentUser()`:

```typescript
// app/login/actions.ts
export async function getCurrentUser() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    if (!sessionToken) return null;

    const session = await prisma.session.findUnique({
        where: { token: sessionToken },
        include: { user: true },
    });

    return session?.user || null;
}

// app/(dashboard)/layout.tsx
export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
                {children}
            </main>
        </div>
    );
}
```

## Logout Implementation

Logout removes the session from database and clears the cookie:

```typescript
// app/login/actions.ts
export async function logout() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    
    if (sessionToken) {
        // Remove session from database
        await prisma.session.delete({
            where: { token: sessionToken },
        });
    }
    
    // Clear cookie
    cookieStore.delete("session");
    
    const { redirect } = await import("next/navigation");
    redirect("/login");
}
```

## Auth UI Components

Authentication forms use Server Actions with error handling:

```typescript
// app/login/page.tsx
"use client"

import { useActionState } from "react"
import { login } from "./actions"

export default function LoginPage() {
    const [state, formAction] = useActionState(login, { error: "" })

    return (
        <form action={formAction} className="space-y-4">
            <input
                name="email"
                type="email"
                placeholder="Email"
                className="w-full rounded-md border px-3 py-2"
                required
            />
            <input
                name="password"
                type="password"
                placeholder="Password"
                className="w-full rounded-md border px-3 py-2"
                required
            />
            
            {state.error && (
                <div className="text-red-500 text-sm">{state.error}</div>
            )}
            
            <button
                type="submit"
                className="w-full rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
            >
                Sign In
            </button>
        </form>
    )
}
```

## User Context in Components

Authenticated user information is available through Server Actions:

```typescript
// components/auth-dropdown.tsx
"use client"

import { logout } from "@/app/login/actions"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut } from "lucide-react"

export function AuthDropdown({ user }: { user: { name: string, email: string } }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
```

## Database Session Model

Sessions are stored in the database with automatic cleanup capabilities:

```prisma
model Session {
  id        Int      @id @default(autoincrement())
  token     String   @unique
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
}
```

This approach provides secure, server-side session management without client-side token storage vulnerabilities.