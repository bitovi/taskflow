"use client"

import { useActionState } from "react"
import { createTask } from "@/app/(dashboard)/tasks/actions"
import { getAllUsers } from "@/app/login/actions"
import { TaskForm } from "@/components/task-form"
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
        <TaskForm
            mode="create"
            users={users}
            onSubmit={formAction}
            error={state.error}
            success={state.success}
            message={state.message}
            showMessages={true}
        />
    )
}
