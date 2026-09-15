import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

// Fonts are self-hosted via next/font, so font-src stays 'self'.
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.smartlook.com smartlook.com *.vercel.com vercel.com *.vercel-scripts.com vercel-scripts.com;
  style-src 'self' 'unsafe-inline';
  img-src * blob: data:;
  media-src *.s3.amazonaws.com *.youtube.com youtube.com *.soundcloud.com soundcloud.com *.spotify.com spotify.com *.twitch.tv twitch.tv player.twitch.tv;
  connect-src *;
  font-src 'self';
  frame-src *.youtube.com youtube.com *.soundcloud.com soundcloud.com *.spotify.com spotify.com *.twitch.tv twitch.tv player.twitch.tv;
`

const securityHeaders = [
  { key: 'Content-Security-Policy', value: ContentSecurityPolicy.replace(/\n/g, '') },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  // Next 16 writes AGENTS.md/CLAUDE.md into the repo by default; this repo's
  // agent conventions are managed elsewhere.
  agentRules: false,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'picsum.photos', pathname: '/**' }],
  },
  async redirects() {
    return [{ source: '/connect', destination: '/contact', permanent: true }]
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}

export default withBundleAnalyzer(nextConfig)
