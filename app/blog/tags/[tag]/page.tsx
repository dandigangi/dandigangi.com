import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPostsByTag, getTagCounts, POSTS_PER_PAGE } from '@/lib/blog'
import { formatTag } from '@/lib/format'
import BlogIndex from '@/components/BlogIndex'
import { genPageMetadata } from 'app/seo'

type Props = { params: Promise<{ tag: string }> }

export async function generateStaticParams() {
  return Object.keys(getTagCounts()).map((tag) => ({ tag }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params
  const label = formatTag(decodeURIComponent(tag))
  return genPageMetadata({
    // "Engineering Management" alone is ambiguous in a tab strip or a search
    // result — it reads as a page about the topic rather than an index of posts.
    title: `${label} Blog Posts`,
    description: `Posts tagged ${label}.`,
    alternates: { canonical: `/blog/tags/${tag}` },
  })
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params
  const decoded = decodeURIComponent(tag)
  const posts = getPostsByTag(decoded)

  if (posts.length === 0) notFound()

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)

  return (
    <BlogIndex
      posts={posts.slice(0, POSTS_PER_PAGE)}
      page={1}
      totalPages={totalPages}
      activeTag={decoded}
      title={formatTag(decoded)}
      basePath={`/blog/tags/${tag}`}
    />
  )
}
