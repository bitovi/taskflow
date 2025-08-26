"use client"

import { useState, useTransition, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { getFilteredTasks } from "@/app/(dashboard)/tasks/actions"
import { TaskList } from "@/components/task-list"

import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

interface TaskSearchFilterProps {
  initialTasks: TaskWithProfile[];
}

export function TaskSearchFilter({ initialTasks }: TaskSearchFilterProps) {
  const [searchText, setSearchText] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [filteredTasks, setFilteredTasks] = useState(initialTasks)
  const [isPending, startTransition] = useTransition()

  const performSearch = useCallback(async (text: string, priority: string, status: string) => {
    startTransition(async () => {
      const { tasks } = await getFilteredTasks(
        text || undefined,
        priority === "all" ? undefined : priority,
        status === "all" ? undefined : status
      )
      setFilteredTasks(tasks || [])
    })
  }, [])

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchText, priorityFilter, statusFilter)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchText, priorityFilter, statusFilter, performSearch])

  const handleSearchChange = (value: string) => {
    setSearchText(value)
  }

  const handlePriorityChange = (value: string) => {
    setPriorityFilter(value)
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks by name or description..."
            value={searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Priority Filter */}
        <Select value={priorityFilter} onValueChange={handlePriorityChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Statuses" />
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

      {/* Task List */}
      {isPending ? (
        <div className="text-center py-8 text-muted-foreground">Searching tasks...</div>
      ) : (
        <TaskList initialTasks={filteredTasks} />
      )}
    </div>
  )
}