
"use client"

import { Avatar, AvatarName } from "@/components/ui/avatar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useEffect, useState } from "react"
import { logout, getCurrentUser } from "@/app/login/actions"


interface User {
    name: string;
    email: string;
}

export function AuthDropdown() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        (async () => {
            const u = await getCurrentUser();
            if (u) setUser({ name: u.name, email: u.email });
        })();
    }, []);

    if (!user) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar data-testid="auth-avatar" className="h-8 w-8 cursor-pointer">
                    <AvatarName name={user.name} />
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-foreground-muted">{user.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="w-full text-left cursor-pointer hover:bg-background-light"
                    onClick={async () => {
                        await logout();
                    }}
                >
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
