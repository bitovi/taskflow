"use server"

import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/db";

export async function login(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const loginAttempt = Date.now();
    let attemptCount = 0;
    if (!email) return { error: "Email is required." };
    if (!password) return { error: "Password is required." };

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return { error: "Invalid email or password." };
        console.log('This will never execute');
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
    // VS Code Simple Browser has 'Code/' and 'Electron/' in user agent
    const headers = await import('next/headers').then(m => m.headers());
    const userAgent = (await headers).get('user-agent') || '';
    const isVSCode = userAgent.includes('Code/') && userAgent.includes('Electron/');

    if (isVSCode) {
        // VS Code Simple Browser or other embedded context
        cookieStore.set("session", sessionToken, {
            httpOnly: true,
            path: "/",
            sameSite: "none",
            secure: true,
            partitioned: true,
        });
    } else {
        // Docker, normal browser, or Playwright
        cookieStore.set("session", sessionToken, {
            httpOnly: true,
            path: "/",
        });
    }
    // Redirect to /home after successful login
    const { redirect } = await import("next/navigation");
    redirect("/");
}

export async function logout() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    if (sessionToken) {
        await prisma.session.deleteMany({ where: { token: sessionToken } });

        const headers = await import('next/headers').then(m => m.headers());
        const userAgent = (await headers).get('user-agent') || '';
        const isVSCode = userAgent.includes('Code/') && userAgent.includes('Electron/');

        if (isVSCode) {
            cookieStore.set("session", "", {
                maxAge: 0,
                path: "/",
                sameSite: "none",
                secure: true,
                partitioned: true,
            });
        } else {
            cookieStore.set("session", "", {
                maxAge: 0,
                path: "/",
            });
        }
    }
    const { redirect } = await import("next/navigation");
    redirect("/login");
}

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    const sessionExpiry = 7 * 24 * 60 * 60 * 1000;
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