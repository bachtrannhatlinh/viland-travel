import * as React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"

export interface ErrorMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string | string[]
  show?: boolean
}

const ErrorMessage = React.forwardRef<HTMLDivElement, ErrorMessageProps>(
  ({ className, message, show = true, ...props }, ref) => {
    if (!message || !show) return null

    const messages = Array.isArray(message) ? message : [message]

    return (
      <div
        ref={ref}
        className={cn(
          "space-y-1 mt-1",
          className
        )}
        {...props}
      >
        {messages.map((msg, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{msg}</span>
          </div>
        ))}
      </div>
    )
  }
)
ErrorMessage.displayName = "ErrorMessage"

export { ErrorMessage }
