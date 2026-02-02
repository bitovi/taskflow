"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"
import { getAllUsers } from "@/app/login/actions"
import type { User } from "@/app/generated/prisma/client"

interface TaskFiltersProps {
  onFilterChange: (filters: {
    search: string;
    status: string[];
    priority: string[];
    assigneeId: number | undefined;
  }) => void;
}

const STATUS_OPTIONS = [
  { value: "todo", label: "Todo" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
]

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
]

export function TaskFilters({ onFilterChange }: TaskFiltersProps) {
  const [search, setSearch] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([])
  const [selectedAssignee, setSelectedAssignee] = useState<number | undefined>(undefined)
  const [users, setUsers] = useState<Pick<User, "id" | "name">[]>([])

  useEffect(() => {
    // Fetch users for assignee filter
    getAllUsers()
      .then(setUsers)
      .catch((error) => {
        console.error("Failed to load users:", error)
        setUsers([])
      })
  }, [])

  useEffect(() => {
    // Notify parent component when filters change
    // Note: onFilterChange should be wrapped in useCallback in parent component
    onFilterChange({
      search,
      status: selectedStatuses,
      priority: selectedPriorities,
      assigneeId: selectedAssignee,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, selectedStatuses, selectedPriorities, selectedAssignee])

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    )
  }

  const togglePriority = (priority: string) => {
    setSelectedPriorities(prev =>
      prev.includes(priority)
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    )
  }

  const clearFilters = () => {
    setSearch("")
    setSelectedStatuses([])
    setSelectedPriorities([])
    setSelectedAssignee(undefined)
  }

  const hasActiveFilters = search || selectedStatuses.length > 0 || selectedPriorities.length > 0 || selectedAssignee

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Search Input */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search tasks by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <Label>Status</Label>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((status) => (
              <Badge
                key={status.value}
                variant={selectedStatuses.includes(status.value) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => toggleStatus(status.value)}
              >
                {status.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div className="space-y-2">
          <Label>Priority</Label>
          <div className="flex flex-wrap gap-2">
            {PRIORITY_OPTIONS.map((priority) => (
              <Badge
                key={priority.value}
                variant={selectedPriorities.includes(priority.value) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => togglePriority(priority.value)}
              >
                {priority.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Assignee Filter */}
        <div className="space-y-2">
          <Label htmlFor="assignee">Assignee</Label>
          <Select
            value={selectedAssignee?.toString() || "all"}
            onValueChange={(value) => setSelectedAssignee(value === "all" ? undefined : parseInt(value))}
          >
            <SelectTrigger>
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
      </div>
    </div>
  )
}
