"use client"

import { useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, X, Filter } from "lucide-react"

const STATUS_OPTIONS = [
    { value: "todo", label: "Todo" },
    { value: "in_progress", label: "In Progress" },
    { value: "review", label: "Review" },
    { value: "done", label: "Done" }
]

const PRIORITY_OPTIONS = [
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" }
]

export function TaskSearch() {
    const router = useRouter()
    const searchParams = useSearchParams()
    
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
    const currentStatuses = searchParams.get('statuses')?.split(',') || STATUS_OPTIONS.map(s => s.value)
    const currentPriorities = searchParams.get('priorities')?.split(',') || PRIORITY_OPTIONS.map(p => p.value)
    
    const updateURL = useCallback((params: Record<string, string | null>) => {
        const newSearchParams = new URLSearchParams(searchParams.toString())
        
        Object.entries(params).forEach(([key, value]) => {
            if (value === null || value === '') {
                newSearchParams.delete(key)
            } else {
                newSearchParams.set(key, value)
            }
        })
        
        router.push(`/tasks?${newSearchParams.toString()}`, { scroll: false })
    }, [router, searchParams])
    
    const handleSearchChange = (value: string) => {
        setSearchQuery(value)
        updateURL({ search: value || null })
    }
    
    const handleClearSearch = () => {
        setSearchQuery('')
        updateURL({ search: null })
    }
    
    const handleStatusToggle = (statusValue: string, checked: boolean) => {
        let newStatuses = [...currentStatuses]
        
        if (checked) {
            if (!newStatuses.includes(statusValue)) {
                newStatuses.push(statusValue)
            }
        } else {
            newStatuses = newStatuses.filter(s => s !== statusValue)
        }
        
        // If all statuses are selected, remove the filter entirely
        const allStatusValues = STATUS_OPTIONS.map(s => s.value)
        if (newStatuses.length === allStatusValues.length && 
            allStatusValues.every(s => newStatuses.includes(s))) {
            updateURL({ statuses: null })
        } else {
            updateURL({ statuses: newStatuses.length > 0 ? newStatuses.join(',') : null })
        }
    }
    
    const handlePriorityToggle = (priorityValue: string, checked: boolean) => {
        let newPriorities = [...currentPriorities]
        
        if (checked) {
            if (!newPriorities.includes(priorityValue)) {
                newPriorities.push(priorityValue)
            }
        } else {
            newPriorities = newPriorities.filter(p => p !== priorityValue)
        }
        
        // If all priorities are selected, remove the filter entirely
        const allPriorityValues = PRIORITY_OPTIONS.map(p => p.value)
        if (newPriorities.length === allPriorityValues.length && 
            allPriorityValues.every(p => newPriorities.includes(p))) {
            updateURL({ priorities: null })
        } else {
            updateURL({ priorities: newPriorities.length > 0 ? newPriorities.join(',') : null })
        }
    }
    
    return (
        <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                        className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
                        onClick={handleClearSearch}
                    >
                        <X className="h-4 w-4" />
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
                        <DropdownMenuCheckboxItem
                            key={status.value}
                            checked={currentStatuses.includes(status.value)}
                            onCheckedChange={(checked) => handleStatusToggle(status.value, checked)}
                        >
                            {status.label}
                        </DropdownMenuCheckboxItem>
                    ))}
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuLabel>Priority</DropdownMenuLabel>
                    {PRIORITY_OPTIONS.map((priority) => (
                        <DropdownMenuCheckboxItem
                            key={priority.value}
                            checked={currentPriorities.includes(priority.value)}
                            onCheckedChange={(checked) => handlePriorityToggle(priority.value, checked)}
                        >
                            {priority.label}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}