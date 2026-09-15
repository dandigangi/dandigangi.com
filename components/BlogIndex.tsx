import Link from 'next/link'
import type { Post } from '@/lib/blog'
import { getPublishedPosts, getTagCounts } from '@/lib/blog'
import PageBand from './PageBand'
import PostList from './PostList'
import PostSearch, { type SearchEntry } from './PostSearch'
import styles from './BlogIndex.module.css'

const TAG_CHIP_COUNT = 12

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
  const allPosts = getPublishedPosts()

  // A post carries several tags, so the total is the post count, not the sum of
  // the per-tag counts.
  const allCount = allPosts.length

  // Search covers every post, not just the current page or tag — carries only
  // the fields it matches on, so the payload stays around 10KB.
  const searchIndex: SearchEntry[] = allPosts.map((post) => ({
    slug: post.slug,
    title: post.title,
    summary: post.summary,
    tags: post.tags,
    date: post.date,
    permalink: post.permalink,
  }))
  const topTags = Object.entries(getTagCounts())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, TAG_CHIP_COUNT)

  return (
    <>
      <PageBand title={title} objectPosition="20% 40%" />

      <div className={`container ${styles.body}`}>
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
                {tag} ({count})
              </Link>
            ))}
          </div>
        </div>

        <div className="rail">
          <PostSearch index={searchIndex}>
            <PostList posts={posts} />
          </PostSearch>
        </div>

        {totalPages > 1 && (
          <div className={`rail ${styles.pagination}`}>
            <span className="label">
              {page} of {totalPages}
            </span>
            <div className={styles.pageLinks}>
              {page > 1 && (
                <Link href={page === 2 ? basePath : `${basePath}/page/${page - 1}`} className="btn">
                  ← Previous
                </Link>
              )}
              {page < totalPages && (
                <Link href={`${basePath}/page/${page + 1}`} className="btn">
                  Next →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
