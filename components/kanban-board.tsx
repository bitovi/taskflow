"use client"

import { useState, useTransition } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarName } from "@/components/ui/avatar"
import { Clock } from "lucide-react"
import { updateTaskStatus } from "@/app/(dashboard)/tasks/actions"
import { cn } from "@/lib/utils"
import type { KanbanData } from "@/lib/types"
import { poppins } from "@/lib/fonts"

export function KanbanBoard({ initialData }: { initialData: KanbanData }) {
  const [columns, setColumns] = useState(initialData)
  const [, startTransition] = useTransition()

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result

    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const startColId = source.droppableId as keyof KanbanData
    const finishColId = destination.droppableId as keyof KanbanData

    const startCol = columns[startColId]
    const finishCol = columns[finishColId]

    const startTasks = Array.from(startCol.tasks)
    const [movedTask] = startTasks.splice(source.index, 1)

    // Optimistically update UI
    if (startColId === finishColId) {
      startTasks.splice(destination.index, 0, movedTask)
      const newCol = { ...startCol, tasks: startTasks }
      setColumns({ ...columns, [startColId]: newCol })
    } else {
      const finishTasks = Array.from(finishCol.tasks)
      finishTasks.splice(destination.index, 0, movedTask)
      const newStartCol = { ...startCol, tasks: startTasks }
      const newFinishCol = { ...finishCol, tasks: finishTasks }
      setColumns({ ...columns, [startColId]: newStartCol, [finishColId]: newFinishCol })
    }

    // Update the database
    startTransition(async () => {
      await updateTaskStatus(Number.parseInt(draggableId), finishColId)
    })
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-6 overflow-x-auto pb-4">
        {Object.values(columns).map((column) => (
          <Droppable key={column.id} droppableId={column.id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={cn(
                  "flex-shrink-0 w-80 transition-colors rounded-lg",
                  snapshot.isDraggingOver ? "bg-background-light" : "bg-background-dark",
                )}
              >
                <Card className="bg-transparent border-0 shadow-none">
                  <CardHeader className="pb-3 px-4 pt-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">
                        {column.title}
                        <Badge variant="secondary" className="ml-2">
                          {column.tasks.length}
                        </Badge>
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 min-h-[100px] px-4 pb-4">
                    {column.tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <Card
                              className={cn(
                                "cursor-pointer hover:shadow-md transition-shadow",
                                snapshot.isDragging && "shadow-lg ring-2 ring-primary",
                              )}
                            >
                              <CardContent className="p-3">
                                <div className="space-y-3">
                                  <div className="flex items-start justify-between gap-2">
                                    <h4 className={`font-medium text-sm leading-tight ${poppins.className}`}>{task.name}</h4>
                                    <Badge
                                      variant={
                                        task.priority === "high"
                                          ? "destructive"
                                          : task.priority === "medium"
                                            ? "default"
                                            : "secondary"
                                      }
                                      className="text-xs flex-shrink-0 capitalize"
                                    >
                                      {task.priority}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <Avatar className="h-6 w-6">
                                        <AvatarName name={task.assignee?.name || "??"} />
                                      </Avatar>
                                      <span className="text-xs text-muted-foreground">
                                        {task.assignee?.name || "Unassigned"}
                                      </span>
                                    </div>
                                    {task.dueDate && (
                                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        <span>
                                          {new Date(task.dueDate).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                          })}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </CardContent>
                </Card>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  )
}
