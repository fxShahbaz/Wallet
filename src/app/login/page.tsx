
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Key, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/app-context';


export default function LoginPage() {
    const router = useRouter();
    const { login } = useApp();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSuccess = () => {
        login({ name: name || "User", email: email || "user@example.com" });
        router.push('/');
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <div className="w-full max-w-sm">
                <Tabs defaultValue="sign-in" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="sign-in">Sign In</TabsTrigger>
                        <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
                    </TabsList>
                    <TabsContent value="sign-in">
                        <Card>
                            <CardHeader className="text-center">
                                <CardTitle className="text-2xl">Welcome Back!</CardTitle>
                                <CardDescription className="text-xs">Sign in to continue to your dashboard.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1">
                                    <Label htmlFor="email-signin" className="text-xs">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="email-signin" type="email" placeholder="m@example.com" required className="pl-10 text-sm h-9" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="password-signin" className="text-xs">Password</Label>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="password-signin" type="password" required className="pl-10 text-sm h-9" />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full h-9" onClick={handleSuccess}>
                                    Sign In
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="sign-up">
                        <Card>
                            <CardHeader className="text-center">
                                <CardTitle className="text-2xl">Create an account</CardTitle>
                                <CardDescription className="text-xs">Enter your information to create an account.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                 <div className="space-y-1">
                                    <Label htmlFor="name-signup" className="text-xs">Full Name</Label>
                                     <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="name-signup" placeholder="John Doe" required className="pl-10 text-sm h-9" value={name} onChange={(e) => setName(e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="email-signup" className="text-xs">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="email-signup" type="email" placeholder="m@example.com" required className="pl-10 text-sm h-9" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="password-signup" className="text-xs">Password</Label>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="password-signup" type="password" required className="pl-10 text-sm h-9" />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full h-9" onClick={handleSuccess}>
                                    Create Account
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
