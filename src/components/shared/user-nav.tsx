"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function UserNav() {
  return (
    <Button variant="ghost" className="relative h-12 w-12 rounded-full p-0">
      <Avatar className="h-12 w-12">
        <AvatarImage src="https://placehold.co/48x48.png" alt="@user" data-ai-hint="person man" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    </Button>
  )
}
