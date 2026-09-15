import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/**
 * Fonts are self-hosted via next/font, so font-src stays 'self'.
 *
 * 'unsafe-eval' is development-only. Contentlayer needed it in production;
 * Velite does not, and the MDX runtime's `new Function` runs in a server
 * component where browser CSP has no say. React itself does use eval() in dev
 * for debugging (reconstructing callstacks) and never in production, so the
 * allowance is scoped to the dev server rather than shipped.
 *
 * connect-src is enumerated rather than '*'. Embeds (YouTube, Spotify) make
 * their own requests from inside their iframe, which this policy does not govern
 * — they need frame-src, not connect-src.
 */
const devOnlyEval = process.env.NODE_ENV === 'production' ? '' : " 'unsafe-eval'"

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self'${devOnlyEval} 'unsafe-inline' *.vercel.com vercel.com *.vercel-scripts.com vercel-scripts.com *.posthog.com;
  style-src 'self' 'unsafe-inline';
  worker-src 'self' blob:;
  img-src * blob: data:;
  media-src *.s3.amazonaws.com *.youtube.com youtube.com *.soundcloud.com soundcloud.com *.spotify.com spotify.com *.twitch.tv twitch.tv player.twitch.tv;
  connect-src 'self' *.posthog.com *.vercel-insights.com *.vercel-scripts.com vitals.vercel-insights.com;
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
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
      // Video-post thumbnails are derived from the YouTube video id.
      { protocol: 'https', hostname: 'img.youtube.com', pathname: '/vi/**' },
      { protocol: 'https', hostname: 'i.ytimg.com', pathname: '/vi/**' },
    ],
  },
  async redirects() {
    return [{ source: '/connect', destination: '/contact', permanent: true }]
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}

export default withBundleAnalyzer(nextConfig)
