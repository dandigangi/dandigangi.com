import Link from 'next/link'
import type { Post } from '@/lib/blog'
import { getPublishedPosts, getTagCounts } from '@/lib/blog'
import { formatTag } from '@/lib/format'
import PageBand from './PageBand'
import Pagination from './Pagination'
import PostList from './PostList'
import PostSearch, { type SearchEntry } from './PostSearch'
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
  /**
   * Every tag, not a top-N slice. The row was capped at 12, which did two bad
   * things at once: a new or rarely-used tag was simply missing from the filter
   * row, and landing on that tag's own page highlighted nothing at all — "All"
   * read as inactive and no chip was marked, so the page looked unfiltered.
   *
   * Fifteen tags wrap to two rows. If the vocabulary ever grows past what reads
   * as a filter row, the fix is to prune tags rather than to hide them here.
   */
  const tags = Object.entries(getTagCounts()).sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
  )

  return (
    <>
      <PageBand
        title={title}
        titleSuffix={activeTag ? 'Blog Posts' : undefined}
        compact={Boolean(activeTag)}
        objectPosition="20% 40%"
      />

      <div className={`container ${styles.body}`}>
        <div className={`rail ${styles.filters}`}>
          <span className="label">Tags</span>
          <div className={styles.chips}>
            {/* No hue: "All" is the absence of a filter, so it keeps the plain
                white treatment the rainbow runs against. */}
            <Link href="/blog" className="chip" data-active={!activeTag}>
              All ({allCount})
            </Link>
            {tags.map(([tag, count], index) => (
              <Link
                key={tag}
                href={`/blog/tags/${tag}`}
                className="chip"
                data-hue={index % 7}
                data-active={activeTag === tag}
              >
                {formatTag(tag)} ({count})
              </Link>
            ))}
          </div>
        </div>

        <div className="rail">
          <PostSearch index={searchIndex} scopeNote={activeTag ? formatTag(activeTag) : undefined}>
            <PostList posts={posts} />
          </PostSearch>
        </div>

        {totalPages > 1 && (
          <div className={`rail ${styles.pagination}`}>
            <span className="label">
              Page {page} of {totalPages}
            </span>
            <Pagination page={page} totalPages={totalPages} basePath={basePath} />
          </div>
        )}
      </div>
    </>
  )
}
