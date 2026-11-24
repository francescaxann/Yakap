import { Alert } from '@/shared/ui/alert'
import { kicker, SectionHeading } from '@/shared/ui/SectionHeading'
import { cn } from '@/shared/utils'

const contactRow = 'grid gap-1.5 border-b border-border py-5 text-sm leading-[1.7] text-muted-foreground desktop:grid-cols-[1fr_2fr] desktop:gap-5 [&>dt]:font-semibold [&>dt]:text-foreground'

export function ResourcesPage() {
  return (
    <section>
      <SectionHeading title="People who can help." label="04 / OFFICIAL SUPPORT">
        Save this page. You can reach out before things feel urgent, too.
      </SectionHeading>
      <div className="mt-[38px] border-t border-border [&_a]:text-link [&_a]:underline [&_a]:underline-offset-[3px] [&_a]:[overflow-wrap:anywhere]">
        <div className={cn(contactRow, 'py-3 font-mono text-[10px]')} aria-hidden="true">
          <span>CONTACT</span>
          <span>DETAILS</span>
        </div>
        <dl>
          <div className={contactRow}>
            <dt>CPS Main Office</dt>
            <dd>Room 203, 2/F Br. Connon Hall<br />Mon–Fri: 7:30 AM–9:00 PM · Sat: 8:00 AM–5:00 PM<br />Local 419 · Direct <a href="tel:85360226">8536-0226</a></dd>
          </div>
          <div className={contactRow}>
            <dt>CPS Satellite Office</dt>
            <dd>2/F Enrique Razon Sports Center (front of elevator)<br />Mon–Fri: 8:00 AM–5:00 PM<br />Landline TBA</dd>
          </div>
          <div className={contactRow}>
            <dt>CPS Academy Office (SHS)</dt>
            <dd>2/F Enrique Razon Sports Center (front of stairs)<br />Mon–Fri: 7:30 AM–5:00 PM<br />Landline TBA</dd>
          </div>
          <div className={contactRow}>
            <dt>CPS mobile</dt>
            <dd>Globe <a href="tel:09541985940">0954-198-5940</a> · Smart <a href="tel:09686488029">0968-648-8029</a></dd>
          </div>
          <div className={contactRow}>
            <dt>Undergraduate students</dt>
            <dd><a href="tel:09284546489">0928-454-6489</a> / <a href="tel:09052216924">0905-221-6924</a></dd>
          </div>
          <div className={contactRow}>
            <dt>Graduate students</dt>
            <dd><a href="tel:09610965358">0961-096-5358</a></dd>
          </div>
          <div className={contactRow}>
            <dt>Laguna campus</dt>
            <dd><a href="tel:09517731991">0951-773-1991</a></dd>
          </div>
          <div className={contactRow}>
            <dt>College of Law · Rufino</dt>
            <dd><a href="tel:09984437809">0998-443-7809</a></dd>
          </div>
          <div className={contactRow}>
            <dt>CPS inquiries and appointments</dt>
            <dd><a href="mailto:cps@dlsu.edu.ph">cps@dlsu.edu.ph</a></dd>
          </div>
          <div className={contactRow}>
            <dt>CPS SAS1000 concerns</dt>
            <dd><a href="mailto:cps.sas1000@dlsu.edu.ph">cps.sas1000@dlsu.edu.ph</a></dd>
          </div>
          <div className={contactRow}>
            <dt>CPS peer student care</dt>
            <dd><a href="mailto:cps.studentcare@dlsu.edu.ph">cps.studentcare@dlsu.edu.ph</a></dd>
          </div>
          <div className={contactRow}>
            <dt>CPS feedback and suggestions</dt>
            <dd><a href="mailto:cpsdir@dlsu.edu.ph">cpsdir@dlsu.edu.ph</a></dd>
          </div>
          <div className={contactRow}>
            <dt>Student Success Center</dt>
            <dd>Internships, MOAs, SAS2000/3000 · <a href="mailto:ssc@dlsu.edu.ph">ssc@dlsu.edu.ph</a></dd>
          </div>
        </dl>
      </div>
      <Alert variant="support" role="note" className="mt-[55px] gap-[25px] p-7 desktop:flex desktop:items-center desktop:justify-between">
        <div><span className={cn(kicker, "text-ink-accent")}>NATIONAL CRISIS HOTLINES</span><h3 className="mt-2.5 text-[25px]">Immediate support is available.</h3></div>
        <div className="mt-[25px] flex flex-wrap gap-5 font-mono text-xs text-ink-muted desktop:mt-0 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-[3px] [&_a]:[overflow-wrap:anywhere]">
          <a href="tel:09175584673">Hopeline PH <b>0917-558-4673</b></a>
          <a href="tel:1553">NCMH Hotline <b>1553</b></a>
          <span>In Touch Community Services <a href="tel:0288937603"><b>02-8893-7603</b></a> · <a href="tel:09190560709">0919-056-0709</a> · <a href="tel:09178001123">0917-800-1123</a> · <a href="tel:09171085412">0917-108-5412</a></span>
        </div>
      </Alert>
    </section>
  )
}
