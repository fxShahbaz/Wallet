
"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { motion } from "framer-motion"
import { Check, X } from "lucide-react"

function AnimatedIcon({ variant }: { variant?: 'default' | 'destructive' | null }) {
    const Icon = variant === 'destructive' ? X : Check;
    const iconColor = variant === 'destructive' ? 'bg-red-500' : 'bg-green-500';

    return (
        <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`flex items-center justify-center w-6 h-6 rounded-full text-white ${iconColor} shrink-0`}
        >
            <Icon className="w-4 h-4" />
        </motion.div>
    );
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="flex items-start gap-3">
              <AnimatedIcon variant={props.variant} />
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
