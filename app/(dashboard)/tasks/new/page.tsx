"use client"

import { CreateTaskForm } from "@/components/create-task-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { poppins } from "@/lib/fonts"

export default function NewTaskPage() {
  const router = useRouter()

  const handleTaskCreated = () => {
    router.push("/tasks")
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-3xl font-bold tracking-tight ${poppins.className}`}>Create New Task</h2>
      </div>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
          <CardDescription>Fill in the information below to create a new task</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateTaskForm onFinish={handleTaskCreated} />
        </CardContent>
      </Card>
    </div>
  )
}
