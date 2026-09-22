'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { formatFullDate, formatTag } from '@/lib/format'
import { setHinted } from '@/lib/caller'
import { veiled } from '@/lib/copy'
import Blip from './Blip'
import Toss from './Toss'
import styles from './PostSearch.module.css'
import { T } from '@/lib/ledger'

/**
 * Type his name and the hero above you goes yellow, for exactly as long as it
 * stays typed. Matched on the whole query, not a substring — a post about him
 * should not put him on the page.
 *
 * Encoded along with the copy it unlocks, so the built JS does not simply tell
 * you what to type. See lib/copy.ts.
 */
const EGG = veiled('cGlrYWNodQ==')
const MISS = veiled('Tm90aGluZyBtYXRjaGVzIOKAnHBpa2FjaHXigJ0gZXhjZXB0')
const NUDGE = veiled('LiBUcnkgdGhyb3dpbmcgYSBQb2vDqWJhbGwh')
const THROW_LABEL = veiled('VGhyb3cgYSBQb2vDqWJhbGwgYXQgUGlrYWNodQ==')

/** The query-string key. Short, and the one every other blog URL already uses. */
const PARAM = 'q'

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
   * Seeded from ?q= after mount rather than in the initial state.
   *
   * These pages are statically generated, so the server has no query string and
   * rendering the filtered list straight away would be a hydration mismatch —
   * the server would send the full list and the client would send four results.
   * An effect costs one frame of the server list and cannot disagree with it.
   *
   * Read off `location` rather than through `useSearchParams`, which opts the
   * whole route out of static rendering unless it is wrapped in Suspense. There
   * is nothing here worth that.
   */
  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get(PARAM)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the rule is right in general; here the whole point is to read a client-only source after hydration rather than during it.
    if (initial) setQuery(initial)
  }, [])

  /**
   * And written back on every change, so the URL is always the one to share.
   *
   * `replaceState`, not a router navigation: this is a box you type into, and
   * pushing an entry per keystroke would turn the back button into an undo key
   * for the last twenty characters. It also skips the re-render a navigation
   * would cost on every letter.
   *
   * An empty box drops the parameter rather than leaving `?q=` behind.
   */
  const mounted = useRef(false)
  useEffect(() => {
    /*
     * Skipped on mount, and it has to be. Both effects run in the same commit,
     * so without this the write would fire with the empty initial state and
     * strip the very ?q= the read above had just picked up, before the
     * re-render put it back.
     */
    if (!mounted.current) {
      mounted.current = true
      return
    }
    const url = new URL(window.location.href)
    if (query) url.searchParams.set(PARAM, query)
    else url.searchParams.delete(PARAM)
    const next = `${url.pathname}${url.search}${url.hash}`
    if (next !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      window.history.replaceState(window.history.state, '', next)
    }
  }, [query])

  /**
   * The hero lives in PageBand, well outside this subtree, so it is told through
   * the store rather than through props. Cleared on unmount as well as on
   * change: navigating away with the word still in the box would otherwise
   * leave every later page yellow.
   */
  useEffect(() => {
    setHinted(egg)
    return () => setHinted(false)
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

  /**
   * Balls in flight. A list rather than one at a time on purpose — the line
   * invites you to throw one, and the only right answer to someone spamming it
   * is more Pokéballs, not a queue.
   */
  const [balls, setBalls] = useState<{ id: number; x: number; y: number }[]>([])
  const nextBall = useRef(0)
  const sprite = useRef<HTMLButtonElement>(null)
  /** Latched on the first throw; the toast outlives the ball that earned it. */
  const [spriteEgg, setSpriteEgg] = useState(false)

  const throwBall = () => {
    const rect = sprite.current?.getBoundingClientRect()
    if (!rect) return
    setSpriteEgg(true)
    nextBall.current += 1
    setBalls((flying) => [
      ...flying,
      { id: nextBall.current, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
    ])
  }

  const landed = (id: number) => setBalls((flying) => flying.filter((ball) => ball.id !== id))

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
          <span className={`label ${caught ? styles.tally : ''}`} aria-live="polite">
            {caught ? (
              veiled('MSBQb2vDqW1vbg==')
            ) : (
              <>
                {results.length} {results.length === 1 ? 'result' : 'results'}
                {scopeNote ? ` across all tags, not just ${scopeNote}` : ''}
              </>
            )}
          </span>
        ) : null}
      </div>

      {/*
       * Both are fixed to the same spot, so the later find hides the earlier
       * one rather than landing on top of it. This used to be an outright
       * either-or, which meant that once the sprite egg had been found and
       * dismissed, typing his name never announced anything again all visit.
       * It is safe now only because a toast announces a *new* find: by the time
       * the sprite is thrown the search toast has already done its job, and on
       * any later visit neither says anything at all.
       */}
      <Blip egg={T.probe} show={egg && !spriteEgg} />
      <Blip egg={T.toss} show={spriteEgg} />

      {balls.map((ball) => (
        <Toss key={ball.id} x={ball.x} y={ball.y} onDone={() => landed(ball.id)} />
      ))}

      {trimmed ? (
        <div className={styles.results}>
          {caught ? (
            <p className={`${styles.empty} ${styles.miss}`}>
              {MISS}{' '}
              <button
                type="button"
                ref={sprite}
                className={styles.spr}
                onClick={throwBall}
                aria-label={THROW_LABEL}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/static/images/sprite-a.png" alt="" />
              </button>
              {NUDGE}
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
