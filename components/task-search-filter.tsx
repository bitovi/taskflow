"use client"

import { useState, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, X, Filter } from "lucide-react"

interface TaskSearchFilterProps {
    onSearch: (query: string, statusFilters: string[], priorityFilters: string[]) => void
}

const STATUS_OPTIONS = ["todo", "in_progress", "review", "done"]
const PRIORITY_OPTIONS = ["high", "medium", "low"]

export function TaskSearchFilter({ onSearch }: TaskSearchFilterProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilters, setStatusFilters] = useState<string[]>(STATUS_OPTIONS)
    const [priorityFilters, setPriorityFilters] = useState<string[]>(PRIORITY_OPTIONS)
    const [isPending, startTransition] = useTransition()

    const handleSearchChange = (value: string) => {
        setSearchQuery(value)
        startTransition(() => {
            onSearch(value, statusFilters, priorityFilters)
        })
    }

    const handleClearSearch = () => {
        setSearchQuery("")
        startTransition(() => {
            onSearch("", statusFilters, priorityFilters)
        })
    }

    const handleStatusChange = (status: string, checked: boolean) => {
        const newStatusFilters = checked
            ? [...statusFilters, status]
            : statusFilters.filter(s => s !== status)
        
        setStatusFilters(newStatusFilters)
        startTransition(() => {
            onSearch(searchQuery, newStatusFilters, priorityFilters)
        })
    }

    const handlePriorityChange = (priority: string, checked: boolean) => {
        const newPriorityFilters = checked
            ? [...priorityFilters, priority]
            : priorityFilters.filter(p => p !== priority)
        
        setPriorityFilters(newPriorityFilters)
        startTransition(() => {
            onSearch(searchQuery, statusFilters, newPriorityFilters)
        })
    }

    const formatLabel = (text: string) => {
        return text.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())
    }

    return (
        <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 pr-10"
                />
                {searchQuery && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                        onClick={handleClearSearch}
                    >
                        <X className="h-3 w-3" />
                    </Button>
                )}
            </div>
            
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Status</DropdownMenuLabel>
                    {STATUS_OPTIONS.map((status) => (
                        <DropdownMenuItem key={status} className="flex items-center space-x-2" onSelect={(e) => e.preventDefault()}>
                            <Checkbox
                                checked={statusFilters.includes(status)}
                                onCheckedChange={(checked) => handleStatusChange(status, checked as boolean)}
                            />
                            <span>{formatLabel(status)}</span>
                        </DropdownMenuItem>
                    ))}
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuLabel>Priority</DropdownMenuLabel>
                    {PRIORITY_OPTIONS.map((priority) => (
                        <DropdownMenuItem key={priority} className="flex items-center space-x-2" onSelect={(e) => e.preventDefault()}>
                            <Checkbox
                                checked={priorityFilters.includes(priority)}
                                onCheckedChange={(checked) => handlePriorityChange(priority, checked as boolean)}
                            />
                            <span>{formatLabel(priority)}</span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}