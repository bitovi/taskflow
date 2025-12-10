"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { TasksSearchTable } from "@/components/tasks-search-table"
import { poppins } from "@/lib/fonts"
import { searchTasks } from "@/app/(dashboard)/tasks/actions"
import { getAllUsers } from "@/app/login/actions"

import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

export function TasksPageClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [status, setStatus] = useState(searchParams.get("status") || "all")
  const [assigneeId, setAssigneeId] = useState(searchParams.get("assignee") || "all")
  const [dueFilter, setDueFilter] = useState(searchParams.get("due") || "any")
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1)
  
  const [tasks, setTasks] = useState<TaskWithProfile[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<Pick<User, "id" | "name">[]>([])

  // Fetch users on mount
  useEffect(() => {
    getAllUsers().then(setUsers)
  }, [])

  // Fetch tasks whenever filters change
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true)
      const result = await searchTasks({
        searchQuery,
        status,
        assigneeId,
        dueFilter,
        page: currentPage,
        pageSize: 10,
      })
      
      if (!result.error) {
        setTasks(result.tasks)
        setTotalPages(result.totalPages)
      }
      setLoading(false)
    }

    fetchTasks()
  }, [searchQuery, status, assigneeId, dueFilter, currentPage])

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set("search", searchQuery)
    if (status !== "all") params.set("status", status)
    if (assigneeId !== "all") params.set("assignee", assigneeId)
    if (dueFilter !== "any") params.set("due", dueFilter)
    if (currentPage > 1) params.set("page", currentPage.toString())
    
    const paramsString = params.toString()
    router.replace(`/tasks${paramsString ? `?${paramsString}` : ""}`)
  }, [searchQuery, status, assigneeId, dueFilter, currentPage, router])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1) // Reset to first page on search
  }

  const handleStatusChange = (value: string) => {
    setStatus(value)
    setCurrentPage(1)
  }

  const handleAssigneeChange = (value: string) => {
    setAssigneeId(value)
    setCurrentPage(1)
  }

  const handleDueChange = (value: string) => {
    setDueFilter(value)
    setCurrentPage(1)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-3xl font-bold tracking-tight ${poppins.className}`}>Tasks</h2>
        <Link href="/tasks/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </Link>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks by title, description, or ID"
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Status:</span>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="todo">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Assignee:</span>
          <Select value={assigneeId} onValueChange={handleAssigneeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
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

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Due:</span>
          <Select value={dueFilter} onValueChange={handleDueChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="this_week">This Week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Table */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      ) : (
        <TasksSearchTable
          tasks={tasks}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}
