"use client"

import { useState } from "react"
import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"

interface User {
  id: number;
  name: string;
  email: string;
}

interface TasksSearchFilterProps {
  users: User[];
}

export function TasksSearchFilter({ users }: TasksSearchFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [status, setStatus] = useState(searchParams.get("status") || "all")
  const [priority, setPriority] = useState(searchParams.get("priority") || "all")
  const [assigneeId, setAssigneeId] = useState(searchParams.get("assigneeId") || "all")

  const updateURL = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === "" || value === "all") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    
    const query = params.toString()
    router.push(`/tasks${query ? `?${query}` : ""}`)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    updateURL({ search: value, status, priority, assigneeId })
  }

  const handleStatusChange = (value: string) => {
    setStatus(value)
    updateURL({ search, status: value, priority, assigneeId })
  }

  const handlePriorityChange = (value: string) => {
    setPriority(value)
    updateURL({ search, status, priority: value, assigneeId })
  }

  const handleAssigneeChange = (value: string) => {
    setAssigneeId(value)
    updateURL({ search, status, priority, assigneeId: value })
  }

  const clearFilters = () => {
    setSearch("")
    setStatus("all")
    setPriority("all")
    setAssigneeId("all")
    router.push("/tasks")
  }

  const hasActiveFilters = search || status !== "all" || priority !== "all" || assigneeId !== "all"

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tasks by name or description..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filters:</span>
        </div>

        {/* Status Filter */}
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="todo">Todo</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="review">Review</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select value={priority} onValueChange={handlePriorityChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        {/* Assignee Filter */}
        <Select value={assigneeId} onValueChange={handleAssigneeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Assignee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignees</SelectItem>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id.toString()}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="text-sm text-muted-foreground">
          Showing filtered results
          {search && <span> • Search: &quot;{search}&quot;</span>}
          {status !== "all" && <span> • Status: {status.replace("_", " ")}</span>}
          {priority !== "all" && <span> • Priority: {priority}</span>}
          {assigneeId !== "all" && (
            <span>
              • Assignee: {
                assigneeId === "unassigned" 
                  ? "Unassigned" 
                  : users.find(u => u.id.toString() === assigneeId)?.name || "Unknown"
              }
            </span>
          )}
        </div>
      )}
    </div>
  )
}