import { SectionHeading } from '@/shared/ui/SectionHeading'
import { LetterFeed } from './LetterFeed'
import { LetterForm, type LetterFormProps } from './LetterForm'

export function LettersPage(props: LetterFormProps) {
  return (
    <section>
      <SectionHeading title="Leave a little light behind." label="02 / ANONYMOUS LETTERS OF HOPE">
        Approved notes from students, for students. Read slowly.
      </SectionHeading>
      <div className="grid items-start gap-10 pt-[38px] desktop:grid-cols-[minmax(0,1.5fr)_minmax(0,.8fr)] desktop:gap-7">
        <LetterFeed />
        <LetterForm {...props} />
      </div>
    </section>
  )
}
