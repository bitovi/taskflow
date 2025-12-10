"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowRight } from "lucide-react"
import { formatDateForDisplay } from "@/lib/date-utils"
import { poppins } from "@/lib/fonts"

import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

interface TasksSearchTableProps {
  tasks: TaskWithProfile[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function TasksSearchTable({ tasks, totalPages, currentPage, onPageChange }: TasksSearchTableProps) {
  const getInitials = (name: string | null) => {
    if (!name) return "??"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, string> = {
      todo: "Open",
      in_progress: "In Progress",
      blocked: "Blocked",
      review: "Review",
      done: "Done"
    }
    return statusMap[status] || status
  }

  const handleRowClick = (taskId: number) => {
    // TODO: Navigate to task detail page
    // router.push(`/tasks/${taskId}`)
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No tasks match your search</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr className="border-b">
              <th className="text-left p-4 font-semibold">Task</th>
              <th className="text-left p-4 font-semibold">Status</th>
              <th className="text-left p-4 font-semibold">Assignee</th>
              <th className="text-left p-4 font-semibold">Due</th>
              <th className="text-left p-4 font-semibold">Project</th>
              <th className="text-left p-4 font-semibold w-16"></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="border-b last:border-b-0 hover:bg-muted/30 cursor-pointer transition-colors"
                onClick={() => handleRowClick(task.id)}
              >
                <td className="p-4">
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <span className={`font-semibold ${poppins.className}`}>{task.name}</span>
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        TASK-{task.id}
                      </Badge>
                    </div>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                        {task.description}
                      </p>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <Badge className="capitalize">
                    {getStatusDisplay(task.status)}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-7 w-7 border-2 border-border">
                      <AvatarFallback className="text-xs font-medium">
                        {getInitials(task.assignee?.name || null)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{task.assignee?.name || "Unassigned"}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">
                    {task.dueDate ? formatDateForDisplay(task.dueDate) : "-"}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">-</span>
                </td>
                <td className="p-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRowClick(task.id)
                    }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
