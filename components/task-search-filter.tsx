"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X, Filter } from "lucide-react"
import { useDebounce } from "@/lib/hooks/use-debounce"

interface TaskSearchFilterProps {
  onSearch: (query: string, priority: string, status: string) => void
  isLoading?: boolean
}

export function TaskSearchFilter({ onSearch, isLoading }: TaskSearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  
  // Debounce search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  
  // Trigger search when any filter changes
  const triggerSearch = useCallback(() => {
    onSearch(debouncedSearchQuery, priorityFilter, statusFilter)
  }, [debouncedSearchQuery, priorityFilter, statusFilter, onSearch])
  
  useEffect(() => {
    triggerSearch()
  }, [triggerSearch])
  
  const clearSearch = () => {
    setSearchQuery("")
    setPriorityFilter("all")
    setStatusFilter("all")
  }
  
  const hasActiveFilters = searchQuery || priorityFilter !== "all" || statusFilter !== "all"
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-background border rounded-lg mb-6">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search tasks by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10"
          disabled={isLoading}
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      {/* Priority Filter */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={priorityFilter} onValueChange={setPriorityFilter} disabled={isLoading}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Status Filter */}
      <div className="flex items-center gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter} disabled={isLoading}>
          <SelectTrigger className="w-32">
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
      </div>
      
      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearSearch}
          disabled={isLoading}
          className="whitespace-nowrap"
        >
          Clear Filters
        </Button>
      )}
    </div>
  )
}