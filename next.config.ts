import type { NextConfig } from 'next'

const noStore = { key: 'Cache-Control', value: 'private, no-store' }

const config: NextConfig = {
  async headers() {
    return [
      { source: '/api/:path*', headers: [noStore] },
      { source: '/moderation/:path*', headers: [noStore] },
      { source: '/letters/:path*', headers: [noStore] },
    ]
  },
}

export default config
