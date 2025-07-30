
"use client"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import { useRouter } from "next/navigation"

export function UserNav() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/login');
  };

  return (
    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0" onClick={handleClick}>
       <div className="h-10 w-10 rounded-full flex items-center justify-center bg-muted border">
        <User className="h-5 w-5 text-muted-foreground" />
       </div>
    </Button>
  )
}
