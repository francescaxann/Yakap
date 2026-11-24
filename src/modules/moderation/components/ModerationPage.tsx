import { canSignIn, getSignedInUser, isVerifiedDlsuUser } from '@/modules/auth/server/auth.server'
import { AccountButton } from '@/modules/auth/components/AccountButton'
import { ProfileAvatar } from '@/modules/auth/components/ProfileAvatar'
import { Alert } from '@/shared/ui/alert'
import { Card, CardContent } from '@/shared/ui/card'
import { SectionHeading } from '@/shared/ui/SectionHeading'
import { ModerationDashboard } from '../letters/components/ModerationDashboard'
import { listModerationLetters } from '../letters/server/store.server'
import { ModeratorManagement } from '../moderators/components/ModeratorManagement'
import { isModerator, listModeratorEmails } from '../moderators/server/store.server'

export async function ModerationPage({ requestHeaders, signInError }: { requestHeaders: Headers; signInError: boolean }) {
  const user = await getSignedInUser(requestHeaders)
  const moderator = isVerifiedDlsuUser(user) && await isModerator(user.email) ? user : null
  const emails = moderator ? await listModeratorEmails(moderator.email) : null
  const letters = moderator && emails ? await listModerationLetters(moderator.email) : null

  return (
    <section>
      <SectionHeading title="Letter moderation">
        {letters && 'Check each letter for identifying details before accepting it for the public feed.'}
      </SectionHeading>
      {moderator && emails && letters ? (
        <>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <ProfileAvatar email={moderator.email} name={moderator.name} image={moderator.image} />
            <strong className="[overflow-wrap:anywhere]">{moderator.name || moderator.email}</strong>
            <AccountButton className="ml-auto" returnTo="/moderation" signedIn />
          </div>
          <ModerationDashboard letters={letters} />
          <ModeratorManagement emails={emails} currentEmail={moderator.email.toLowerCase()} />
        </>
      ) : (
        <Card className="mt-7 max-w-[440px] p-[26px]" variant="ink">
          <CardContent className="flex flex-col items-start gap-4">
            <p>{user ? 'This account does not have moderator access.' : 'Sign in with your DLSU moderator account.'}</p>
            {signInError && !user && <Alert variant="destructive">Sign-in requires a verified DLSU Google account.</Alert>}
            {canSignIn() ? <AccountButton returnTo="/moderation" signedIn={Boolean(user)} /> : <p>DLSU sign-in is unavailable right now.</p>}
          </CardContent>
        </Card>
      )}
    </section>
  )
}
