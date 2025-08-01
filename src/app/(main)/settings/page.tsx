
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight, FileUp, Trash2, HelpCircle, LogIn, LogOut, Phone, Mail, Coffee } from "lucide-react"
import { UserNav } from "@/components/shared/user-nav"
import { useApp } from "@/context/app-context"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
    const { accounts, transactions, clearAllData, user, logout } = useApp();
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = () => {
      logout();
      router.push('/login');
    }

    const handleExportData = () => {
        const dataToExport = {
            accounts,
            transactions,
        };
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(dataToExport, null, 2)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = "trackease-data.json";
        link.click();
    };

    const handleDeleteData = () => {
        clearAllData();
        setIsAlertOpen(false);
    };

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="flex items-center justify-between p-4 border-b h-14 shrink-0">
        <h1 className="font-semibold text-lg">Settings</h1>
        {mounted && (
            user ? (
                <div className="flex items-center gap-2">
                    <UserNav />
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                        <LogOut className="w-4 h-4" />
                    </Button>
                </div>
            ) : (
                <Button size="sm" onClick={() => router.push('/login')}>
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                </Button>
            )
        )}
      </header>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-8 pb-24">
          
          <div className="space-y-2">
            <h2 className="text-base font-semibold text-muted-foreground mb-4 px-2">Account</h2>
             {user ? (
              <div className="flex items-center justify-between p-2 rounded-lg">
                <div className="flex items-center gap-3">
                    <UserNav />
                    <div>
                        <p className="font-semibold text-base">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                </div>
              </div>
            ) : (
                <div className="flex items-center justify-between p-2 rounded-lg">
                    <p className="text-sm text-muted-foreground">You are not logged in.</p>
                </div>
            )}
          </div>


          <div>
            <h2 className="text-base font-semibold text-muted-foreground mb-4 px-2">Data Management</h2>
            <div className="space-y-1">
              <button onClick={handleExportData} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-secondary text-sm font-medium">
                <div className="flex items-center gap-3">
                  <FileUp className="w-4 h-4 text-muted-foreground" />
                  <span>Export Data</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
              <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogTrigger asChild>
                    <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-secondary text-sm font-medium text-destructive">
                        <div className="flex items-center gap-3">
                        <Trash2 className="w-4 h-4" />
                        <span>Delete All Data</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete all your accounts and transactions data.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteData} className="bg-destructive hover:bg-destructive/90">
                        Delete
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div>
            <h2 className="text-base font-semibold text-muted-foreground mb-4 px-2">About</h2>
            <div className="space-y-1">
               <AlertDialog open={isContactOpen} onOpenChange={setIsContactOpen}>
                <AlertDialogTrigger asChild>
                    <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-secondary text-sm font-medium">
                        <div className="flex items-center gap-3">
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                        <span>Help & Support</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Contact Developer</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-3">
                            <Button asChild className="w-full" variant="outline">
                                <Link href="tel:+917979057085"><Phone className="mr-2"/>Call</Link>
                            </Button>
                            <Button asChild className="w-full" variant="outline">
                                <Link href="mailto:howdyshahbaz@gmail.com"><Mail className="mr-2"/>Email</Link>
                            </Button>
                        </div>
                        <Button asChild className="w-full">
                            <Link href="https://www.buymeacoffee.com/shahbaz" target="_blank"><Coffee className="mr-2"/>Buy a Coffee</Link>
                        </Button>
                    </div>
                    <AlertDialogFooter className="pt-2">
                        <AlertDialogCancel className="w-full">Close</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
               </AlertDialog>
              <div className="flex items-center justify-between p-3 text-sm">
                <span className="font-medium">Version</span>
                <span className="text-muted-foreground">1.0.0</span>
              </div>
            </div>
          </div>

        </div>
      </ScrollArea>
    </div>
  )
}
