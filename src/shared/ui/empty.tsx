import type { ComponentProps } from 'react'
import { cn } from '@/shared/utils'

function Empty({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('min-w-0 py-2', className)} {...props} />
}

function EmptyDescription({ className, ...props }: ComponentProps<'p'>) {
  return <p className={cn('text-[15px] leading-[1.8] text-muted-foreground', className)} {...props} />
}

export { Empty, EmptyDescription }
