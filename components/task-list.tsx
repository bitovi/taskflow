"use client"

import { useOptimistic, useTransition, useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MoreHorizontal, Clock, Edit, Trash2, Search, X, Filter } from "lucide-react"
import { deleteTask, updateTaskStatus } from "@/app/(dashboard)/tasks/actions"
import { formatDateForDisplay } from "@/lib/date-utils"
import { EditTaskForm } from "./edit-task-form"
import { poppins } from "@/lib/fonts"

import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

export function TaskList({ initialTasks }: { initialTasks: TaskWithProfile[]; }) {
  const [optimisticTasks, setOptimisticTasks] = useOptimistic(
    initialTasks,
    (state, { action, task }: { action: "delete" | "toggle"; task: TaskWithProfile | { id: number } }) => {
      if (action === "delete") {
        return state.filter((t) => t.id !== task.id)
      }
      if (action === "toggle") {
        return state.map((t) => (t.id === task.id ? { ...t, status: t.status === "done" ? "todo" : "done" } : t))
      }
      return state
    },
  )
  const [isPending, startTransition] = useTransition()
  const [openDialogs, setOpenDialogs] = useState<Record<number, boolean>>({})
  const [openDropdowns, setOpenDropdowns] = useState<Record<number, boolean>>({})
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilters, setStatusFilters] = useState({
    todo: true,
    in_progress: true,
    review: true,
    done: true
  })
  const [priorityFilters, setPriorityFilters] = useState({
    high: true,
    medium: true,
    low: true
  })

  const handleDelete = async (taskId: number) => {
    startTransition(async () => {
      setOptimisticTasks({ action: "delete", task: { id: taskId } })
      await deleteTask(taskId)
    })
  }

  const handleToggle = async (task: TaskWithProfile) => {
    startTransition(async () => {
      setOptimisticTasks({ action: "toggle", task })
      await updateTaskStatus(task.id, task.status === "done" ? "todo" : "done")
    })
  }

  const handleCloseDialog = (taskId: number) => {
    setOpenDialogs(prev => ({ ...prev, [taskId]: false }))
  }

  const handleEditClick = (taskId: number) => {
    setOpenDropdowns(prev => ({ ...prev, [taskId]: false }))
    setOpenDialogs(prev => ({ ...prev, [taskId]: true }))
  }

  const getInitials = (name: string | null) => {
    if (!name) return "??"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Filter and search tasks
  const filteredTasks = useMemo(() => {
    return optimisticTasks.filter(task => {
      // Apply status filter
      if (!statusFilters[task.status as keyof typeof statusFilters]) {
        return false
      }
      
      // Apply priority filter  
      if (!priorityFilters[task.priority as keyof typeof priorityFilters]) {
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
  }, [optimisticTasks, statusFilters, priorityFilters, searchQuery])

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
    <div className="space-y-4">
      {/* Search and Filter Controls */}
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
      
      {/* Task List or No Results Message */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <Search className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No tasks found</h3>
          <p className="text-muted-foreground">
            No tasks match your current search and filter criteria. Try adjusting your search terms or filter settings.
          </p>
        </div>
      ) : (
        filteredTasks.map((task) => (
        <Dialog key={task.id} open={openDialogs[task.id]} onOpenChange={(open) =>
          setOpenDialogs(prev => ({ ...prev, [task.id]: open }))
        }>
          <Card className={task.status === "done" ? "bg-muted/50" : ""}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Checkbox
                    checked={task.status === "done"}
                    onCheckedChange={() => handleToggle(task)}
                    className="mt-1 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3
                        className={`font-semibold ${poppins.className} ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}
                      >
                        {task.name}
                      </h3>
                      <Badge variant="outline" className="text-xs text-foreground-muted">
                        TASK-{task.id}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                    <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-7 w-7 border-2 border-border">
                          <AvatarFallback className="text-xs font-medium">{getInitials(task.assignee?.name || null)}</AvatarFallback>
                        </Avatar>
                        <span className="text-muted-foreground">{task.assignee?.name || "Unassigned"}</span>
                      </div>
                      <Badge

                        className="capitalize"
                      >
                        {task.status.replace("_", " ")}
                      </Badge>
                      <Badge
                        className="capitalize"
                      >
                        {task.priority}
                      </Badge>

                      {task.dueDate && (
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{formatDateForDisplay(task.dueDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <DropdownMenu open={openDropdowns[task.id]} onOpenChange={(open) =>
                  setOpenDropdowns(prev => ({ ...prev, [task.id]: open }))
                }>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => {
                        e.preventDefault()
                        handleEditClick(task.id)
                      }} className="cursor-pointer hover:bg-background-light">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DropdownMenuItem className="text-primary cursor-pointer hover:bg-background-light" onClick={() => handleDelete(task.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <EditTaskForm task={task} onFinish={() => handleCloseDialog(task.id)} />
          </DialogContent>
        </Dialog>
      ))
      )}
    </div>
  )
}
