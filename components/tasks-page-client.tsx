"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { TaskList } from "@/components/task-list"

import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

interface TasksPageClientProps {
  initialTasks: TaskWithProfile[];
}

export function TasksPageClient({ initialTasks }: TasksPageClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter tasks based on search term and filters
  const filteredTasks = useMemo(() => {
    return initialTasks.filter((task) => {
      // Search filter - check task name and description
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = searchTerm === "" || 
        task.name.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)

      // Priority filter (normalize case)
      const matchesPriority = priorityFilter === "all" || 
        task.priority.toLowerCase() === priorityFilter.toLowerCase()

      // Status filter
      const matchesStatus = statusFilter === "all" || task.status === statusFilter

      return matchesSearch && matchesPriority && matchesStatus
    })
  }, [initialTasks, searchTerm, priorityFilter, statusFilter])

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            aria-label="Search tasks"
          />
        </div>

        {/* Priority Filter */}
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full md:w-[180px]" aria-label="Filter by priority">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]" aria-label="Filter by status">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="todo">Todo</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="review">Review</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredTasks.length} of {initialTasks.length} tasks
      </div>

      {/* Task List */}
      <TaskList initialTasks={filteredTasks} />
    </div>
  )
}
