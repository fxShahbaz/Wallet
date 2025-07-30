
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Key, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

// A simple SVG for Google icon as it is not in lucide-react
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
        <path d="M22 12H12" />
        <path d="M12 12C12 14.5341 11.043 16.8643 9.46582 18.5" />
        <path d="M12 12C12 9.46587 11.043 7.13566 9.46582 5.5" />
        <path d="M12 22C10.1384 22 8.4116 21.3683 6.99982 20.25" />
        <path d="M12 2C10.1384 2 8.4116 2.63172 6.99982 3.75" />
        <path d="M2 12C2 10.1384 2.63172 8.4116 3.75 6.99982" />
        <path d="M22 12C22 10.1384 21.3683 8.4116 20.25 6.99982" />
    </svg>
)

export default function LoginPage() {
    const router = useRouter();

    const handleSuccess = () => {
        // This is where you would handle successful login/signup,
        // for now, we just navigate to the main page.
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
                                        <Input id="email-signin" type="email" placeholder="m@example.com" required className="pl-10 text-sm h-9" />
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
                                        <Input id="name-signup" placeholder="John Doe" required className="pl-10 text-sm h-9" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="email-signup" className="text-xs">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="email-signup" type="email" placeholder="m@example.com" required className="pl-10 text-sm h-9" />
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
