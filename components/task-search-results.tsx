"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { searchTasks, getAllUsers } from "@/app/(dashboard)/tasks/actions"
import { formatDateForDisplay } from "@/lib/date-utils"
import { poppins } from "@/lib/fonts"
import Link from "next/link"

import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithRelations = PrismaTask & {
  assignee?: Pick<User, "id" | "name" | "email"> | null
  creator?: Pick<User, "id" | "name" | "email"> | null
}

type SearchResults = {
  tasks: TaskWithRelations[]
  total: number
  page: number
  perPage: number
  totalPages: number
  error: string | null
}

export function TaskSearchResults() {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all")
  const [dueFilter, setDueFilter] = useState("any")
  const [currentPage, setCurrentPage] = useState(1)
  const [results, setResults] = useState<SearchResults>({
    tasks: [],
    total: 0,
    page: 1,
    perPage: 10,
    totalPages: 0,
    error: null,
  })
  const [users, setUsers] = useState<Pick<User, "id" | "name" | "email">[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
      setCurrentPage(1) // Reset to first page on new search
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch users for assignee dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      const { users: fetchedUsers } = await getAllUsers()
      setUsers(fetchedUsers)
    }
    fetchUsers()
  }, [])

  // Fetch tasks based on filters
  const fetchTasks = useCallback(async () => {
    setIsLoading(true)
    const assigneeId = assigneeFilter === "all" ? undefined : parseInt(assigneeFilter, 10)
    
    const result = await searchTasks({
      searchQuery: debouncedSearchQuery,
      status: statusFilter,
      assigneeId,
      dueFilter,
      page: currentPage,
      perPage: 10,
    })

    setResults(result)
    setIsLoading(false)
  }, [debouncedSearchQuery, statusFilter, assigneeFilter, dueFilter, currentPage])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const getInitials = (name: string | null | undefined) => {
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
      case "review":
        return "outline"
      default:
        return "outline"
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < results.totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search tasks by title, tag, or ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-3">
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Status:</span>
          <div className="flex gap-1">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setStatusFilter("all")
                setCurrentPage(1)
              }}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "todo" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setStatusFilter("todo")
                setCurrentPage(1)
              }}
            >
              Open
            </Button>
            <Button
              variant={statusFilter === "in_progress" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setStatusFilter("in_progress")
                setCurrentPage(1)
              }}
            >
              In Progress
            </Button>
            <Button
              variant={statusFilter === "blocked" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setStatusFilter("blocked")
                setCurrentPage(1)
              }}
            >
              Blocked
            </Button>
            <Button
              variant={statusFilter === "done" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setStatusFilter("done")
                setCurrentPage(1)
              }}
            >
              Done
            </Button>
          </div>
        </div>

        {/* Assignee Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Assignee:</span>
          <Select
            value={assigneeFilter}
            onValueChange={(value) => {
              setAssigneeFilter(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Due Date Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Due:</span>
          <div className="flex gap-1">
            <Button
              variant={dueFilter === "any" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setDueFilter("any")
                setCurrentPage(1)
              }}
            >
              Any
            </Button>
            <Button
              variant={dueFilter === "overdue" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setDueFilter("overdue")
                setCurrentPage(1)
              }}
            >
              Overdue
            </Button>
            <Button
              variant={dueFilter === "this_week" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setDueFilter("this_week")
                setCurrentPage(1)
              }}
            >
              This Week
            </Button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading tasks...</div>
      ) : results.tasks.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No tasks match your search
        </div>
      ) : (
        <>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium text-sm">Task</th>
                  <th className="text-left p-4 font-medium text-sm">Status</th>
                  <th className="text-left p-4 font-medium text-sm">Assignee</th>
                  <th className="text-left p-4 font-medium text-sm">Due</th>
                  <th className="text-left p-4 font-medium text-sm">Project</th>
                  <th className="text-left p-4 font-medium text-sm w-12"></th>
                </tr>
              </thead>
              <tbody>
                {results.tasks.map((task) => (
                  <tr key={task.id} className="border-t hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <div>
                        <div className={`font-medium ${poppins.className}`}>{task.name}</div>
                        <div className="text-sm text-muted-foreground">TASK-{task.id}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={getStatusBadgeVariant(task.status)} className="capitalize">
                        {task.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7 border-2 border-border">
                          <AvatarFallback className="text-xs font-medium">
                            {getInitials(task.assignee?.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{task.assignee?.name || "Unassigned"}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm">
                        {task.dueDate ? formatDateForDisplay(task.dueDate) : "—"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">TASK-{task.id}</span>
                    </td>
                    <td className="p-4">
                      <Link href={`/tasks/${task.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {results.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * results.perPage + 1} to{" "}
                {Math.min(currentPage * results.perPage, results.total)} of {results.total} tasks
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Prev
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {results.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === results.totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
