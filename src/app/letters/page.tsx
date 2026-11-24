import type { Metadata } from 'next'
import { SectionHeading } from '@/shared/ui/SectionHeading'
import { Card, CardContent, CardFooter } from '@/shared/ui/card'

export const metadata: Metadata = { title: 'Letters of hope', alternates: { canonical: '/letters' } }

const letters = [
  {
    "author": "A fellow Lasallian",
    "date": "Today",
    "message": "You do not have to have it all figured out today. Showing up is already a brave thing."
  },
  {
    "author": "Someone from Taft",
    "date": "Yesterday",
    "message": "Rest is not a reward you earn after being productive. You are allowed to pause now."
  },
  {
    "author": "A friend you have not met yet",
    "date": "Oct 28",
    "message": "The hard chapter is not the whole story. Please give tomorrow a chance to surprise you."
  }
]

export default function LettersPage() {
  return (
    <section>
      <SectionHeading title="Leave a little light behind." label="02 / ANONYMOUS LETTERS OF HOPE">
        A few reminders from students, for students.
      </SectionHeading>
      <div className="grid gap-4 pt-10 desktop:grid-cols-3">
        {letters.map((letter) => (
          <Card asChild key={letter.message} className="grid gap-5 p-5" variant="letter">
            <article>
              <CardContent><p>{letter.message}</p></CardContent>
              <CardFooter className="justify-between font-mono text-xs text-muted-foreground">
                <span>{letter.author}</span>
                <span>{letter.date}</span>
              </CardFooter>
            </article>
          </Card>
        ))}
      </div>
    </section>
  )
}
