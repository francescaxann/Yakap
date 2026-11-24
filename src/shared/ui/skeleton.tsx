import { cn } from "@/shared/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-sm bg-foreground/15", className)}
      {...props}
    />
  )
}

export { Skeleton }
