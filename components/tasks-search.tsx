"use client"

import { useState, useEffect, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { searchTasks } from "@/app/(dashboard)/tasks/actions"
import { formatDateForDisplay } from "@/lib/date-utils"
import { poppins } from "@/lib/fonts"

import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "id" | "name" | "email"> | null
  creator?: Pick<User, "id" | "name" | "email"> | null
}

type TasksSearchProps = {
  initialTasks: TaskWithProfile[]
  users: Pick<User, "id" | "name" | "email">[]
}

export function TasksSearch({ initialTasks, users }: TasksSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [assigneeFilter, setAssigneeFilter] = useState("all")
  const [dueFilter, setDueFilter] = useState("any")
  const [tasks, setTasks] = useState(initialTasks)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isPending, startTransition] = useTransition()

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(async () => {
        const result = await searchTasks({
          searchQuery,
          statusFilter,
          assigneeFilter,
          dueFilter,
          page: currentPage,
          pageSize: 10,
        })
        
        if (!result.error) {
          setTasks(result.tasks)
          setTotalPages(result.pagination.totalPages)
        }
      })
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, statusFilter, assigneeFilter, dueFilter, currentPage])

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    setCurrentPage(1)
  }

  const handleDueFilter = (due: string) => {
    setDueFilter(due)
    setCurrentPage(1)
  }

  const getInitials = (name: string | null) => {
    if (!name) return "??"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "done":
        return "default"
      case "in_progress":
        return "secondary"
      case "blocked":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks by title, tag, or ID"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentPage(1)
          }}
          className="pl-10"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-4">
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Status:</span>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => handleStatusFilter("all")}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "todo" ? "default" : "outline"}
              size="sm"
              onClick={() => handleStatusFilter("todo")}
            >
              Open
            </Button>
            <Button
              variant={statusFilter === "in_progress" ? "default" : "outline"}
              size="sm"
              onClick={() => handleStatusFilter("in_progress")}
            >
              In Progress
            </Button>
            <Button
              variant={statusFilter === "blocked" ? "default" : "outline"}
              size="sm"
              onClick={() => handleStatusFilter("blocked")}
            >
              Blocked
            </Button>
            <Button
              variant={statusFilter === "done" ? "default" : "outline"}
              size="sm"
              onClick={() => handleStatusFilter("done")}
            >
              Done
            </Button>
          </div>
        </div>

        {/* Assignee Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Assignee:</span>
          <Select value={assigneeFilter} onValueChange={(value) => {
            setAssigneeFilter(value)
            setCurrentPage(1)
          }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All assignees" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All assignees</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Due Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Due:</span>
          <div className="flex gap-2">
            <Button
              variant={dueFilter === "any" ? "default" : "outline"}
              size="sm"
              onClick={() => handleDueFilter("any")}
            >
              Any
            </Button>
            <Button
              variant={dueFilter === "overdue" ? "default" : "outline"}
              size="sm"
              onClick={() => handleDueFilter("overdue")}
            >
              Overdue
            </Button>
            <Button
              variant={dueFilter === "this_week" ? "default" : "outline"}
              size="sm"
              onClick={() => handleDueFilter("this_week")}
            >
              This Week
            </Button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Task</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Assignee</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Due</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Project</th>
                <th className="px-6 py-3 text-left text-sm font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No tasks match your search
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${poppins.className}`}>{task.name}</span>
                          <Badge variant="outline" className="text-xs">
                            TASK-{task.id}
                          </Badge>
                        </div>
                        {task.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusBadgeVariant(task.status)} className="capitalize">
                        {task.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7 border-2 border-border">
                          <AvatarFallback className="text-xs font-medium">
                            {getInitials(task.assignee?.name || null)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{task.assignee?.name || "Unassigned"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">
                        {task.dueDate ? formatDateForDisplay(task.dueDate) : "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">-</span>
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                        <span className="cursor-pointer">
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {tasks.length > 0 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || isPending}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Prev
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || isPending}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}
