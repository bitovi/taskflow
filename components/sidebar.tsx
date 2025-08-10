"use client"

import { cn } from "@/lib/utils"
import { LayoutDashboard, CheckSquare, Kanban, Users, Settings, BarChart3 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AuthDropdown } from "./auth-dropdown"
import { poppins } from "@/lib/fonts"

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    title: "Board",
    href: "/board",
    icon: Kanban,
  },
  {
    title: "Team",
    href: "/team",
    icon: Users,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="pb-12 w-64 border-r bg-background-dark">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <CheckSquare className="h-6 w-6 mr-2 text-primary" />
              <h2 className={`text-lg font-semibold ${poppins.className}`}>TaskFlow</h2>
            </div>
            <AuthDropdown />
          </div>

          <div className="space-y-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {sidebarNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                      pathname === item.href && "bg-background text-primary",
                    )}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.title}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
