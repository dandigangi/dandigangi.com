import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPostsByTag, getTagCounts, POSTS_PER_PAGE } from '@/lib/blog'
import { formatTag } from '@/lib/format'
import BlogIndex from '@/components/BlogIndex'
import { genPageMetadata } from 'app/seo'

type Props = { params: Promise<{ tag: string; page: string }> }

/**
 * This route exists because the tag index already linked to it. BlogIndex builds
 * its Next link from `basePath`, which on a tag page is `/blog/tags/<tag>` — so
 * any tag with more than one page of posts pointed at a URL that had no route
 * and 404'd. The paging maths was right; the destination did not exist.
 */
export async function generateStaticParams() {
  return Object.entries(getTagCounts()).flatMap(([tag, count]) => {
    const totalPages = Math.ceil(count / POSTS_PER_PAGE)
    return Array.from({ length: Math.max(totalPages - 1, 0) }, (_, i) => ({
      tag,
      page: String(i + 2),
    }))
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag, page } = await params
  const decoded = decodeURIComponent(tag)
  const label = formatTag(decoded)
  return genPageMetadata({
    // No "of N" here, unlike /blog/page/N. A long tag plus the site suffix
    // already runs to the 60 characters Google shows, and the total is the part
    // a search result can most afford to lose.
    title: `${label} Blog Posts — Page ${page}`,
    description: `Page ${page} of posts tagged ${label}.`,
    alternates: { canonical: `/blog/tags/${tag}/page/${page}` },
  })
}

export default async function TagPaginatedPage({ params }: Props) {
  const { tag, page } = await params
  const decoded = decodeURIComponent(tag)
  const pageNumber = Number(page)
  const posts = getPostsByTag(decoded)
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)

  // `pageNumber > totalPages` is the case that used to 404 by accident; now it
  // 404s on purpose, and only for a page that genuinely has no posts on it.
  if (!Number.isInteger(pageNumber) || pageNumber < 2 || pageNumber > totalPages) notFound()

  const start = (pageNumber - 1) * POSTS_PER_PAGE

  return (
    <BlogIndex
      posts={posts.slice(start, start + POSTS_PER_PAGE)}
      page={pageNumber}
      totalPages={totalPages}
      activeTag={decoded}
      title={formatTag(decoded)}
      basePath={`/blog/tags/${tag}`}
    />
  )
}
