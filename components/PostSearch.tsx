'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { formatFullDate, formatTag } from '@/lib/format'
import styles from './PostSearch.module.css'

export type SearchEntry = {
  slug: string
  title: string
  summary?: string
  tags: string[]
  date: string
  permalink: string
}

/**
 * Filters entirely in the browser over a ~10KB index. At 35 posts a hosted
 * search service would cost an account, a key and a network round trip to do
 * worse than a substring match.
 *
 * `children` is the server-rendered, paginated list. It stays rendered on the
 * server and is simply swapped out while a query is active, so the crawlable
 * markup is unaffected.
 */
export default function PostSearch({
  index,
  scopeNote,
  children,
}: {
  index: SearchEntry[]
  /**
   * The tag whose page this is, when there is one. Search stays global there —
   * a box that can only find the four posts already listed below it is not
   * worth the width — but it has to say so, or a query silently leaves the tag
   * you thought you were inside.
   */
  scopeNote?: string
  children: React.ReactNode
}) {
  const [query, setQuery] = useState('')
  const trimmed = query.trim().toLowerCase()

  const results = useMemo(() => {
    if (!trimmed) return []
    return index.filter((post) => {
      const haystack = [post.title, post.summary ?? '', post.tags.join(' ')].join(' ').toLowerCase()
      return trimmed.split(/\s+/).every((term) => haystack.includes(term))
    })
  }, [index, trimmed])

  return (
    <>
      <div className={styles.field}>
        <label htmlFor="post-search" className="srOnly">
          Search posts
        </label>
        <input
          id="post-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={scopeNote ? 'Search all posts' : 'Search posts'}
          className={styles.input}
          autoComplete="off"
        />
        {trimmed ? (
          <span className="label" aria-live="polite">
            {results.length} {results.length === 1 ? 'result' : 'results'}
            {scopeNote ? ` across all tags, not just ${scopeNote}` : ''}
          </span>
        ) : null}
      </div>

      {trimmed ? (
        <div className={styles.results}>
          {results.length === 0 ? (
            <p className={styles.empty}>
              Nothing matches “{query.trim()}”. Try a broader term or browse by tag.
            </p>
          ) : (
            results.map((post) => (
              <Link key={post.slug} href={post.permalink} className={styles.row}>
                <div className={styles.rowMain}>
                  <h2 className={styles.title}>{post.title}</h2>
                  {post.summary ? <p className={styles.summary}>{post.summary}</p> : null}
                </div>
                <div className={`meta ${styles.rowMeta}`}>
                  {formatFullDate(post.date)}
                  {post.tags[0] ? ` · ${formatTag(post.tags[0])}` : ''}
                </div>
              </Link>
            ))
          )}
        </div>
      ) : (
        children
      )}
    </>
  )
}
