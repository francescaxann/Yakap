import * as React from "react"

import { cn } from "@/shared/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex min-h-11 w-full min-w-0 border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground aria-[invalid=true]:border-destructive-foreground disabled:cursor-not-allowed disabled:opacity-60",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
