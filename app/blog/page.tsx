import { getPublishedPosts, POSTS_PER_PAGE } from '@/lib/blog'
import BlogIndex from '@/components/BlogIndex'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Blog',
  description:
    'Writing on engineering management, hiring, career growth, and mental health in tech.',
  alternates: { canonical: '/blog' },
})

export default function BlogPage() {
  const posts = getPublishedPosts()
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)

  return <BlogIndex posts={posts.slice(0, POSTS_PER_PAGE)} page={1} totalPages={totalPages} />
}
