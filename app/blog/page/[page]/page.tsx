import { notFound } from 'next/navigation'
import { getPublishedPosts, POSTS_PER_PAGE } from '@/lib/blog'
import BlogIndex from '@/components/BlogIndex'
import { genPageMetadata } from 'app/seo'

type Props = { params: Promise<{ page: string }> }

export const metadata = genPageMetadata({
  title: 'Blog',
  description:
    'Writing on engineering management, hiring, career growth, and mental health in tech.',
})

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
