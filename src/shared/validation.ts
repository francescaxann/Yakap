import { z } from 'zod'

// Client validation uses Zod's interpreter under the site's nonce-based CSP.
if (typeof window !== 'undefined') z.config({ jitless: true })

export { z }
