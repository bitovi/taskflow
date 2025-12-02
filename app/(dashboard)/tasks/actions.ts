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
export async function getAllTasks() {
    try {
        const tasks = await prisma.task.findMany({
            include: {
                assignee: { select: { id: true, name: true, email: true, password: true } },
                creator: { select: { id: true, name: true, email: true, password: true } },
            },
            orderBy: { createdAt: "desc" },
        });
        return { tasks, error: null };
    } catch (e) {
        return { tasks: [], error: "Failed to fetch tasks." };
    }
}

// Search and filter tasks
export async function searchTasks(params: {
    searchQuery?: string;
    status?: string;
    assigneeId?: number;
    dueFilter?: string;
    page?: number;
    perPage?: number;
}) {
    try {
        const {
            searchQuery = "",
            status = "all",
            assigneeId,
            dueFilter = "any",
            page = 1,
            perPage = 10,
        } = params;

        // Build where clause
        const where: any = {};

        // Search by title, description, or ID
        if (searchQuery) {
            const searchNumber = parseInt(searchQuery, 10);
            where.OR = [
                { name: { contains: searchQuery } },
                { description: { contains: searchQuery } },
                ...(isNaN(searchNumber) ? [] : [{ id: searchNumber }]),
            ];
        }

        // Filter by status
        if (status && status !== "all") {
            where.status = status;
        }

        // Filter by assignee
        if (assigneeId) {
            where.assigneeId = assigneeId;
        }

        // Filter by due date
        if (dueFilter && dueFilter !== "any") {
            const now = new Date();
            if (dueFilter === "overdue") {
                where.dueDate = { lt: now };
                where.status = { not: "done" };
            } else if (dueFilter === "this_week") {
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay());
                startOfWeek.setHours(0, 0, 0, 0);
                
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 7);
                
                where.dueDate = {
                    gte: startOfWeek,
                    lt: endOfWeek,
                };
            }
        }

        // Get total count for pagination
        const total = await prisma.task.count({ where });

        // Get paginated tasks
        const tasks = await prisma.task.findMany({
            where,
            include: {
                assignee: { select: { id: true, name: true, email: true } },
                creator: { select: { id: true, name: true, email: true } },
            },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * perPage,
            take: perPage,
        });

        return {
            tasks,
            total,
            page,
            perPage,
            totalPages: Math.ceil(total / perPage),
            error: null,
        };
    } catch (e) {
        console.error("Search tasks error:", e);
        return {
            tasks: [],
            total: 0,
            page: 1,
            perPage: 10,
            totalPages: 0,
            error: "Failed to search tasks.",
        };
    }
}

// Get all users for assignee dropdown
export async function getAllUsers() {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true },
            orderBy: { name: "asc" },
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
