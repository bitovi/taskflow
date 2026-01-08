"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createTask } from "@/app/(dashboard)/tasks/actions"
import { getAllUsers } from "@/app/login/actions"
import type { User } from "@/app/generated/prisma/client"
import { useEffect, useState } from "react"

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
            {pending ? "Creating..." : "Create Task"}
        </Button>
    )
}

export function CreateTaskForm({ onFinish }: { onFinish?: () => void }) {
    const [users, setUsers] = useState<Pick<User, "id" | "name">[]>([])

    // Create a wrapper function that matches useActionState signature
    const createTaskAction = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
        return createTask(formData)
    }

    const [state, formAction] = useActionState(createTaskAction, initialState)

    useEffect(() => {
        // Fetch users when component mounts
        getAllUsers().then(setUsers)
    }, [])

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
                <Input id="title" name="title" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue="todo">
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
                    <Select name="priority" defaultValue="medium">
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
                    <Select name="assigneeId">
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
                    />
                </div>
            </div>
            {state.error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    {state.error}
                </div>
            )}
            {state.success && state.message && (
                <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
                    {state.message}
                </div>
            )}
            <div className="flex justify-end">
                <SubmitButton />
            </div>
        </form>
    )
}
