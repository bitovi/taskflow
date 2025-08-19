"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Search, X, Filter } from "lucide-react"

import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

export interface TaskSearchFilterProps {
  tasks: TaskWithProfile[]
  onFilteredTasksChange: (filteredTasks: TaskWithProfile[]) => void
}

export interface StatusFilters {
  todo: boolean
  in_progress: boolean
  review: boolean
  done: boolean
}

export interface PriorityFilters {
  high: boolean
  medium: boolean
  low: boolean
}

export function TaskSearchFilter({ tasks, onFilteredTasksChange }: TaskSearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilters, setStatusFilters] = useState<StatusFilters>({
    todo: true,
    in_progress: true,
    review: true,
    done: true
  })
  const [priorityFilters, setPriorityFilters] = useState<PriorityFilters>({
    high: true,
    medium: true,
    low: true
  })

  // Filter and search tasks
  useMemo(() => {
    const result = tasks.filter(task => {
      // Apply status filter
      if (!statusFilters[task.status as keyof StatusFilters]) {
        return false
      }
      
      // Apply priority filter  
      if (!priorityFilters[task.priority as keyof PriorityFilters]) {
        return false
      }
      
      // Apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        return task.name.toLowerCase().includes(query) || 
               task.description.toLowerCase().includes(query)
      }
      
      return true
    })
    
    // Notify parent component of filtered tasks
    onFilteredTasksChange(result)
    return result
  }, [tasks, statusFilters, priorityFilters, searchQuery, onFilteredTasksChange])

  // Handlers for search and filter
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
  }

  const handleStatusFilterChange = (status: string, checked: boolean) => {
    setStatusFilters(prev => ({ ...prev, [status]: checked }))
  }

  const handlePriorityFilterChange = (priority: string, checked: boolean) => {
    setPriorityFilters(prev => ({ ...prev, [priority]: checked }))
  }

  return (
    <div className="flex items-center gap-2">
      {/* Search Bar */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={statusFilters.todo}
            onCheckedChange={(checked) => handleStatusFilterChange('todo', !!checked)}
          >
            Todo
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={statusFilters.in_progress}
            onCheckedChange={(checked) => handleStatusFilterChange('in_progress', !!checked)}
          >
            In Progress
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={statusFilters.review}
            onCheckedChange={(checked) => handleStatusFilterChange('review', !!checked)}
          >
            Review
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={statusFilters.done}
            onCheckedChange={(checked) => handleStatusFilterChange('done', !!checked)}
          >
            Done
          </DropdownMenuCheckboxItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel>Priority</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={priorityFilters.high}
            onCheckedChange={(checked) => handlePriorityFilterChange('high', !!checked)}
          >
            High
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={priorityFilters.medium}
            onCheckedChange={(checked) => handlePriorityFilterChange('medium', !!checked)}
          >
            Medium
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={priorityFilters.low}
            onCheckedChange={(checked) => handlePriorityFilterChange('low', !!checked)}
          >
            Low
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}