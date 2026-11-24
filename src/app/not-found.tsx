import Link from 'next/link'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card'
import { kicker, pageTitle } from '@/shared/ui/SectionHeading'

export default function NotFound() {
  return (
    <Card asChild className="grid max-w-xl gap-4 p-6 desktop:p-8">
      <section aria-labelledby="missing-page">
        <CardHeader>
          <span className={kicker}>404</span>
          <h2 className={pageTitle} id="missing-page">Page not found</h2>
        </CardHeader>
        <CardContent className="text-muted-foreground">Check the address or return to the welcome page.</CardContent>
        <CardFooter>
          <Button asChild><Link href="/video">Back to Yakap</Link></Button>
        </CardFooter>
      </section>
    </Card>
  )
}
