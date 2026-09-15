import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPublishedPosts, POSTS_PER_PAGE } from '@/lib/blog'
import BlogIndex from '@/components/BlogIndex'
import { genPageMetadata } from 'app/seo'

type Props = { params: Promise<{ page: string }> }

/**
 * Per-page rather than a shared constant: every paginated page otherwise ships
 * the same title, description and canonical as /blog, which reads to a crawler
 * as five near-duplicate pages.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params
  const totalPages = Math.ceil(getPublishedPosts().length / POSTS_PER_PAGE)
  return genPageMetadata({
    title: `Blog — Page ${page} of ${totalPages}`,
    description: `Page ${page} of writing on engineering management, hiring, career growth, and mental health in tech.`,
    alternates: { canonical: `/blog/page/${page}` },
  })
}

export async function generateStaticParams() {
  const totalPages = Math.ceil(getPublishedPosts().length / POSTS_PER_PAGE)
  return Array.from({ length: Math.max(totalPages - 1, 0) }, (_, i) => ({
    page: String(i + 2),
  }))
}

export default async function BlogPaginatedPage({ params }: Props) {
  const { page } = await params
  const pageNumber = Number(page)
  const posts = getPublishedPosts()
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)

  if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > totalPages) notFound()

  const start = (pageNumber - 1) * POSTS_PER_PAGE

  return (
    <BlogIndex
      posts={posts.slice(start, start + POSTS_PER_PAGE)}
      page={pageNumber}
      totalPages={totalPages}
    />
  )
}
