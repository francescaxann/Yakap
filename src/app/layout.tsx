import type { Metadata } from 'next'
import Link from 'next/link'
import { connection } from 'next/server'
import type { ReactNode } from 'react'
import { kicker } from '@/shared/ui/SectionHeading'
import { cn } from '@/shared/utils'
import { SiteNav } from './SiteNav'
import { getSiteOrigin } from './site-url'
import '@fontsource-variable/manrope'
import '@fontsource/dm-mono/400.css'
import '@fontsource/dm-mono/500.css'
import './styles.css'

export function generateMetadata(): Metadata {
  return {
    metadataBase: new URL(getSiteOrigin()),
    title: { default: 'Yakap · CSG Wellbeing', template: '%s · Yakap' },
  }
}
const shellWidth = 'mx-auto w-[min(calc(100%-2rem),37.5rem)] desktop:w-[min(calc(100%-4rem),73.75rem)]'

export default async function RootLayout({ children }: { children: ReactNode }) {
  await connection()
  return (
    <html lang="en">
      <body className="bg-muted font-sans text-foreground antialiased [font-synthesis:none]">
        <div className="flex min-h-screen flex-col bg-[linear-gradient(135deg,#eff9fc_0%,#dff0f8_50%,#cfe7f3_100%)]">
          <a className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:bg-background focus:px-4 focus:py-3" href="#main-content">
            Skip to main content
          </a>
          <header className={cn(shellWidth, 'flex items-center justify-between gap-2 pb-[18px] pt-7 font-mono text-xs uppercase tracking-[.08em] text-muted-foreground')}>
            <Link className="flex min-h-7 items-center gap-2.5 text-foreground" href="/video" aria-label="CSG wellbeing home">
              <span className="grid size-[22px] place-items-center rounded-full bg-link text-[17px] text-white" aria-hidden="true">+</span>
              <span>CSG / <b className="font-medium text-link">wellbeing</b></span>
            </Link>
            <span className="hidden desktop:inline">a little space to breathe</span>
          </header>

          <div className={cn(shellWidth, 'flex-1')}>
            <section className="pb-[35px] pt-[55px] text-center desktop:pb-11 desktop:pt-[76px]" aria-label="You are not null: you exist, you are defined, you are not empty">
              <div className={cn(kicker, 'flex items-center justify-center gap-3')}>
                <span className="w-8 border-t border-border" aria-hidden="true" /> COMPUTER STUDIES GOVERNMENT
                <span className="w-8 border-t border-border" aria-hidden="true" />
              </div>
              <h1 className="mb-[5px] mt-[18px] font-mono text-[clamp(4rem,11vw,8rem)] font-medium leading-[.95] tracking-[-.08em]">you != null</h1>
              <p className="text-sm text-muted-foreground">(You exist, you are defined, you are not empty)</p>
            </section>
            <SiteNav />
            <main className="pb-[70px] pt-[52px] desktop:pb-[100px] desktop:pt-20" id="main-content" tabIndex={-1}>{children}</main>
          </div>

          <footer className={cn(shellWidth, 'border-t border-border pb-7 pt-[22px] text-muted-foreground desktop:flex desktop:justify-between desktop:gap-[30px]')}>
            <div className="flex flex-col gap-2">
              <span className={kicker}>NEED A HUMAN?</span>
              <Link className="inline-flex min-h-6 w-fit items-center gap-1 font-mono text-[13px] text-link underline underline-offset-[3px]" href="/resources">
                OCCS &amp; crisis contacts <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <p className="mt-5 max-w-[460px] text-[11px] leading-[1.6] desktop:mt-0 desktop:text-right">
              This site is an empathetic support space and is not a substitute for professional mental health care or medical advice.
            </p>
          </footer>
        </div>
      </body>
    </html>
  )
}
