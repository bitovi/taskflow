import { Sidebar } from "@/components/sidebar";
import { getCurrentUser } from "@/app/login/actions";
import { redirect } from "next/navigation";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await getCurrentUser();
    
    // Auto-login as Alice if no user is logged in (for development convenience)
    if (!user) {
        redirect("/api/auto-login");
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">{children}</main>

        </div>
    );
}
