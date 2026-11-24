'use client'

import { useState } from 'react'
import { Button } from '@/shared/ui/button'
import { kicker, lede } from '@/shared/ui/SectionHeading'
import { cn } from '@/shared/utils'
import { nextAffirmation } from '../affirmations'

export function CookiePage() {
  const [note, setNote] = useState('')
  const open = note !== ''

  return (
    <section className="relative grid items-center gap-[34px] overflow-hidden desktop:min-h-[520px] desktop:grid-cols-[.9fr_1.1fr] desktop:gap-12">
      <div className="text-center desktop:text-left">
        <span className={kicker}>03 / YOUR CSG BOT</span>
        <span className="mx-auto mt-5 block w-max -rotate-3 bg-[#f5a9a2] px-2.5 py-[7px] font-mono text-[10px] uppercase tracking-[.08em] text-[#6b3845] desktop:mx-0">
          tiny care delivery
        </span>
        <h2 className="mt-4">A little treat for your brain.</h2>
        <p className={cn(lede, 'mx-auto max-w-[410px] desktop:mx-0')}>
          The CSG Bot has a kind reminder ready for you. Tap the heart whenever you need a small reset.
        </p>
        <p className="mt-7 flex min-w-0 items-center rounded-[22px_22px_22px_4px] border-2 border-foreground bg-white px-5 py-[15px] text-left text-sm font-bold shadow-[5px_5px_0_#f5a9a2]" aria-live="polite">
          {open ? note : 'your note is waiting'}
        </p>
        <span className="mt-4 block font-mono text-[10px] uppercase tracking-[.08em] text-muted-foreground">one tap = one little reminder</span>
      </div>
      <div className="relative isolate grid min-h-[390px] place-items-center rounded-[48%_52%_45%_55%/54%_46%_54%_46%] border-2 border-foreground bg-[radial-gradient(circle_at_50%_45%,#fff8da_0_29%,transparent_30%),linear-gradient(145deg,#bcecf0,#d7f4ed)] shadow-[10px_10px_0_#f5a9a2] desktop:min-h-[500px]">
        <span className="absolute right-6 top-6 rotate-[8deg] font-mono text-[10px] tracking-[.13em] text-link" aria-hidden="true">CSG BOT</span>
        <span className="absolute bottom-1/4 right-[17%] z-[2] animate-twinkle font-mono text-[28px] text-[#f07d72]" aria-hidden="true">+</span>
        <div className={cn('relative z-[1] w-[min(76%,360px)]', open && 'animate-bot-bounce')}>
          <img className="block h-auto w-full object-contain mix-blend-multiply drop-shadow-[0_13px_0_#17364b1f]" src="/assets/sticker.webp" alt="CSG Bot, a friendly light-blue robot holding a cookie with a duck on its head" />
        </div>
        <Button variant="cookie" size="custom" type="button"
          className={cn('absolute bottom-[8%] right-[7%] z-[3] rotate-[9deg] hover:scale-105 focus-visible:scale-105 desktop:bottom-[11%] desktop:right-[10%]', open && 'animate-cookie-pop')}
          onClick={() => setNote(nextAffirmation())} aria-label={open ? 'Again for another kind reminder' : 'Tap me for a kind reminder'}>
          <span className="text-[38px] leading-none text-[#e85d72] [text-shadow:1px_2px_0_#b33e58]" aria-hidden="true">♥</span>
          <small className="font-mono text-[9px] uppercase">{open ? 'again' : 'tap me'}</small>
        </Button>
      </div>
    </section>
  )
}
