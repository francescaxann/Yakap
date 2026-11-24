import * as React from "react"

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/shared/utils"

const textareaVariants = cva("block min-h-16 w-full resize-y border p-[11px] text-base aria-[invalid=true]:border-destructive-foreground disabled:opacity-60", {
  variants: {
    variant: {
      default: "border-input bg-background text-foreground placeholder:text-muted-foreground",
      ink: "border-ink-border bg-ink text-white placeholder:text-ink-muted focus:border-ink-accent aria-[invalid=true]:border-destructive",
    },
  },
  defaultVariants: { variant: "default" },
})

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea"> & VariantProps<typeof textareaVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <textarea
      className={cn(textareaVariants({ variant }), className)}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
