import type { MetadataRoute } from 'next'
import { getSiteOrigin } from './site-url'

export const dynamic = 'force-dynamic'

const publicPaths = ['/', '/letters', '/cookie', '/resources', '/cosca']

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteOrigin()
  return publicPaths.map((path) => ({ url: new URL(path, origin).href }))
}
