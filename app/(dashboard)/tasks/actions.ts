"use server";

import { getCurrentUser } from "@/app/login/actions";
import { PrismaClient } from "@/app/generated/prisma";
import { revalidatePath } from "next/cache";
import { parseDateString } from "@/lib/date-utils";
const prisma = new PrismaClient();

export async function createTask(formData: FormData) {
    const name = formData.get("title") as string; // your form uses 'title' for the field, but your model uses 'name'
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;
    const status = formData.get("status") as string;
    const dueDate = formData.get("dueDate") as string;
    const assigneeIdRaw = formData.get("assigneeId") as string;
    const assigneeId = assigneeIdRaw ? parseInt(assigneeIdRaw, 10) : null;

    const user = await getCurrentUser();
    if (!user) return { error: "Not authenticated.", success: false, message: "Not authenticated." };

    const creatorId = user.id;

    if (!name) return { error: "Title is required.", success: false, message: "Title is required." };

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
    } catch (e) {
        return { error: "Failed to create task.", success: false, message: "Failed to create task." };
    }
}

// Get all tasks with assignee and creator info
export async function getAllTasks(filters?: {
    search?: string;
    status?: string;
    assigneeId?: number;
    dueFilter?: string;
}) {
    try {
        const where: any = {};

        // Search filter - search in name, description, or ID
        if (filters?.search) {
            const searchTerm = filters.search.toLowerCase();
            // Try to parse as a number for ID search
            const searchAsNumber = parseInt(searchTerm, 10);
            where.OR = [
                { name: { contains: searchTerm, mode: 'insensitive' } },
                { description: { contains: searchTerm, mode: 'insensitive' } },
            ];
            // If it's a valid number, also search by ID
            if (!isNaN(searchAsNumber)) {
                where.OR.push({ id: searchAsNumber });
            }
        }

        // Status filter
        if (filters?.status && filters.status !== 'all') {
            if (filters.status === 'open') {
                where.status = { in: ['todo', 'in_progress', 'review'] };
            } else {
                where.status = filters.status;
            }
        }

        // Assignee filter
        if (filters?.assigneeId) {
            where.assigneeId = filters.assigneeId;
        }

        // Due date filter
        if (filters?.dueFilter && filters.dueFilter !== 'any') {
            const now = new Date();
            if (filters.dueFilter === 'overdue') {
                where.dueDate = {
                    lt: now,
                };
                where.status = { not: 'done' };
            } else if (filters.dueFilter === 'this_week') {
                const endOfWeek = new Date(now);
                endOfWeek.setDate(now.getDate() + 7);
                where.dueDate = {
                    gte: now,
                    lte: endOfWeek,
                };
            }
        }

        const tasks = await prisma.task.findMany({
            where,
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
    } catch (e) {
        return { tasks: [], error: "Failed to fetch tasks." };
    }
}

// Get all users for assignee dropdown
export async function getAllUsers() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
        return { users, error: null };
    } catch (e) {
        return { users: [], error: "Failed to fetch users." };
    }
}

// Delete a task by ID
export async function deleteTask(taskId: number) {
    try {
        await prisma.task.delete({ where: { id: taskId } });
        revalidatePath("/tasks");
        return { error: null };
    } catch (e) {
        return { error: "Failed to delete task." };
    }
}

// Update a task's status by ID
export async function updateTaskStatus(taskId: number, status: string) {
    try {
        await prisma.task.update({ where: { id: taskId }, data: { status } });
        const afterUpdate = Date.now();
        revalidatePath("/tasks");
        const afterRevalidate = Date.now();
        return { error: null };
    } catch (e) {
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
    } catch (e) {
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
    } catch (e) {
        return {
            totalMembers: 0,
            openTasks: 0,
            tasksCompleted: 0,
            topPerformer: null,
            error: "Failed to fetch team statistics.",
        };
    }
}
