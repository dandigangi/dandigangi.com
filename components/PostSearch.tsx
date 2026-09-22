'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { formatFullDate, formatTag } from '@/lib/format'
import { setSearchEgg } from '@/lib/pikachu'
import EggToast from './EggToast'
import styles from './PostSearch.module.css'

/** Type his name and the hero above you goes yellow, for exactly as long as it
 *  stays typed. Matched on the whole query, not a substring — a post about him
 *  should not put him on the page. */
const EGG = 'pikachu'

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
  hues = {},
  scopeNote,
  children,
}: {
  index: SearchEntry[]
  /** Rainbow step per tag, from `getTagHues()`. Passed in rather than derived:
   *  this runs on the client and has no access to the post collection. */
  hues?: Record<string, number>
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
  const egg = trimmed === EGG

  /**
   * The hero lives in PageBand, well outside this subtree, so it is told through
   * the store rather than through props. Cleared on unmount as well as on
   * change: navigating away with the word still in the box would otherwise
   * leave every later page yellow.
   */
  useEffect(() => {
    setSearchEgg(egg)
    return () => setSearchEgg(false)
  }, [egg])

  const results = useMemo(() => {
    if (!trimmed) return []
    return index.filter((post) => {
      const haystack = [post.title, post.summary ?? '', post.tags.join(' ')].join(' ').toLowerCase()
      return trimmed.split(/\s+/).every((term) => haystack.includes(term))
    })
  }, [index, trimmed])

  /**
   * The egg fired and the index genuinely has nothing — which is the joke, so
   * the empty state becomes the payoff rather than a dead end. Guarded on the
   * result count as well as the query: if a post about him ever gets written,
   * the real results win and this quietly stops appearing.
   */
  const caught = egg && results.length === 0

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
          <span className={`label ${caught ? styles.eggLabel : ''}`} aria-live="polite">
            {caught ? (
              '1 Pokémon'
            ) : (
              <>
                {results.length} {results.length === 1 ? 'result' : 'results'}
                {scopeNote ? ` across all tags, not just ${scopeNote}` : ''}
              </>
            )}
          </span>
        ) : null}
      </div>

      <EggToast show={egg} />

      {trimmed ? (
        <div className={styles.results}>
          {caught ? (
            <p className={`${styles.empty} ${styles.eggEmpty}`}>
              Nothing matches “pikachu” except{' '}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/static/images/pikachu.png" alt="Pikachu" className={styles.eggSprite} />.
              Try throwing a Pokéball!
            </p>
          ) : results.length === 0 ? (
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
                  {post.tags[0] && (
                    <>
                      {' · '}
                      <span className={styles.rowTag} data-hue={hues[post.tags[0]]}>
                        {formatTag(post.tags[0])}
                      </span>
                    </>
                  )}
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
