
"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight, FileUp, Sun, Moon, Laptop, Trash2, HelpCircle, LogIn, LogOut } from "lucide-react"
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
import { motion } from "framer-motion"

export default function SettingsPage() {
    const { accounts, transactions, clearAllData } = useApp();
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const { theme, setTheme } = useTheme()
    const [isLoggedIn, setIsLoggedIn] = useState(true);

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
        <div className="flex items-center gap-2">
          <h1 className="font-semibold text-lg">Settings</h1>
        </div>
        {isLoggedIn ? (
          <div className="flex items-center gap-2">
              <UserNav />
              <Button variant="outline" size="sm" onClick={() => setIsLoggedIn(false)}>
                <LogOut className="w-4 h-4" />
              </Button>
          </div>
        ) : (
            <Button size="sm" onClick={() => setIsLoggedIn(true)}>
                <LogIn className="w-4 h-4 mr-2" />
                Login
            </Button>
        )}
      </header>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-8 pb-24">
          
          <div className="space-y-2">
            <h2 className="text-base font-semibold text-muted-foreground mb-4 px-2">Account</h2>
             {isLoggedIn ? (
              <div className="flex items-center justify-between p-2 rounded-lg">
                <div>
                  <p className="font-semibold text-base">Shahbaz</p>
                  <p className="text-sm text-muted-foreground">shahbaz@example.com</p>
                </div>
              </div>
            ) : (
                <div className="flex items-center justify-between p-2 rounded-lg">
                    <p className="text-sm text-muted-foreground">You are not logged in.</p>
                </div>
            )}
          </div>


          <div>
            <h2 className="text-base font-semibold text-muted-foreground mb-4 px-2">Appearance</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary">
                <span className="font-medium text-sm">Theme</span>
                <div className="relative flex items-center gap-1 rounded-lg bg-secondary p-1">
                  
                  <Button variant="ghost" size="sm" onClick={() => setTheme('light')} className={cn("relative rounded-md px-2 py-1 h-auto z-10", theme !== 'light' && 'text-muted-foreground')}>
                    <Sun className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setTheme('dark')} className={cn("relative rounded-md px-2 py-1 h-auto z-10", theme !== 'dark' && 'text-muted-foreground')}>
                    <Moon className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setTheme('system')} className={cn("relative rounded-md px-2 py-1 h-auto z-10", theme !== 'system' && 'text-muted-foreground')}>
                    <Laptop className="w-4 h-4" />
                  </Button>
                  
                  {theme && (
                    <motion.div
                      layoutId="theme-switcher-active"
                      className="absolute inset-0 bg-background rounded-md shadow-sm"
                      style={{ 
                        left: theme === 'light' ? '4px' : theme === 'dark' ? '44px' : '84px',
                        width: '36px',
                        height: 'calc(100% - 8px)',
                        top: '4px'
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-base font-semibold text-muted-foreground mb-4 px-2">Data Management</h2>
            <div className="space-y-1">
              <button onClick={handleExportData} className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-secondary text-sm font-medium">
                <div className="flex items-center gap-3">
                  <FileUp className="w-4 h-4 text-muted-foreground" />
                  <span>Export Data</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
              <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogTrigger asChild>
                    <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-secondary text-sm font-medium text-destructive">
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
               <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-secondary text-sm font-medium">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-muted-foreground" />
                  <span>Help & Support</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
              <div className="flex items-center justify-between p-2 text-sm">
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
