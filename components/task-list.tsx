"use client"

import { useOptimistic, useTransition, useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
  const [showFilters, setShowFilters] = useState(false)
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

  // Filter tasks based on search query and filters
  const filteredTasks = optimisticTasks.filter((task) => {
    // Search filter
    const matchesSearch = searchQuery === "" ||
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())

    // Status filter
    const matchesStatus = statusFilters[task.status as keyof typeof statusFilters] ?? true

    // Priority filter  
    const matchesPriority = priorityFilters[task.priority as keyof typeof priorityFilters] ?? true

    return matchesSearch && matchesStatus && matchesPriority
  })

  const clearSearch = () => {
    setSearchQuery("")
  }

  const toggleStatusFilter = (status: keyof typeof statusFilters) => {
    setStatusFilters(prev => ({ ...prev, [status]: !prev[status] }))
  }

  const togglePriorityFilter = (priority: keyof typeof priorityFilters) => {
    setPriorityFilters(prev => ({ ...prev, [priority]: !prev[priority] }))
  }

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

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Filter Button */}
        <DropdownMenu open={showFilters} onOpenChange={setShowFilters}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-4">
            <div className="space-y-4">
              {/* Status Filters */}
              <div>
                <h4 className="font-medium mb-3">Status</h4>
                <div className="space-y-2">
                  {[
                    { key: "todo" as const, label: "Todo" },
                    { key: "in_progress" as const, label: "In Progress" },
                    { key: "review" as const, label: "Review" },
                    { key: "done" as const, label: "Done" }
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${key}`}
                        checked={statusFilters[key]}
                        onCheckedChange={() => toggleStatusFilter(key)}
                      />
                      <label htmlFor={`status-${key}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                {/* Priority Filters */}
                <h4 className="font-medium mb-3">Priority</h4>
                <div className="space-y-2">
                  {[
                    { key: "high" as const, label: "High" },
                    { key: "medium" as const, label: "Medium" },
                    { key: "low" as const, label: "Low" }
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={`priority-${key}`}
                        checked={priorityFilters[key]}
                        onCheckedChange={() => togglePriorityFilter(key)}
                      />
                      <label htmlFor={`priority-${key}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <Search className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No tasks found</h3>
          <p className="text-muted-foreground max-w-md">
            No tasks match your current search and filter criteria. Try adjusting your search terms or filter settings.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
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
          ))}
        </div>
      )}
    </div>
  )
}
