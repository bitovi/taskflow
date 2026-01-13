import { TeamStats } from "@/components/team-stats";
import { AvatarName } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@radix-ui/react-avatar";
import { Mail } from "lucide-react";
import { poppins } from "@/lib/fonts";
import { prisma } from "@/lib/db";

export default async function TeamPage() {
    const users = await prisma.user.findMany({
        orderBy: { name: "asc" },
    });

    return (
        <div className="p-8">
            <h1 className={`text-3xl font-bold mb-4 ${poppins.className}`}>Team</h1>
            <div className={"mb-8"}>
                <TeamStats />

            </div>
            <div className="grid gap-4">
                {users.length === 0 && <div>No users found.</div>}
                {users.map((user) => (
                    <Card key={user.id}>
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarName name={user.name ?? "??"} />
                                </Avatar>
                                <div>
                                    <h3 className={`font-semibold ${poppins.className}`}>{user.name || "No Name"}</h3>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm" asChild>
                                    <a href={`mailto:${user.email}`}>
                                        <Mail className="h-4 w-4 mr-2" />
                                        Email
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
