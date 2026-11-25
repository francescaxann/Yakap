import { Card, CardContent, CardHeader } from '@/shared/ui/card'
import { kicker, lede } from '@/shared/ui/SectionHeading'
import { cn } from '@/shared/utils'

export function CoscaPage() {
  return (
    <section className="flex flex-col items-center gap-[42px] text-center">
      <div className="max-w-[650px]">
        <span className={kicker}>05 / COSCA COMMUNITY DRIVE</span>
        <h2 className="mb-[18px] mt-3.5 text-[clamp(2.8rem,6vw,5rem)] leading-[.96] tracking-[-.06em]">Support the cause.</h2>
        <p className={cn(lede, 'mx-auto max-w-[520px]')}>Watch the official COSCA publication to learn how you can help the community drive.</p>
      </div>
      <Card asChild variant="publication" className="w-fit max-w-full p-3 desktop:p-[18px]">
        <article id="campaign-details">
          <CardHeader className="flex-row justify-between gap-5 px-0.5 pb-3.5 text-left font-mono text-[10px] tracking-widest text-[#365f4a]">
            <span>COSCA × CSG</span><span>PUBLICATION MATERIAL</span>
          </CardHeader>
          <CardContent className="border border-border bg-muted p-0">
            <video
              className="block h-auto max-h-[80vh] w-auto max-w-full"
              width={1080}
              height={1080}
              autoPlay
              controls
              playsInline
              preload="auto"
              aria-label="COSCA donation-drive publication video"
            >
              <source src="/assets/csg-pubmat.mp4" type="video/mp4" />
              Your browser does not support HTML5 video.
            </video>
          </CardContent>
        </article>
      </Card>
    </section>
  )
}
