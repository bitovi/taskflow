# Next.js Layouts Style Guide

## Unique Patterns in TaskFlow

### Root Layout Structure
The root layout follows a minimal structure with Google Fonts integration:

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaskFlow",
  description: "Task management made easy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

### Dashboard Layout with Authentication
Protected layouts include server-side authentication and redirect logic:

```typescript
import { Sidebar } from "@/components/sidebar";
import { getCurrentUser } from "@/app/login/actions";
import { redirect } from "next/navigation";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
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

### Layout Specific CSS Classes
Layouts use specific utility classes for screen management:

- `flex h-screen overflow-hidden` - Full height container
- `flex-1 overflow-x-hidden overflow-y-auto` - Scrollable main content area
- `bg-background` - Theme-aware background color

### Authentication Pattern
All protected layouts check authentication before rendering:

1. Import `getCurrentUser` from login actions
2. Call `getCurrentUser()` at top of layout function  
3. Redirect to `/login` if no user found
4. Render layout with authenticated content

### Sidebar Integration
Dashboard layouts include the sidebar as a fixed element with proper flex layout for responsive design.