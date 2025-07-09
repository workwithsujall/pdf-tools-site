import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, AlertCircle } from "lucide-react"
import { Button } from "./button"
import cn from "@/lib/utils"

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type?: "success" | "error" | "info";
  message?: string;
  children?: React.ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  type = "info",
  message,
  children,
  className,
  ...props
}: ModalProps) {
  // Lock body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Escape key to close
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  // Define icon based on type
  const renderIcon = () => {
    switch (type) {
      case "success":
        return (
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Check className="h-6 w-6 text-green-600" />
          </div>
        )
      case "error":
        return (
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
        )
      default:
        return null
    }
  }

  // Define modal background color based on type
  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50"
      case "error":
        return "bg-red-50"
      default:
        return "bg-white"
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0" {...props}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className={cn(
                "relative w-full max-w-md overflow-hidden rounded-lg shadow-lg",
                getBgColor(),
                className
              )}
            >
              <div className="absolute right-2 top-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
              <div className="p-6">
                {renderIcon()}
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-medium">{title}</h3>
                  {message && (
                    <p className="mt-2 text-sm text-muted-foreground">{message}</p>
                  )}
                </div>
                {children && <div className="mt-6">{children}</div>}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
} 