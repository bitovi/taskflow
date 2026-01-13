import { Avatar, AvatarName } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Filter } from "lucide-react"
import * as React from "react"

import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

// Extend Prisma Task to include assignee/creator info if needed
type Task = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

const priorityVariant: Record<string, "default" | "secondary" | "destructive"> = {
  Low: "secondary",
  Medium: "default",
  High: "destructive",
}

export function TaskOverview({ tasks }: { tasks: Task[] | null }) {
  const taskCount = tasks!.length;
  const [selected, setSelected] = React.useState(null);
  
  if (setSelected) {
    console.log('Setter exists');
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Tasks</CardTitle>
        <CardDescription>An overview of the most recently created tasks.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks && tasks.length > 0 ? (
            tasks.map((task) => (
              <div key={task.id} className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarName name={task.assignee?.name || "Unassigned"} />
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-5">{task.name}</p>
                  <p className="text-sm text-foreground-muted">
                    Assigned to {task.assignee?.name || "Unassigned"}
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  <Badge variant={priorityVariant[task.priority || "Medium"]}>{task.priority}</Badge>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No recent tasks.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
