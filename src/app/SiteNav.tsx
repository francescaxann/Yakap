'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/shared/utils'

const tabs = [
  { href: '/video', label: 'Welcome video' },
  { href: '/letters', label: 'Letters of hope' },
  { href: '/cookie', label: 'CSG Bot cookie' },
  { href: '/resources', label: 'Resources' },
  { href: '/cosca', label: 'COSCA donation drive' },
]

export function SiteNav() {
  const pathname = usePathname()
  const activePath = pathname === '/' ? '/video' : pathname

  return (
    <nav className="grid grid-cols-2 border-y border-border desktop:grid-cols-5" aria-label="Wellbeing spaces">
      {tabs.map(({ href, label }, index) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'flex min-w-0 items-center gap-1.5 border-r border-border px-2.5 py-5 text-[13px] text-muted-foreground transition-colors first:border-l hover:bg-white/45 hover:text-foreground max-[800px]:even:border-r-0 max-[800px]:[&:nth-child(n+3)]:border-t desktop:gap-2.5 desktop:px-3.5',
            activePath === href && 'bg-white/45 text-foreground underline underline-offset-[3px]',
          )}
          aria-current={activePath === href ? 'page' : undefined}
        >
          <span className="font-mono text-[11px] text-link" aria-hidden="true">0{index + 1}</span>
          <span className="min-w-0 [overflow-wrap:anywhere]">{label}</span>
          <span className="ml-auto text-lg text-[#62aac4]" aria-hidden="true">↗</span>
        </Link>
      ))}
    </nav>
  )
}
