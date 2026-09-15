import { MetadataRoute } from 'next'
import { getPublishedPosts, getTagCounts } from '@/lib/blog'
import siteMetadata from '@/data/siteMetadata'

const POSTS_PER_PAGE = 7

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl
  const published = getPublishedPosts()

  /**
   * Stamping every route with the build date tells crawlers the whole site
   * changes daily, which devalues the signal for the pages that genuinely did.
   * Listing-style routes inherit the newest post they contain; pages with no
   * meaningful date omit lastModified entirely rather than inventing one.
   */
  const latestPostDate = published[0]?.lastmod || published[0]?.date

  const postRoutes = published.map((post) => ({
    url: `${siteUrl}${post.permalink}`,
    lastModified: post.lastmod || post.date,
  }))

  const datelessRoutes = ['', 'about', 'projects', 'resume', 'contact'].map((route) => ({
    url: `${siteUrl}/${route}`,
  }))

  const listingRoutes = ['blog', 'blog/tags'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: latestPostDate,
  }))

  const staticRoutes = [...datelessRoutes, ...listingRoutes]

  const totalPages = Math.ceil(published.length / POSTS_PER_PAGE)
  const paginatedRoutes = Array.from({ length: Math.max(totalPages - 1, 0) }, (_, i) => ({
    url: `${siteUrl}/blog/page/${i + 2}`,
    lastModified: latestPostDate,
  }))

  const tagRoutes = Object.keys(getTagCounts()).map((tag) => {
    const newest = published.find((post) => post.tags.includes(tag))
    return {
      url: `${siteUrl}/blog/tags/${tag}`,
      lastModified: newest?.lastmod || newest?.date,
    }
  })

  return [...staticRoutes, ...postRoutes, ...paginatedRoutes, ...tagRoutes]
}
