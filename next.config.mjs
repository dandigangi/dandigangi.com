import bundleAnalyzer from '@next/bundle-analyzer'
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js'

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
 * img-src and media-src are 'self' because next/image proxies every remote
 * image through /_next/image on this origin, and nothing renders a raw <audio>
 * or <video> — the podcast and talk embeds are iframes, governed by frame-src.
 *
 * connect-src is enumerated rather than '*'. Embeds (YouTube, Spotify) make
 * their own requests from inside their iframe, which this policy does not govern
 * — they need frame-src, not connect-src.
 */
const devOnlyEval = process.env.NODE_ENV === 'production' ? '' : " 'unsafe-eval'"

const ContentSecurityPolicy = `
  default-src 'self';
  base-uri 'self';
  form-action 'self';
  object-src 'none';
  frame-ancestors 'none';
  script-src 'self'${devOnlyEval} 'unsafe-inline' *.vercel.com vercel.com *.vercel-scripts.com vercel-scripts.com *.posthog.com;
  style-src 'self' 'unsafe-inline';
  worker-src 'self' blob:;
  img-src 'self' blob: data: https://img.youtube.com https://i.ytimg.com;
  media-src 'self';
  connect-src 'self' *.posthog.com *.vercel-insights.com *.vercel-scripts.com vitals.vercel-insights.com;
  font-src 'self';
  frame-src *.youtube.com youtube.com *.soundcloud.com soundcloud.com *.spotify.com spotify.com *.twitch.tv twitch.tv player.twitch.tv;
`

// No Strict-Transport-Security here: Vercel already sends one with a longer
// max-age, browsers honour whichever arrives first, and a second header only
// made this one look effective when it was being ignored.
const securityHeaders = [
  { key: 'Content-Security-Policy', value: ContentSecurityPolicy.replace(/\n/g, '') },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /**
   * `dev.tsx` is a page extension only outside production, which is what keeps
   * the local post editor off the live site. This is stronger than a runtime
   * guard: in a production build Next never treats app/admin/write/page.dev.tsx as a
   * route, so it is not compiled, not bundled, and absent from the manifest —
   * along with the editor-only dependencies it imports.
   */
  pageExtensions:
    process.env.NODE_ENV === 'production'
      ? ['ts', 'tsx', 'js', 'jsx']
      : ['ts', 'tsx', 'js', 'jsx', 'dev.tsx'],
  // Next 16 writes AGENTS.md/CLAUDE.md into the repo by default; this repo's
  // agent conventions are managed elsewhere.
  agentRules: false,
  images: {
    remotePatterns: [
      // Video-post thumbnails are derived from the YouTube video id.
      { protocol: 'https', hostname: 'img.youtube.com', pathname: '/vi/**' },
      { protocol: 'https', hostname: 'i.ytimg.com', pathname: '/vi/**' },
    ],
  },
  async redirects() {
    return [
      { source: '/connect', destination: '/contact', permanent: true },
      // Slug had "presentatinos" misspelled; the old URL is already indexed.
      {
        source:
          '/blog/upright-education-graduation-software-projects-and-presentatinos-oct-23-cohort',
        destination:
          '/blog/upright-education-graduation-software-projects-and-presentations-oct-23-cohort',
        permanent: true,
      },
      // Tag pages removed when the vocabulary was consolidated. These were live
      // URLs, so they point at the tag that absorbed them rather than 404.
      {
        source: '/blog/tags/management',
        destination: '/blog/tags/engineering-management',
        permanent: true,
      },
      // /blog/tags/ai used to redirect here too. The tag is live again as of
      // Sep 2026, so the redirect is gone — a 308 on a URL that now has a real
      // page is the one redirect that cannot be left in place "just in case".
      {
        source: '/blog/tags/productivity',
        destination: '/blog/tags/software-engineering',
        permanent: true,
      },
      {
        source: '/blog/tags/conferences',
        destination: '/blog/tags/engineering-management',
        permanent: true,
      },
      // Renamed Sep 2026 for clarity. Both were live, indexed URLs, so they
      // point at their new spelling rather than 404.
      {
        source: '/blog/tags/feedback',
        destination: '/blog/tags/giving-feedback',
        permanent: true,
      },
      { source: '/blog/tags/resume', destination: '/blog/tags/resumes', permanent: true },
    ]
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}

/*
 * Under `next dev`, velite watches data/ and rebuilds posts on save; before, the
 * server only ever saw them as they were at startup. The env flag stops Next's
 * child processes, which load this file again, starting watchers of their own.
 */
export default async function config(phase) {
  if (phase === PHASE_DEVELOPMENT_SERVER && !process.env.VELITE_STARTED) {
    process.env.VELITE_STARTED = '1'
    const { build } = await import('velite')
    await build({ watch: true })
  }
  return withBundleAnalyzer(nextConfig)
}
