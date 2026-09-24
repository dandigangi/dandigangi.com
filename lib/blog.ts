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
 * Which colour each tag gets, keyed by tag.
 *
 * One answer for the whole build, so the chip on the index, the tag beside a
 * post in the list, and the chips in a post's sidebar all agree. That is also
 * why it is not Math.random(): each page works this out on its own, and a
 * random pick would give one tag a different colour on every page.
 *
 * Every tag gets its own step on the ramp, but not in ranking order — in order,
 * neighbours in the ranking were neighbours in colour, and a post tagged with
 * two of them showed two near-identical chips. So the steps start scattered
 * (a golden-ratio stride over the ramp) and are then swapped, pair by pair,
 * while doing so pushes tags that share a post further apart. Deterministic
 * throughout: the same tags on the same posts always give the same colours.
 */
export function getTagHues(): Record<string, TagHue> {
  tagHues ??= spreadTagHues()
  return tagHues
}

let tagHues: Record<string, TagHue> | undefined

function spreadTagHues(): Record<string, TagHue> {
  const tags = Object.entries(getTagCounts())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag)
  const count = tags.length

  const scattered = [...Array(count).keys()].sort((a, b) => ((a * GOLDEN) % 1) - ((b * GOLDEN) % 1))
  const step = new Map(tags.map((tag, index) => [tag, scattered[index]]))

  // How often each pair of tags shares a post; those are the pairs to separate.
  const shared = new Map<string, { a: string; b: string; posts: number }>()
  for (const post of getPublishedPosts()) {
    for (let i = 0; i < post.tags.length; i += 1) {
      for (let j = i + 1; j < post.tags.length; j += 1) {
        const [a, b] = [post.tags[i], post.tags[j]].sort()
        const pair = shared.get(`${a}|${b}`) ?? { a, b, posts: 0 }
        pair.posts += 1
        shared.set(`${a}|${b}`, pair)
      }
    }
  }
  // Inverse-square, so one pair a step apart outweighs several comfortably spread.
  const clash = () => {
    let total = 0
    for (const { a, b, posts } of shared.values()) {
      total += posts / (step.get(a)! - step.get(b)!) ** 2
    }
    return total
  }

  const swap = (a: string, b: string) => {
    const held = step.get(a)!
    step.set(a, step.get(b)!)
    step.set(b, held)
  }

  let current = clash()
  for (let improved = true; improved;) {
    improved = false
    for (let i = 0; i < count; i += 1) {
      for (let j = i + 1; j < count; j += 1) {
        swap(tags[i], tags[j])
        const next = clash()
        if (next < current) {
          current = next
          improved = true
        } else {
          swap(tags[i], tags[j])
        }
      }
    }
  }

  return Object.fromEntries(tags.map((tag) => [tag, tagHue(step.get(tag)!, count)]))
}

const GOLDEN = 0.618034

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
