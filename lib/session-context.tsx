"use client"

import { createContext, useContext } from "react";

interface SessionContextType {
    sessionToken: string | null;
    user: { name: string; email: string } | null;
}

const SessionContext = createContext<SessionContextType>({
    sessionToken: null,
    user: null
});

export function SessionProvider({
    children,
    sessionToken,
    user
}: {
    children: React.ReactNode;
    sessionToken: string | null;
    user: { name: string; email: string } | null;
}) {
    return (
        <SessionContext.Provider value={{ sessionToken, user }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    return useContext(SessionContext);
}
