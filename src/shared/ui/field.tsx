import type { ComponentProps } from 'react'
import { cn } from '@/shared/utils'
import { Label } from './label'

function FieldGroup({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="field-group" className={cn('flex w-full flex-col gap-3', className)} {...props} />
}

function Field({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="field" role="group" className={cn('flex min-w-0 flex-col gap-2.5', className)} {...props} />
}

function FieldLabel({ className, ...props }: ComponentProps<typeof Label>) {
  return <Label data-slot="field-label" className={cn('w-fit leading-snug', className)} {...props} />
}

function FieldDescription({ className, ...props }: ComponentProps<'p'>) {
  return <p data-slot="field-description" className={cn('text-sm leading-normal text-muted-foreground', className)} {...props} />
}

export { Field, FieldDescription, FieldGroup, FieldLabel }
