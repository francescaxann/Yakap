import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/shared/utils'

const alertVariants = cva('w-full border px-4 py-3 text-sm', {
  variants: {
    variant: {
      default: 'border-border bg-background text-foreground',
      destructive: 'border-destructive-foreground/30 bg-destructive text-destructive-foreground',
      support: 'border-foreground bg-foreground text-white',
    },
  },
  defaultVariants: { variant: 'default' },
})

function Alert({ className, variant, role = 'alert', ...props }: ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return <div role={role} className={cn(alertVariants({ variant }), className)} {...props} />
}

export { Alert }
