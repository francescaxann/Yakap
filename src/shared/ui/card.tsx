import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/shared/utils'

const cardVariants = cva('min-w-0 border', {
  variants: {
    variant: {
      default: 'border-border bg-background/80 text-foreground',
      letter: 'border-border bg-white/60 text-foreground',
      ink: 'border-foreground bg-foreground text-white',
      video: 'border-foreground bg-foreground text-ink-muted shadow-[14px_14px_0_#57a4c140]',
      publication: 'border-border bg-white/50 text-foreground shadow-[12px_12px_0_#57a4c12e]',
    },
  },
  defaultVariants: { variant: 'default' },
})

function Card({ className, variant, asChild, ...props }: ComponentProps<'div'> & VariantProps<typeof cardVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'div'
  return <Comp className={cn(cardVariants({ variant }), className)} {...props} />
}

function CardHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-2', className)} {...props} />
}

function CardTitle({ className, ...props }: ComponentProps<'h3'>) {
  return <h3 className={cn('font-semibold tracking-tight', className)} {...props} />
}

function CardContent({ className, ...props }: ComponentProps<'div'>) {
  return <div className={className} {...props} />
}

function CardFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex flex-wrap gap-2', className)} {...props} />
}

export { Card, CardContent, CardFooter, CardHeader, CardTitle }
