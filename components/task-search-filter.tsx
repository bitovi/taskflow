"use client"

import { useState, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Search, X, Filter } from "lucide-react"

interface TaskSearchFilterProps {
    onSearchAndFilter: (searchText: string, statusFilters: string[], priorityFilters: string[]) => void;
}

export function TaskSearchFilter({ onSearchAndFilter }: TaskSearchFilterProps) {
    const [searchText, setSearchText] = useState("")
    const [statusFilters, setStatusFilters] = useState<string[]>(["todo", "in_progress", "review", "done"])
    const [priorityFilters, setPriorityFilters] = useState<string[]>(["high", "medium", "low"])
    const [isPending, startTransition] = useTransition()

    const handleSearchChange = (value: string) => {
        setSearchText(value)
        startTransition(() => {
            onSearchAndFilter(value, statusFilters, priorityFilters)
        })
    }

    const handleClearSearch = () => {
        setSearchText("")
        startTransition(() => {
            onSearchAndFilter("", statusFilters, priorityFilters)
        })
    }

    const handleStatusChange = (status: string, checked: boolean) => {
        const newStatusFilters = checked 
            ? [...statusFilters, status]
            : statusFilters.filter(s => s !== status)
        setStatusFilters(newStatusFilters)
        startTransition(() => {
            onSearchAndFilter(searchText, newStatusFilters, priorityFilters)
        })
    }

    const handlePriorityChange = (priority: string, checked: boolean) => {
        const newPriorityFilters = checked 
            ? [...priorityFilters, priority]
            : priorityFilters.filter(p => p !== priority)
        setPriorityFilters(newPriorityFilters)
        startTransition(() => {
            onSearchAndFilter(searchText, statusFilters, newPriorityFilters)
        })
    }

    const statusOptions = [
        { value: "todo", label: "Todo" },
        { value: "in_progress", label: "In Progress" },
        { value: "review", label: "Review" },
        { value: "done", label: "Done" }
    ]

    const priorityOptions = [
        { value: "high", label: "High" },
        { value: "medium", label: "Medium" },
        { value: "low", label: "Low" }
    ]

    return (
        <div className="flex items-center space-x-4 mb-6">
            {/* Search Input */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchText}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 pr-10"
                />
                {searchText && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearSearch}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                    >
                        <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </Button>
                )}
            </div>

            {/* Filter Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" disabled={isPending}>
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                        {(statusFilters.length < 4 || priorityFilters.length < 3) && (
                            <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                                {(4 - statusFilters.length) + (3 - priorityFilters.length)}
                            </Badge>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Status</DropdownMenuLabel>
                    <div className="px-2 py-2 space-y-2">
                        {statusOptions.map((status) => (
                            <div key={status.value} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`status-${status.value}`}
                                    checked={statusFilters.includes(status.value)}
                                    onCheckedChange={(checked) => handleStatusChange(status.value, !!checked)}
                                />
                                <label
                                    htmlFor={`status-${status.value}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    {status.label}
                                </label>
                            </div>
                        ))}
                    </div>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuLabel>Priority</DropdownMenuLabel>
                    <div className="px-2 py-2 space-y-2">
                        {priorityOptions.map((priority) => (
                            <div key={priority.value} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`priority-${priority.value}`}
                                    checked={priorityFilters.includes(priority.value)}
                                    onCheckedChange={(checked) => handlePriorityChange(priority.value, !!checked)}
                                />
                                <label
                                    htmlFor={`priority-${priority.value}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    {priority.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}