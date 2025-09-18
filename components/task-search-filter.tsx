"use client"

import { useState, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Filter, X } from "lucide-react"

interface TaskSearchFilterProps {
    onFilterChange: (searchText: string, status: string, priority: string) => void
    isLoading?: boolean
}

export function TaskSearchFilter({ onFilterChange, isLoading = false }: TaskSearchFilterProps) {
    const [searchText, setSearchText] = useState("")
    const [status, setStatus] = useState("all")
    const [priority, setPriority] = useState("all")
    const [isPending, startTransition] = useTransition()

    const handleSearchChange = (value: string) => {
        setSearchText(value)
        startTransition(() => {
            onFilterChange(value, status, priority)
        })
    }

    const handleStatusChange = (value: string) => {
        setStatus(value)
        startTransition(() => {
            onFilterChange(searchText, value, priority)
        })
    }

    const handlePriorityChange = (value: string) => {
        setPriority(value)
        startTransition(() => {
            onFilterChange(searchText, status, value)
        })
    }

    const handleClearFilters = () => {
        setSearchText("")
        setStatus("all")
        setPriority("all")
        startTransition(() => {
            onFilterChange("", "all", "all")
        })
    }

    const hasActiveFilters = searchText.trim() || status !== "all" || priority !== "all"

    return (
        <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search tasks by title or description..."
                    value={searchText}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                    disabled={isLoading || isPending}
                />
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    {/* Status Filter */}
                    <div className="space-y-1">
                        <label htmlFor="status-filter" className="text-sm font-medium text-muted-foreground">
                            Status
                        </label>
                        <Select value={status} onValueChange={handleStatusChange} disabled={isLoading || isPending}>
                            <SelectTrigger id="status-filter" className="w-full sm:w-40">
                                <SelectValue placeholder="All statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All statuses</SelectItem>
                                <SelectItem value="todo">Todo</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="review">Review</SelectItem>
                                <SelectItem value="done">Done</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Priority Filter */}
                    <div className="space-y-1">
                        <label htmlFor="priority-filter" className="text-sm font-medium text-muted-foreground">
                            Priority
                        </label>
                        <Select value={priority} onValueChange={handlePriorityChange} disabled={isLoading || isPending}>
                            <SelectTrigger id="priority-filter" className="w-full sm:w-40">
                                <SelectValue placeholder="All priorities" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All priorities</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearFilters}
                        disabled={isLoading || isPending}
                        className="w-full sm:w-auto"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Clear filters
                    </Button>
                )}
            </div>

            {/* Active Filters Indicator */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <Filter className="h-4 w-4" />
                    <span>Active filters:</span>
                    {searchText.trim() && (
                        <span className="bg-muted px-2 py-1 rounded">
                            Search: "{searchText}"
                        </span>
                    )}
                    {status !== "all" && (
                        <span className="bg-muted px-2 py-1 rounded">
                            Status: {status.replace("_", " ")}
                        </span>
                    )}
                    {priority !== "all" && (
                        <span className="bg-muted px-2 py-1 rounded">
                            Priority: {priority}
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}