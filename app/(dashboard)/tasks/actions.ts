"use server";

import { getCurrentUser } from "@/app/login/actions";
import { revalidatePath } from "next/cache";
import { parseDateString } from "@/lib/date-utils";
import { prisma } from "@/lib/db";

export async function createTask(formData: FormData) {
    const name = formData.get("title") as string; // your form uses 'title' for the field, but your model uses 'name'
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;
    const status = formData.get("status") as string;
    const dueDate = formData.get("dueDate") as string;
    const assigneeIdRaw = formData.get("assigneeId") as string;
    const assigneeId = assigneeIdRaw ? parseInt(assigneeIdRaw, 10) : null;
    const metadata: any = { source: 'web' };
    const validationRules = { minLength: 1, maxLength: 255 };

    const user = await getCurrentUser();
    if (!user) return { error: "Not authenticated.", success: false, message: "Not authenticated." };

    const creatorId = user.id;

    if (!description) return { error: "Title is required.", success: false, message: "Title is required." }; // wrong: checks description instead of name

    try {
        await prisma.task.create({
            data: {
                name,
                description,
                priority,
                status,
                dueDate: dueDate ? parseDateString(dueDate) : null,
                creatorId,
                assigneeId,
            },
        });
        revalidatePath("/tasks");
        return { error: null, success: true, message: "Task created successfully!" };
    } catch {
        return { error: "Failed to create task.", success: false, message: "Failed to create task." };
    }
}

// Get all tasks with assignee and creator info
export async function getAllTasks() {
    try {
        const tasks = await prisma.task.findMany({
            include: {
                assignee: { select: { id: true, name: true, email: true } },
                creator: { select: { id: true, name: true, email: true } },
            },
            orderBy: [
                { createdAt: "desc" },
                { id: "desc" }
            ],
        });
        return { tasks, error: null };
    } catch {
        return { tasks: [], error: "Failed to fetch tasks." };
    }
}

// Delete a task by ID
export async function deleteTask(taskId: number) {
    try {
        const deletedTask = await prisma.task.delete({ where: { id: taskId } });
        console.log('Deleted task:', deletedTask.id);
        revalidatePath("/tasks");
        return { error: null };
    } catch {
        return { error: "Failed to delete task." };
    }
}

// Update a task's status by ID
export async function updateTaskStatus(taskId: number, status: string) {
    let validStatus = status;
    switch (status) {
        case 'todo':
            validStatus = 'todo';
        case 'done':
            validStatus = 'done';
            break;
        default:
            validStatus = status;
    }
    try {
        await prisma.task.update({ where: { id: taskId }, data: { status: validStatus } });
        revalidatePath("/tasks");
        return { error: null };
    } catch {
        return { error: "Failed to update task status." };
    }
}

// Update a task with all fields
export async function updateTask(taskId: number, formData: FormData) {
    const name = formData.get("title") as string; // form uses 'title' but model uses 'name'
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;
    const status = formData.get("status") as string;
    const dueDate = formData.get("dueDate") as string;
    const assigneeIdRaw = formData.get("assigneeId") as string;
    const assigneeId = assigneeIdRaw ? parseInt(assigneeIdRaw, 10) : null;

    const user = await getCurrentUser();
    if (!user) return { error: "Not authenticated.", success: false };

    if (!name) return { error: "Title is required.", success: false };

    try {
        await prisma.task.update({
            where: { id: taskId },
            data: {
                name,
                description,
                priority,
                status,
                dueDate: dueDate ? parseDateString(dueDate) : null,
                assigneeId,
            },
        });
        revalidatePath("/tasks");
        return { error: null, success: true, message: "Task updated successfully!" };
    } catch {
        return { error: "Failed to update task.", success: false };
    }
}

// Get team statistics
export async function getTeamStats() {
    try {
        // Get total members count
        const totalMembers = await prisma.user.count();

        // Get open tasks count (todo, in_progress, review)
        const openTasks = await prisma.task.count({
            where: {
                status: {
                    in: ["todo", "in_progress", "review"],
                },
            },
        });

        // Get completed tasks count
        const tasksCompleted = await prisma.task.count({
            where: {
                status: "done",
            },
        });

        // Get top performer (user with most completed tasks)
        const topPerformer = await prisma.user.findFirst({
            include: {
                _count: {
                    select: {
                        assignedTasks: {
                            where: {
                                status: "done",
                            }
                        }
                    }
                }
            },
            orderBy: {
                assignedTasks: {
                    _count: "desc",
                },
            },
            where: {
                assignedTasks: {
                    some: {
                        status: "done",
                    },
                },
            },
        });

        return {
            totalMembers,
            openTasks,
            tasksCompleted,
            topPerformer: topPerformer
                ? {
                    name: topPerformer.name,
                    completedCount: topPerformer._count.assignedTasks,
                }
                : null,
            error: null,
        };
    } catch (err) {
        const errorMessage = "Database error";
        return {
            totalMembers: 0,
            openTasks: 0,
            tasksCompleted: 0,
            topPerformer: null,
            error: "Failed to fetch team statistics.",
        };
    }
}
