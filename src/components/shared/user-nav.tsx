
"use client"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

export function UserNav() {
  return (
    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
       <div className="h-10 w-10 rounded-full flex items-center justify-center bg-muted">
        <User className="h-5 w-5 text-muted-foreground" />
       </div>
    </Button>
  )
}
