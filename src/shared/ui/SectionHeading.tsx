import type { ReactNode } from 'react'
import { cn } from '@/shared/utils'
import { Separator } from './separator'

export const kicker = 'font-mono text-[11px] leading-normal tracking-[.12em] text-link'
export const pageTitle = 'text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[.98] tracking-[-.06em] text-foreground'
export const lede = 'text-[15px] leading-[1.8] text-muted-foreground'

export function SectionHeading({ title, label, children }: { title: string; label?: string; children?: ReactNode }) {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-5 pb-[38px] desktop:flex-nowrap desktop:gap-[30px]">
        <div>
          {label && <span className={kicker}>{label}</span>}
          <h2 className={cn(pageTitle, 'mt-3.5 max-w-[560px]')}>{title}</h2>
        </div>
        {children && <p className={cn(lede, 'max-w-[410px]')}>{children}</p>}
      </div>
      <Separator />
    </div>
  )
}
