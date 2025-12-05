"use server"

import { cookies } from "next/headers";
import { PrismaClient } from "@/app/generated/prisma";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

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
    // Use partitioned cookie attributes so Simple Browser keeps the session.
    cookieStore.set("session", sessionToken, {
        httpOnly: true,
        path: "/",
        sameSite: "none",
        secure: true,
        partitioned: true,
    });
    // Redirect to /home after successful signup
    const { redirect } = await import("next/navigation");
    redirect("/");
}