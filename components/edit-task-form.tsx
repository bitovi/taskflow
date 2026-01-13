"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateTask } from "@/app/(dashboard)/tasks/actions"
import { getAllUsers } from "@/app/login/actions"
import { formatDateForInput } from "@/lib/date-utils"
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"
import { useEffect, useState } from "react"

type TaskWithProfile = PrismaTask & {
    assignee?: Pick<User, "name"> | null;
};

type ActionState = {
    error: string | null;
    success: boolean;
    message?: string;
}

const initialState: ActionState = {
    message: "",
    success: false,
    error: null,
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save Changes"}
        </Button>
    )
}

export function EditTaskForm({ task, onFinish }: { task: TaskWithProfile; onFinish?: () => void }) {
    const [users, setUsers] = useState<Pick<User, "id" | "name">[]>([])

    // Create a wrapper function that matches useActionState signature
    const updateTaskAction = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
        return updateTask(task.id, formData)
    }

    const [state, formAction] = useActionState(updateTaskAction, initialState)

    useEffect(() => {
        // Fetch users when component mounts
        getAllUsers().then(setUsers)
    }, [task])

    useEffect(() => {
        if (state.message) {
            if (state.success && onFinish) {
                onFinish()
            }
        }
    }, [state, onFinish])

    return (
        <form action={formAction} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" defaultValue={task.name} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={task.description || ""} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue={task.status}>
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
                    <Select name="priority" defaultValue={task.priority}>
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
                    <Select name="assigneeId" defaultValue={task.assigneeId?.toString() || undefined}>
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
                        defaultValue={task.dueDate ? formatDateForInput(task.dueDate) : ""}
                    />
                </div>
            </div>
            <div className="flex justify-end">
                <SubmitButton />
            </div>
        </form>
    )
}
