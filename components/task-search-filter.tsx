"use client"

import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, X, Filter } from "lucide-react"

export interface FilterState {
    search: string;
    statuses: string[];
    priorities: string[];
}

interface TaskSearchFilterProps {
    onFilterChange: (filters: FilterState) => void;
}

const statusOptions = [
    { value: "todo", label: "Todo" },
    { value: "in_progress", label: "In Progress" },
    { value: "review", label: "Review" },
    { value: "done", label: "Done" },
]

const priorityOptions = [
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
]

export function TaskSearchFilter({ onFilterChange }: TaskSearchFilterProps) {
    const [search, setSearch] = useState("")
    const [statuses, setStatuses] = useState<string[]>(statusOptions.map(s => s.value))
    const [priorities, setPriorities] = useState<string[]>(priorityOptions.map(p => p.value))

    const handleFilterUpdate = useCallback((newSearch?: string, newStatuses?: string[], newPriorities?: string[]) => {
        const searchValue = newSearch !== undefined ? newSearch : search
        const statusesValue = newStatuses !== undefined ? newStatuses : statuses
        const prioritiesValue = newPriorities !== undefined ? newPriorities : priorities
        
        onFilterChange({
            search: searchValue,
            statuses: statusesValue,
            priorities: prioritiesValue
        })
    }, [search, statuses, priorities, onFilterChange])

    const handleSearchChange = (value: string) => {
        setSearch(value)
        handleFilterUpdate(value)
    }

    const handleClearSearch = () => {
        setSearch("")
        handleFilterUpdate("")
    }

    const handleStatusChange = (status: string, checked: boolean) => {
        const newStatuses = checked 
            ? [...statuses, status] 
            : statuses.filter(s => s !== status)
        setStatuses(newStatuses)
        handleFilterUpdate(undefined, newStatuses)
    }

    const handlePriorityChange = (priority: string, checked: boolean) => {
        const newPriorities = checked 
            ? [...priorities, priority] 
            : priorities.filter(p => p !== priority)
        setPriorities(newPriorities)
        handleFilterUpdate(undefined, undefined, newPriorities)
    }

    return (
        <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search tasks..."
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 pr-10"
                />
                {search && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearSearch}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
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
                    <div className="p-4 space-y-4">
                        <div>
                            <h4 className="font-medium text-sm mb-3">Status</h4>
                            <div className="space-y-2">
                                {statusOptions.map((option) => (
                                    <div key={option.value} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`status-${option.value}`}
                                            checked={statuses.includes(option.value)}
                                            onCheckedChange={(checked) => 
                                                handleStatusChange(option.value, !!checked)
                                            }
                                        />
                                        <label
                                            htmlFor={`status-${option.value}`}
                                            className="text-sm font-normal cursor-pointer"
                                        >
                                            {option.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="font-medium text-sm mb-3">Priority</h4>
                            <div className="space-y-2">
                                {priorityOptions.map((option) => (
                                    <div key={option.value} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`priority-${option.value}`}
                                            checked={priorities.includes(option.value)}
                                            onCheckedChange={(checked) => 
                                                handlePriorityChange(option.value, !!checked)
                                            }
                                        />
                                        <label
                                            htmlFor={`priority-${option.value}`}
                                            className="text-sm font-normal cursor-pointer"
                                        >
                                            {option.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}