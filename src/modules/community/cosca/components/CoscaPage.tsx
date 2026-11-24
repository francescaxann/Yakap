import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { kicker, lede } from '@/shared/ui/SectionHeading'
import { cn } from '@/shared/utils'

export function CoscaPage() {
  return (
    <section className="flex flex-col items-center gap-[42px] text-center">
      <div className="max-w-[650px]">
        <span className={kicker}>05 / COSCA COMMUNITY DRIVE</span>
        <h2 className="mb-[18px] mt-3.5 text-[clamp(2.8rem,6vw,5rem)] leading-[.96] tracking-[-.06em]">Support the cause.</h2>
        <p className={cn(lede, 'mx-auto max-w-[520px]')}>The official COSCA publication will live here. Add the campaign artwork when it is ready.</p>
      </div>
      <Card asChild variant="publication" className="w-full max-w-[780px] p-3 desktop:p-[18px]">
        <article id="campaign-details">
          <CardHeader className="flex-row justify-between gap-5 px-0.5 pb-3.5 text-left font-mono text-[10px] tracking-widest text-[#365f4a]">
            <span>COSCA × CSG</span><span>PUBLICATION MATERIAL</span>
          </CardHeader>
          <CardContent className="grid min-h-[320px] place-content-center place-items-center border border-dashed border-border bg-muted p-7 desktop:min-h-[430px] desktop:p-10">
            <span className="mb-[18px] grid size-[54px] place-items-center rounded-full border border-input font-mono text-[27px] text-link" aria-hidden="true">+</span>
            <CardTitle className="mb-2 text-2xl">COSCA publication</CardTitle>
            <p className="text-[13px] text-muted-foreground">Insert the official donation-drive material here.</p>
          </CardContent>
        </article>
      </Card>
    </section>
  )
}
