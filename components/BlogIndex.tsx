import Link from 'next/link'
import type { Post } from '@/lib/blog'
import { getTagCounts } from '@/lib/blog'
import { formatTag } from '@/lib/format'
import PageBand from './PageBand'
import PostList from './PostList'
import styles from './BlogIndex.module.css'

export default function BlogIndex({
  posts,
  page,
  totalPages,
  activeTag,
  title = 'Blog',
  basePath = '/blog',
}: {
  posts: Post[]
  page: number
  totalPages: number
  activeTag?: string
  title?: string
  basePath?: string
}) {
  const tagCounts = getTagCounts()
  const allCount = Object.values(tagCounts).reduce((a, b) => a + b, 0)
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)

  return (
    <>
      <PageBand title={title} objectPosition="20% 40%" />

      <div className="container">
        <div className={`rail ${styles.filters}`}>
          <span className="label">Tags</span>
          <div className={styles.chips}>
            <Link href="/blog" className="chip" data-active={!activeTag}>
              All ({allCount})
            </Link>
            {topTags.map(([tag, count]) => (
              <Link
                key={tag}
                href={`/blog/tags/${tag}`}
                className="chip"
                data-active={activeTag === tag}
              >
                {formatTag(tag)} ({count})
              </Link>
            ))}
          </div>
        </div>

        <div className="rail">
          <PostList posts={posts} />
        </div>

        {totalPages > 1 && (
          <div className={`rail ${styles.pagination}`}>
            <span className="label">
              Page {page} of {totalPages}
            </span>
            <div className={styles.pageLinks}>
              {page > 1 && (
                <Link href={page === 2 ? basePath : `${basePath}/page/${page - 1}`} className="btn">
                  ← Newer posts
                </Link>
              )}
              {page < totalPages && (
                <Link href={`${basePath}/page/${page + 1}`} className="btn">
                  Older posts →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
