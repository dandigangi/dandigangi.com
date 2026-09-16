import { writeFileSync, mkdirSync, readFileSync, rmSync } from 'fs'
import path from 'path'
import siteMetadata from '../data/siteMetadata.js'

const posts = JSON.parse(readFileSync(new URL('../.velite/posts.json', import.meta.url), 'utf8'))

const escape = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

/** Mirrors lib/blog.ts — drafts and future-dated posts stay out of the feed. */
const publishedPosts = () => {
  const today = new Date().toISOString().slice(0, 10)
  return posts
    .filter((post) => !post.draft && post.date.slice(0, 10) <= today)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

const generateRssItem = (config, post) => `
  <item>
    <guid>${config.siteUrl}/blog/${post.slug}</guid>
    <title>${escape(post.title)}</title>
    <link>${config.siteUrl}/blog/${post.slug}</link>
    ${post.summary ? `<description>${escape(post.summary)}</description>` : ''}
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>${config.email} (${config.author})</author>
    ${(post.tags || []).map((tag) => `<category>${escape(tag)}</category>`).join('')}
  </item>
`

const generateRss = (config, items, page = 'feed.xml') => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escape(config.title)}</title>
      <link>${config.siteUrl}/blog</link>
      <description>${escape(config.description)}</description>
      <language>${config.language}</language>
      <managingEditor>${config.email} (${config.author})</managingEditor>
      <webMaster>${config.email} (${config.author})</webMaster>
      <lastBuildDate>${new Date(items[0].date).toUTCString()}</lastBuildDate>
      <atom:link href="${config.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
      ${items.map((post) => generateRssItem(config, post)).join('')}
    </channel>
  </rss>
`

const rss = () => {
  const published = publishedPosts()
  if (published.length === 0) return

  writeFileSync('./public/feed.xml', generateRss(siteMetadata, published))

  /*
   * Cleared before writing, not merged into. This only ever added directories,
   * so a tag removed from the vocabulary kept serving its feed forever — four
   * of them were still live after the tag pages themselves had been redirected
   * away. Anyone subscribed was reading a feed for a tag that no longer exists.
   */
  rmSync(path.join('public', 'tags'), { recursive: true, force: true })

  const tags = [...new Set(published.flatMap((post) => post.tags || []))]
  for (const tag of tags) {
    const tagged = published.filter((post) => (post.tags || []).includes(tag))
    if (tagged.length === 0) continue
    const rssPath = path.join('public', 'tags', tag)
    mkdirSync(rssPath, { recursive: true })
    writeFileSync(
      path.join(rssPath, 'feed.xml'),
      generateRss(siteMetadata, tagged, `tags/${tag}/feed.xml`)
    )
  }

  console.log(`RSS generated: ${published.length} posts, ${tags.length} tag feeds`)
}

export default rss
