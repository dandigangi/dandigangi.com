import { MetadataRoute } from 'next'
import { getPublishedBlogs } from '@/lib/blog'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'

const POSTS_PER_PAGE = 7

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl
  const blogRoutes = getPublishedBlogs().map((post) => ({
    url: `${siteUrl}/${post.path}`,
    lastModified: post.lastmod || post.date,
  }))

  const staticRoutes = ['', 'blog', 'about', 'connect', 'blog/tags'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  const published = getPublishedBlogs()
  const totalPages = Math.ceil(published.length / POSTS_PER_PAGE)
  const paginatedBlogRoutes =
    totalPages > 1
      ? Array.from({ length: totalPages - 1 }, (_, i) => ({
          url: `${siteUrl}/blog/page/${i + 2}`,
          lastModified: new Date().toISOString().split('T')[0],
        }))
      : []

  const tagKeys = Object.keys(tagData as Record<string, number>)
  const tagRoutes = tagKeys.map((tag) => ({
    url: `${siteUrl}/blog/tags/${tag}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...staticRoutes, ...blogRoutes, ...paginatedBlogRoutes, ...tagRoutes]
}
