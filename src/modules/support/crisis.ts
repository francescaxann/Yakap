const crisisTerms = ['suicide', 'kill myself', 'end my life', 'want to die', 'magpakamatay', 'ayoko nang mabuhay']
const substitutions: Record<string, string> = { '1': 'i', '3': 'e', '4': 'a', '5': 's', '0': 'o' }

export function hasCrisisLanguage(message: string) {
  const normalized = message.toLowerCase().replace(/[13450]/g, (digit) => substitutions[digit])
  return crisisTerms.some((term) => normalized.includes(term))
}
