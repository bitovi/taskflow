"use client"

import { useActionState } from "react"
import { updateTask } from "@/app/(dashboard)/tasks/actions"
import { getAllUsers } from "@/app/login/actions"
import { TaskForm } from "@/components/task-form"
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
    }, [])

    useEffect(() => {
        if (state.message) {
            if (state.success && onFinish) {
                onFinish()
            }
        }
    }, [state, onFinish])

    // Prepare initial data for the form
    const initialData = {
        name: task.name,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assigneeId: task.assigneeId,
        dueDate: task.dueDate,
    }

    return (
        <TaskForm
            mode="edit"
            initialData={initialData}
            users={users}
            onSubmit={formAction}
            showMessages={false}
        />
    )
}
