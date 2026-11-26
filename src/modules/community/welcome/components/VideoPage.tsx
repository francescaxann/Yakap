import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { Card, CardContent, CardFooter } from '@/shared/ui/card'
import { kicker, lede, pageTitle } from '@/shared/ui/SectionHeading'
import { cn } from '@/shared/utils'

export function VideoPage() {
  const hasVideo = existsSync(join(process.cwd(), 'public/assets/csg-welcome.mp4'))

  return (
    <section className="grid items-center gap-10 desktop:grid-cols-[.8fr_1.2fr] desktop:gap-20">
      <div>
        <span className={kicker}>01 / A MESSAGE FROM YOUR CSG</span>
        <h2 className={cn(pageTitle, 'mb-5 mt-3.5')}>You matter here.</h2>
        <p className={cn(lede, 'max-w-[410px]')}>A few familiar faces wanted to leave you a note. Take a moment with them, exactly as you are.</p>      </div>
      <Card variant="video" className="-order-1 p-3.5 pb-0 desktop:order-none">
        <CardContent className="[&>*]:aspect-video [&>*]:w-full [&>*]:bg-secondary [&>*]:object-cover">
          {hasVideo ? (
            <video autoPlay muted playsInline controls poster="/assets/csg-welcome-poster.svg" aria-label="Welcome from the CSG officers">
              <source src="/assets/csg-welcome.mp4" type="video/mp4" />
              <track kind="captions" src="/assets/csg-welcome.vtt" srcLang="en" label="English captions" default />
              Your browser does not support HTML5 video.
            </video>
          ) : (
            <img src="/assets/csg-welcome-poster.svg" alt="" width={960} height={540} />
          )}
        </CardContent>
        <CardFooter className="py-3.5 font-mono text-[11px]">
          {hasVideo ? 'A welcome from the people in your corner.' : 'The welcome video is currently unavailable.'}
        </CardFooter>
      </Card>
    </section>
  )
}
