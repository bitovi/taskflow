"use client"

import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { User } from "@/app/generated/prisma/client"

type TaskFormMode = "create" | "edit"

type TaskFormData = {
    name: string
    description?: string | null
    status: string
    priority: string
    assigneeId?: number | null
    dueDate?: Date | null
}

type TaskFormProps = {
    mode: TaskFormMode
    initialData?: Partial<TaskFormData>
    users: Pick<User, "id" | "name">[]
    onSubmit: (formData: FormData) => void
    error?: string | null
    success?: boolean
    message?: string
    showMessages?: boolean
}

function SubmitButton({ mode }: { mode: TaskFormMode }) {
    const { pending } = useFormStatus()
    const isCreating = mode === "create"
    
    return (
        <Button type="submit" disabled={pending}>
            {pending 
                ? (isCreating ? "Creating..." : "Saving...") 
                : (isCreating ? "Create Task" : "Save Changes")
            }
        </Button>
    )
}

export function TaskForm({ 
    mode, 
    initialData = {}, 
    users, 
    onSubmit, 
    error, 
    success, 
    message,
    showMessages = true
}: TaskFormProps) {
    // Default values for create mode
    const defaultStatus = mode === "create" ? "todo" : initialData.status
    const defaultPriority = mode === "create" ? "medium" : initialData.priority
    
    // Format date for input field
    const formatDateForInput = (date: Date | null | undefined): string => {
        if (!date) return ""
        return new Date(date).toISOString().split('T')[0]
    }

    return (
        <form action={onSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                    id="title" 
                    name="title" 
                    defaultValue={initialData.name || ""} 
                    required 
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                    id="description" 
                    name="description" 
                    defaultValue={initialData.description || ""} 
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue={defaultStatus}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todo">Todo</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="review">Review</SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select name="priority" defaultValue={defaultPriority}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="assigneeId">Assignee</Label>
                    <Select 
                        name="assigneeId" 
                        defaultValue={initialData.assigneeId?.toString() || undefined}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                        <SelectContent>
                            {users.map((user) => (
                                <SelectItem key={user.id} value={user.id.toString()}>
                                    {user.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                        id="dueDate"
                        name="dueDate"
                        type="date"
                        defaultValue={formatDateForInput(initialData.dueDate)}
                    />
                </div>
            </div>
            {showMessages && error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    {error}
                </div>
            )}
            {showMessages && success && message && (
                <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
                    {message}
                </div>
            )}
            <div className="flex justify-end">
                <SubmitButton mode={mode} />
            </div>
        </form>
    )
}
