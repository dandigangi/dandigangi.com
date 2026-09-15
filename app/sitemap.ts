import { MetadataRoute } from 'next'
import { getPublishedPosts, getTagCounts } from '@/lib/blog'
import siteMetadata from '@/data/siteMetadata'

const POSTS_PER_PAGE = 7

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl
  const today = new Date().toISOString().split('T')[0]
  const published = getPublishedPosts()

  const postRoutes = published.map((post) => ({
    url: `${siteUrl}${post.permalink}`,
    lastModified: post.lastmod || post.date,
  }))

  const staticRoutes = ['', 'blog', 'about', 'resume', 'contact', 'blog/tags'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: today,
  }))

  const totalPages = Math.ceil(published.length / POSTS_PER_PAGE)
  const paginatedRoutes = Array.from({ length: Math.max(totalPages - 1, 0) }, (_, i) => ({
    url: `${siteUrl}/blog/page/${i + 2}`,
    lastModified: today,
  }))

  const tagRoutes = Object.keys(getTagCounts()).map((tag) => ({
    url: `${siteUrl}/blog/tags/${tag}`,
    lastModified: today,
  }))

  return [...staticRoutes, ...postRoutes, ...paginatedRoutes, ...tagRoutes]
}
