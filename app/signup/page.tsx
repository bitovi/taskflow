"use client";

import { useState } from "react";
import { useActionState } from "react";

import { signup } from "./actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState = { error: null };

async function signupAction(state: { error: string | null }, formData: FormData) {
    const result = await signup(formData);
    return { error: result?.error ?? null };
}

export default function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [state, formAction] = useActionState(signupAction, initialState);

    // Handler to keep state in sync with input fields
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "email") setEmail(value);
        if (name === "password") setPassword(value);
        if (name === "name") setName(value);
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-sm">
                <CardHeader className="text-center">
                    <div className="flex justify-center items-center mb-4">
                        <CheckSquare className="h-8 w-8 mr-2 text-primary" />
                        <CardTitle className="text-2xl">TaskFlow</CardTitle>
                    </div>
                    <CardDescription>Create your account to get started</CardDescription>
                </CardHeader>

                <CardContent>
                    <form className="space-y-4" action={formAction}>
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Your name"
                                value={name}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={handleInputChange}
                            />
                        </div>


                        {state.error && (
                            <div className="text-red-500 text-sm text-center">{state.error}</div>
                        )}

                        <div className="flex space-x-2">
                            <Button className="w-full">
                                Sign&nbsp;Up
                            </Button>

                            <a href="/login" className="w-full">
                                <Button className="w-full" variant="outline" type="button">
                                    Login
                                </Button>
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
