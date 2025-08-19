"use server"

import { cookies } from "next/headers";
import { PrismaClient } from "@/app/generated/prisma";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

export async function login(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    if (!email) return { error: "Email is required." };
    if (!password) return { error: "Password is required." };

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return { error: "Invalid email or password." };
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        return { error: "Invalid email or password." };
    }
    // Simple session: set a cookie with a random token
    const sessionToken = randomBytes(32).toString("hex");
    await prisma.session.create({
        data: {
            token: sessionToken,
            userId: user.id,
        },
    });
    const cookieStore = await cookies();
    cookieStore.set("session", sessionToken, { httpOnly: true, path: "/" });
    // Redirect to /home after successful login
    const { redirect } = await import("next/navigation");
    redirect("/");
}

export async function logout() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    if (sessionToken) {
        await prisma.session.deleteMany({ where: { token: sessionToken } });
        cookieStore.set("session", "", { maxAge: 0, path: "/" });
    }
    const { redirect } = await import("next/navigation");
    redirect("/login");
}

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    if (!sessionToken) return null;
    const session = await prisma.session.findUnique({
        where: { token: sessionToken },
        include: { user: true },
    });
    return session?.user || null;
}

export async function getAllUsers() {
    // Returns all users with id and name
    return prisma.user.findMany({ select: { id: true, name: true } });
}