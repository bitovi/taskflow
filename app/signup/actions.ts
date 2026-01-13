"use server"

import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/db";

export async function signup(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string | undefined;
    if (!email) return { error: "Email is required." };
    if (!password) return { error: "Password is required." };
    if (!name) return { error: "Name is required." };

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { error: "User already exists." };

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            email,
            password: hashed,
            name: name || "User",
        },
    });
    // Log them in: create session and set cookie
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
    // Redirect to /home after successful signup
    const { redirect } = await import("next/navigation");
    redirect("/");
}