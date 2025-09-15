"use client"

import { useOptimistic, useTransition, useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MoreHorizontal, Clock, Edit, Trash2 } from "lucide-react"
import { deleteTask, updateTaskStatus } from "@/app/(dashboard)/tasks/actions"
import { formatDateForDisplay } from "@/lib/date-utils"
import { EditTaskForm } from "./edit-task-form"
import { poppins } from "@/lib/fonts"

import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

interface TaskListProps {
  initialTasks: TaskWithProfile[];
  searchQuery: string;
  statusFilter: string;
  priorityFilter: string;
  assigneeFilter: string;
}

export function TaskList({ initialTasks, searchQuery, statusFilter, priorityFilter, assigneeFilter }: TaskListProps) {
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
  
  // Filter tasks based on search and filter criteria
  const filteredTasks = useMemo(() => {
    return optimisticTasks.filter((task) => {
      // Search filter - check name and description
      const matchesSearch = searchQuery === "" || 
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      
      // Status filter
      const matchesStatus = statusFilter === "all" || task.status === statusFilter
      
      // Priority filter
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
      
      // Assignee filter
      const matchesAssignee = assigneeFilter === "all" || 
        (assigneeFilter === "unassigned" && !task.assignee?.name) ||
        (task.assignee?.name === assigneeFilter)
      
      return matchesSearch && matchesStatus && matchesPriority && matchesAssignee
    })
  }, [optimisticTasks, searchQuery, statusFilter, priorityFilter, assigneeFilter])

  const [, startTransition] = useTransition()
  const [openDialogs, setOpenDialogs] = useState<Record<number, boolean>>({})
  const [openDropdowns, setOpenDropdowns] = useState<Record<number, boolean>>({})

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
      {filteredTasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No tasks found matching your filters.</p>
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
