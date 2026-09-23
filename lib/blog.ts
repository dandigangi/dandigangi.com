import { posts, type Post } from '@/content'
import { tagHue, type TagHue } from './ramp'

/** Fields that are expensive to ship to list views. */
type ListPost = Omit<Post, 'body' | 'raw' | 'toc'>

const todayUTC = () => new Date().toISOString().slice(0, 10)

const sortByDateDesc = <T extends { date: string }>(items: T[]) =>
  [...items].sort((a, b) => +new Date(b.date) - +new Date(a.date))

/**
 * Published means: not a draft, and not future-dated. Posts are written ahead of
 * time with a future date and are expected to stay hidden until that date passes.
 */
export function getPublishedPosts(): Post[] {
  const today = todayUTC()
  return sortByDateDesc(posts.filter((p) => !p.draft && p.date.slice(0, 10) <= today))
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug)
}

/** Drops compiled MDX and TOC — list views never render them. */
export function toListPost(post: Post): ListPost {
  const { body, raw, toc, ...rest } = post
  return rest
}

export function getTagCounts(): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const post of getPublishedPosts()) {
    for (const tag of post.tags) {
      counts[tag] = (counts[tag] ?? 0) + 1
    }
  }
  return counts
}

/**
 * Which rainbow step each tag gets, keyed by tag.
 *
 * Derived from one ranking — most posts first, ties alphabetical — so the chip
 * on the index, the tag beside a post in the list, and the chips in a post's
 * sidebar all agree. Working it out from a local array index instead was what
 * made those disagree the moment any of the three sorted differently.
 *
 * Position-based rather than fixed per tag: a tag that climbs the ranking takes
 * the hue of its new slot, which keeps the run of colour intact as the blog
 * grows rather than leaving gaps where a tag used to sit.
 *
 * Spread across the whole ramp rather than cycling seven steps: with more tags
 * than steps the rainbow started over, and two tags on one post could share a
 * colour. Now every tag gets its own, however many there are.
 */
export function getTagHues(): Record<string, TagHue> {
  const ranked = Object.entries(getTagCounts()).sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
  )
  return Object.fromEntries(ranked.map(([tag], index) => [tag, tagHue(index, ranked.length)]))
}

/** Published posts carrying `tag`, newest first. Tags are matched exactly — they
 *  are URL segments, so there is only ever one spelling of each. */
export function getPostsByTag(tag: string): Post[] {
  return getPublishedPosts().filter((post) => post.tags.includes(tag))
}

export function getAdjacentPosts(slug: string): { prev?: Post; next?: Post } {
  const published = getPublishedPosts()
  const index = published.findIndex((p) => p.slug === slug)
  if (index === -1) return {}
  return {
    // published is newest-first, so the "next" post chronologically sits earlier in the array.
    next: published[index - 1],
    prev: published[index + 1],
  }
}

export type { Post, ListPost }

/** Design specifies seven posts per blog index page. */
export const POSTS_PER_PAGE = 7

/**
 * Posts sharing the most tags with the given one, best overlap first, ties
 * broken by recency. Returns fewer than `limit` — or nothing at all — when the
 * post's tags are not shared, which is why the caller must handle an empty list.
 */
export function getRelatedPosts(slug: string, limit = 3): Post[] {
  const published = getPublishedPosts()
  const current = published.find((p) => p.slug === slug)
  if (!current || current.tags.length === 0) return []

  return published
    .filter((p) => p.slug !== slug)
    .map((p) => ({ post: p, shared: p.tags.filter((t) => current.tags.includes(t)).length }))
    .filter((c) => c.shared > 0)
    .sort((a, b) => b.shared - a.shared || +new Date(b.post.date) - +new Date(a.post.date))
    .slice(0, limit)
    .map((c) => c.post)
}
