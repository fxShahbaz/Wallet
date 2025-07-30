
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, ChevronRight, FileUp, Sun, Moon, Laptop, Trash2, HelpCircle } from "lucide-react"
import { UserNav } from "@/components/shared/user-nav"

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full bg-secondary">
      <header className="flex items-center justify-between p-4 border-b h-14 shrink-0 bg-background">
        <div className="flex items-center gap-2">
          <h1 className="font-semibold text-lg">Settings</h1>
        </div>
      </header>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6 pb-24">
          
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <UserNav />
              <div>
                <CardTitle className="text-lg">Shahbaz</CardTitle>
                <CardDescription>shahbaz@example.com</CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Appearance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">Theme</span>
                  <div className="flex items-center gap-2 rounded-lg bg-muted p-1">
                    <Button variant="ghost" size="sm" className="rounded-md px-2 py-1 h-auto bg-background shadow">
                      <Sun className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-md px-2 py-1 h-auto">
                      <Moon className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-md px-2 py-1 h-auto">
                      <Laptop className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <button className="w-full flex items-center justify-between py-2 text-sm font-medium">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-muted-foreground" />
                  <span>Push Notifications</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Data Management</CardTitle>
            </CardHeader>
            <CardContent>
               <button className="w-full flex items-center justify-between py-2 text-sm font-medium">
                <div className="flex items-center gap-3">
                  <FileUp className="w-4 h-4 text-muted-foreground" />
                  <span>Export Data</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="w-full flex items-center justify-between py-2 text-sm font-medium text-destructive">
                <div className="flex items-center gap-3">
                  <Trash2 className="w-4 h-4" />
                  <span>Delete All Data</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            </CardContent>
          </Card>

          <Card>
             <CardHeader>
              <CardTitle className="text-base">About</CardTitle>
            </CardHeader>
            <CardContent>
               <button className="w-full flex items-center justify-between py-2 text-sm font-medium">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-muted-foreground" />
                  <span>Help & Support</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
              <div className="flex items-center justify-between py-2 text-sm">
                <span className="text-muted-foreground">Version</span>
                <span>1.0.0</span>
              </div>
            </CardContent>
          </Card>

        </div>
      </ScrollArea>
    </div>
  )
}

