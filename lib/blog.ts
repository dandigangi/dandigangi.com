import { posts, type Post } from '@/content'

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
