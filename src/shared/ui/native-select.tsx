import type { ComponentProps } from 'react'
import { ChevronDownIcon } from 'lucide-react'
import { cn } from '@/shared/utils'

function NativeSelect({ className, ...props }: ComponentProps<'select'>) {
  return (
    <div data-slot="native-select-wrapper" className="relative w-fit max-w-full">
      <select
        data-slot="native-select"
        className={cn(
          'min-h-10 w-full appearance-none border border-input bg-background py-2 pl-3 pr-9 text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-60 forced-colors:appearance-auto',
          className,
        )}
        {...props}
      />
      <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground forced-colors:hidden" aria-hidden="true" />
    </div>
  )
}

function NativeSelectOption(props: ComponentProps<'option'>) {
  return <option data-slot="native-select-option" {...props} />
}

export { NativeSelect, NativeSelectOption }
