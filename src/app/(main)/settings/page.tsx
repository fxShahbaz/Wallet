
"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, ChevronRight, FileUp, Sun, Moon, Laptop, Trash2, HelpCircle } from "lucide-react"
import { UserNav } from "@/components/shared/user-nav"

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full bg-background">
      <header className="flex items-center justify-between p-4 border-b h-14 shrink-0">
        <div className="flex items-center gap-2">
          <h1 className="font-semibold text-lg">Settings</h1>
        </div>
      </header>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-8 pb-24">
          
          <div className="flex items-center gap-4">
            <UserNav />
            <div>
              <p className="font-semibold text-base">Shahbaz</p>
              <p className="text-sm text-muted-foreground">shahbaz@example.com</p>
            </div>
          </div>

          <div>
            <h2 className="text-base font-semibold text-muted-foreground mb-4 px-2">Appearance</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary">
                <span className="font-medium text-sm">Theme</span>
                <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
                  <Button variant="ghost" size="sm" className="rounded-md px-2 py-1 h-auto bg-background shadow-sm">
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
          </div>

          <div>
            <h2 className="text-base font-semibold text-muted-foreground mb-4 px-2">Data Management</h2>
            <div className="space-y-1">
              <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-secondary text-sm font-medium">
                <div className="flex items-center gap-3">
                  <FileUp className="w-4 h-4 text-muted-foreground" />
                  <span>Export Data</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-secondary text-sm font-medium text-destructive">
                <div className="flex items-center gap-3">
                  <Trash2 className="w-4 h-4" />
                  <span>Delete All Data</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
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
