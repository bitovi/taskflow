"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu"
import { Search, X, Filter } from "lucide-react"

type TaskSearchAndFilterProps = {
    onSearchChange: (searchTerm: string) => void
    onFiltersChange: (priorities: string[], statuses: string[]) => void
    searchTerm: string
    selectedPriorities: string[]
    selectedStatuses: string[]
}

const PRIORITY_OPTIONS = [
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" }
]

const STATUS_OPTIONS = [
    { value: "todo", label: "Todo" },
    { value: "in_progress", label: "In Progress" },
    { value: "review", label: "Review" },
    { value: "done", label: "Done" }
]

export function TaskSearchAndFilter({
    onSearchChange,
    onFiltersChange,
    searchTerm,
    selectedPriorities,
    selectedStatuses
}: TaskSearchAndFilterProps) {
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)

    // Update local search term when prop changes
    useEffect(() => {
        setLocalSearchTerm(searchTerm)
    }, [searchTerm])

    const handleSearchChange = (value: string) => {
        setLocalSearchTerm(value)
        onSearchChange(value)
    }

    const handleClearSearch = () => {
        setLocalSearchTerm("")
        onSearchChange("")
    }

    const handlePriorityChange = (priority: string, checked: boolean) => {
        const newPriorities = checked
            ? [...selectedPriorities, priority]
            : selectedPriorities.filter(p => p !== priority)
        onFiltersChange(newPriorities, selectedStatuses)
    }

    const handleStatusChange = (status: string, checked: boolean) => {
        const newStatuses = checked
            ? [...selectedStatuses, status]
            : selectedStatuses.filter(s => s !== status)
        onFiltersChange(selectedPriorities, newStatuses)
    }

    const activeFilterCount = (4 - selectedPriorities.length) + (4 - selectedStatuses.length)

    return (
        <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search tasks..."
                    value={localSearchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 pr-10"
                />
                {localSearchTerm && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                        onClick={handleClearSearch}
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Clear search</span>
                    </Button>
                )}
            </div>
            
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="relative">
                        <Filter className="h-4 w-4" />
                        {activeFilterCount > 0 && (
                            <Badge 
                                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs"
                                variant="destructive"
                            >
                                {activeFilterCount}
                            </Badge>
                        )}
                        <span className="sr-only">Filter tasks</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Status</DropdownMenuLabel>
                    {STATUS_OPTIONS.map((status) => (
                        <DropdownMenuCheckboxItem
                            key={status.value}
                            checked={selectedStatuses.includes(status.value)}
                            onCheckedChange={(checked) => handleStatusChange(status.value, checked)}
                        >
                            {status.label}
                        </DropdownMenuCheckboxItem>
                    ))}
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuLabel>Priority</DropdownMenuLabel>
                    {PRIORITY_OPTIONS.map((priority) => (
                        <DropdownMenuCheckboxItem
                            key={priority.value}
                            checked={selectedPriorities.includes(priority.value)}
                            onCheckedChange={(checked) => handlePriorityChange(priority.value, checked)}
                        >
                            {priority.label}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}