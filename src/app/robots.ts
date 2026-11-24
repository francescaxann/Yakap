import type { MetadataRoute } from 'next'
import { getSiteOrigin } from './site-url'

export const dynamic = 'force-dynamic'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', disallow: '/api/' },
    sitemap: new URL('/sitemap.xml', getSiteOrigin()).href,
  }
}
