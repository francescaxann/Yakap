'use client'

import { useEffect, useState } from 'react'
import { http } from '@/shared/http/client'
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card'
import { Empty, EmptyDescription } from '@/shared/ui/empty'
import { Skeleton } from '@/shared/ui/skeleton'
import { letterDateFormat, letterFeedSchema } from '../validation/model'
import type { LetterFeed as LetterFeedPayload } from '../types/letter'

type Letters = LetterFeedPayload['letters']
type Feed = { status: 'loading' | 'error' } | { status: 'loaded'; letters: Letters }
const cardLayout = 'flex min-h-[180px] flex-col justify-between p-5 desktop:min-h-60'

export function LetterFeed() {
  const [feed, setFeed] = useState<Feed>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()

    async function loadLetters() {
      try {
        const { data } = await http.get<unknown>('/api/letters', { signal: controller.signal })
        if (!controller.signal.aborted) setFeed({ status: 'loaded', letters: letterFeedSchema.parse(data).letters })
      } catch {
        if (!controller.signal.aborted) setFeed({ status: 'error' })
      }
    }

    void loadLetters()
    return () => controller.abort()
  }, [])

  const letters = feed.status === 'loaded' ? feed.letters : []
  const message = feed.status === 'error' ? 'Letters are unavailable right now.'
    : feed.status === 'loading' ? 'Loading letters…'
      : letters.length ? 'Letters loaded.' : 'No letters have been published yet.'

  return (
    <section aria-label="Published letters">
      <Empty className={feed.status === 'loading' || letters.length ? 'sr-only' : undefined}>
        <EmptyDescription role="status">{message}</EmptyDescription>
      </Empty>
      <div className="grid items-start gap-3.5 desktop:grid-cols-3 desktop:[&>*:nth-child(2)]:mt-8 [&>*:nth-child(2)]:bg-secondary desktop:[&>*:nth-child(3)]:mt-3 [&>*:nth-child(3)]:bg-background" aria-busy={feed.status === 'loading'}>
        {feed.status === 'loading' && [1, 2, 3].map((card) => (
          <Card className={cardLayout} variant="letter" key={card} aria-hidden="true">
            <Skeleton className="size-4" />
            <div className="flex flex-col gap-3">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-11/12" />
              <Skeleton className="h-3 w-2/3" />
            </div>
            <div className="flex justify-between gap-3">
              <Skeleton className="h-2 w-2/5" />
              <Skeleton className="h-2 w-1/3" />
            </div>
          </Card>
        ))}
        {letters.map((letter) => (
          <Card asChild className={cardLayout} variant="letter" key={letter.id}>
            <article>
              <CardHeader aria-hidden="true" className="text-link">✦</CardHeader>
              <CardContent>
                <p className="my-6 whitespace-pre-wrap text-sm leading-relaxed [overflow-wrap:anywhere]">{letter.message}</p>
              </CardContent>
              <CardFooter className="justify-between font-mono text-[11px] text-muted-foreground">
                <span>Anonymous</span>
                <time dateTime={letter.createdAt}>{letterDateFormat.format(new Date(letter.createdAt))}</time>
              </CardFooter>
            </article>
          </Card>
        ))}
      </div>
    </section>
  )
}
