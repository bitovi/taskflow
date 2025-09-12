"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

export interface TaskFilters {
  search: string
  status: string
  priority: string
  assignee: string
}

interface TaskSearchFilterProps {
  onFiltersChange: (filters: TaskFilters) => void
  assignees: Array<{ id: number; name: string }>
}

export function TaskSearchFilter({ onFiltersChange, assignees }: TaskSearchFilterProps) {
  const [filters, setFilters] = useState<TaskFilters>({
    search: "",
    status: "all",
    priority: "all",
    assignee: "all"
  })

  const handleFilterChange = (key: keyof TaskFilters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  return (
    <div className="space-y-4 mb-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks by name or description..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Filters:</span>
        </div>

        {/* Status Filter */}
        <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="review">Review</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select value={filters.priority} onValueChange={(value) => handleFilterChange("priority", value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>

        {/* Assignee Filter */}
        <Select value={filters.assignee} onValueChange={(value) => handleFilterChange("assignee", value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Assignees" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignees</SelectItem>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            {assignees.map((assignee) => (
              <SelectItem key={assignee.id} value={assignee.id.toString()}>
                {assignee.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}