"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function UserNav() {
  return (
    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
      <Avatar className="h-10 w-10">
        <AvatarImage src="https://placehold.co/40x40.png" alt="@user" data-ai-hint="person man" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    </Button>
  )
}
