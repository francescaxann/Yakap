import { cn } from "@/shared/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="skeleton"
      className={cn("rounded-md bg-foreground/20 motion-safe:animate-pulse", className)}
      {...props}
    />
  )
}

export { Skeleton }
