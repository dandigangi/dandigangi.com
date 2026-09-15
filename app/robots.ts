import { MetadataRoute } from 'next'
import siteMetadata from '@/data/siteMetadata'

/**
 * AI crawlers are named explicitly rather than left to the wildcard so the
 * intent is legible: this site wants to be readable by both the answer engines
 * that cite sources and the training crawlers. The content is here to be found.
 */
const AI_CRAWLERS = [
  // Answer / search agents — these can cite the site in generated answers.
  'OAI-SearchBot',
  'Claude-SearchBot',
  'PerplexityBot',
  'Bingbot',
  // Training crawlers.
  'GPTBot',
  'ClaudeBot',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: '/' })),
    ],
    sitemap: `${siteMetadata.siteUrl}/sitemap.xml`,
    host: siteMetadata.siteUrl,
  }
}
