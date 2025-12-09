"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { formatDateForDisplay } from "@/lib/date-utils"
import Link from "next/link"

import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "id" | "name"> | null
}

type TasksSearchProps = {
  initialTasks: TaskWithProfile[]
  users: Pick<User, "id" | "name">[]
}

const ITEMS_PER_PAGE = 10

export function TasksSearch({ initialTasks, users }: TasksSearchProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [assigneeFilter, setAssigneeFilter] = useState("all")
  const [dueFilter, setDueFilter] = useState("any")
  const [currentPage, setCurrentPage] = useState(1)

  // Filter tasks based on all filters
  const filteredTasks = useCallback(() => {
    let filtered = [...tasks]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((task) => {
        const matchesName = task.name.toLowerCase().includes(query)
        const matchesDescription = task.description?.toLowerCase().includes(query)
        const matchesId = task.id.toString().includes(query)
        return matchesName || matchesDescription || matchesId
      })
    }

    // Status filter
    if (statusFilter !== "all") {
      if (statusFilter === "open") {
        filtered = filtered.filter((task) =>
          ["todo", "in_progress", "review"].includes(task.status)
        )
      } else if (statusFilter === "blocked") {
        // Blocked status handling - would need to be added to the schema if required
        filtered = filtered.filter((task) => task.status === "blocked")
      } else {
        filtered = filtered.filter((task) => task.status === statusFilter)
      }
    }

    // Assignee filter
    if (assigneeFilter !== "all") {
      filtered = filtered.filter(
        (task) => task.assigneeId?.toString() === assigneeFilter
      )
    }

    // Due date filter
    if (dueFilter !== "any") {
      const now = new Date()
      if (dueFilter === "overdue") {
        filtered = filtered.filter(
          (task) =>
            task.dueDate &&
            new Date(task.dueDate) < now &&
            task.status !== "done"
        )
      } else if (dueFilter === "this_week") {
        const endOfWeek = new Date(now)
        endOfWeek.setDate(now.getDate() + 7)
        filtered = filtered.filter(
          (task) =>
            task.dueDate &&
            new Date(task.dueDate) >= now &&
            new Date(task.dueDate) <= endOfWeek
        )
      }
    }

    return filtered
  }, [tasks, searchQuery, statusFilter, assigneeFilter, dueFilter])

  const filtered = filteredTasks()
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedTasks = filtered.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, assigneeFilter, dueFilter])

  // Sync with server updates
  useEffect(() => {
    setTasks(initialTasks)
  }, [initialTasks])

  const getInitials = (name: string | null) => {
    if (!name) return "??"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, string> = {
      todo: "Open",
      in_progress: "In progress",
      review: "In progress",
      done: "Done",
    }
    return statusMap[status] || status
  }

  const getStatusVariant = (status: string) => {
    if (status === "done") return "default"
    if (status === "in_progress" || status === "review") return "secondary"
    return "outline"
  }

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tasks by title, tag, or ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-4">
        {/* Status Filter */}
        <div className="flex gap-2 items-center">
          <span className="text-sm font-medium">Status</span>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "open" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("open")}
            >
              Open
            </Button>
            <Button
              variant={statusFilter === "in_progress" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("in_progress")}
            >
              In progress
            </Button>
            <Button
              variant={statusFilter === "blocked" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("blocked")}
            >
              Blocked
            </Button>
            <Button
              variant={statusFilter === "done" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("done")}
            >
              Done
            </Button>
          </div>
        </div>

        {/* Assignee Filter */}
        <div className="flex gap-2 items-center">
          <span className="text-sm font-medium">Assignee</span>
          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All assignees" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All assignees</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Due Filter */}
        <div className="flex gap-2 items-center">
          <span className="text-sm font-medium">Due</span>
          <div className="flex gap-2">
            <Button
              variant={dueFilter === "any" ? "default" : "outline"}
              size="sm"
              onClick={() => setDueFilter("any")}
            >
              Any
            </Button>
            <Button
              variant={dueFilter === "overdue" ? "default" : "outline"}
              size="sm"
              onClick={() => setDueFilter("overdue")}
            >
              Overdue
            </Button>
            <Button
              variant={dueFilter === "this_week" ? "default" : "outline"}
              size="sm"
              onClick={() => setDueFilter("this_week")}
            >
              This week
            </Button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      {paginatedTasks.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          No tasks match your search
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Project</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{task.name}</div>
                      <div className="text-xs text-muted-foreground">
                        TASK-{task.id}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(task.status)}>
                      {getStatusDisplay(task.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {getInitials(task.assignee?.name || null)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">
                        {task.assignee?.name || "Unassigned"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {task.dueDate ? (
                      <span className="text-sm">
                        {formatDateForDisplay(task.dueDate)}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">-</span>
                  </TableCell>
                  <TableCell>
                    <Link href={`/tasks/${task.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
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
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
