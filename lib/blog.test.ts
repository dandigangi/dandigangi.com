import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * The content collection is generated at build time, so these run against a
 * fixed set of fake posts rather than the real 35 — the point is the filtering
 * and ordering rules, which must not depend on what happens to be published.
 */
const post = (over: Partial<Record<string, unknown>> = {}) => ({
  slug: 'a-post',
  title: 'A post',
  date: '2026-01-01',
  tags: [] as string[],
  draft: false,
  body: 'compiled',
  raw: 'source',
  toc: [],
  ...over,
})

const posts = [
  post({ slug: 'newest', date: '2026-03-01', tags: ['a', 'b'] }),
  post({ slug: 'middle', date: '2026-02-01', tags: ['a'] }),
  post({ slug: 'oldest', date: '2026-01-01', tags: ['b', 'c'] }),
  post({ slug: 'a-draft', date: '2026-02-15', draft: true, tags: ['a'] }),
  post({ slug: 'future', date: '2099-01-01', tags: ['a'] }),
  post({ slug: 'untagged', date: '2026-02-20', tags: [] }),
]

vi.mock('@/content', () => ({ posts }))

const load = async () => import('./blog')

beforeEach(() => {
  vi.useFakeTimers()
  // Between "middle" and "newest", and far short of "future".
  vi.setSystemTime(new Date('2026-06-15T12:00:00Z'))
})

afterEach(() => vi.useRealTimers())

describe('getPublishedPosts', () => {
  it('hides drafts', async () => {
    const { getPublishedPosts } = await load()
    expect(getPublishedPosts().map((p) => p.slug)).not.toContain('a-draft')
  })

  it('hides posts dated in the future', async () => {
    const { getPublishedPosts } = await load()
    expect(getPublishedPosts().map((p) => p.slug)).not.toContain('future')
  })

  it('publishes a post on the day its date arrives', async () => {
    vi.setSystemTime(new Date('2099-01-01T00:00:00Z'))
    const { getPublishedPosts } = await load()
    expect(getPublishedPosts().map((p) => p.slug)).toContain('future')
  })

  it('returns newest first', async () => {
    const { getPublishedPosts } = await load()
    expect(getPublishedPosts().map((p) => p.slug)).toEqual([
      'newest',
      'untagged',
      'middle',
      'oldest',
    ])
  })

  it('does not mutate the source collection', async () => {
    const { getPublishedPosts } = await load()
    getPublishedPosts()
    expect(posts.map((p) => p.slug)[0]).toBe('newest')
    expect(posts).toHaveLength(6)
  })
})

describe('getAdjacentPosts', () => {
  it('walks in reading order, newer as next', async () => {
    const { getAdjacentPosts } = await load()
    const { prev, next } = getAdjacentPosts('middle')
    expect(next?.slug).toBe('untagged')
    expect(prev?.slug).toBe('oldest')
  })

  it('leaves the ends open', async () => {
    const { getAdjacentPosts } = await load()
    expect(getAdjacentPosts('newest').next).toBeUndefined()
    expect(getAdjacentPosts('oldest').prev).toBeUndefined()
  })

  it('returns nothing for a slug that is not published', async () => {
    const { getAdjacentPosts } = await load()
    expect(getAdjacentPosts('a-draft')).toEqual({})
  })
})

describe('getTagCounts', () => {
  it('counts only published posts', async () => {
    const { getTagCounts } = await load()
    // 'a' is on newest + middle; the draft and the future post also carry it.
    expect(getTagCounts()).toEqual({ a: 2, b: 2, c: 1 })
  })
})

describe('getRelatedPosts', () => {
  it('ranks by shared tags, then recency', async () => {
    const { getRelatedPosts } = await load()
    expect(getRelatedPosts('newest').map((p) => p.slug)).toEqual(['middle', 'oldest'])
  })

  it('never includes the post itself, a draft, or a future post', async () => {
    const { getRelatedPosts } = await load()
    const slugs = getRelatedPosts('middle').map((p) => p.slug)
    expect(slugs).not.toContain('middle')
    expect(slugs).not.toContain('a-draft')
    expect(slugs).not.toContain('future')
  })

  it('returns nothing for an untagged post rather than filling with anything', async () => {
    const { getRelatedPosts } = await load()
    expect(getRelatedPosts('untagged')).toEqual([])
  })

  it('respects the limit', async () => {
    const { getRelatedPosts } = await load()
    expect(getRelatedPosts('newest', 1)).toHaveLength(1)
  })
})

describe('toListPost', () => {
  it('drops the heavy fields list views never render', async () => {
    const { toListPost } = await load()
    const listed = toListPost(post() as never)
    expect(listed).not.toHaveProperty('body')
    expect(listed).not.toHaveProperty('raw')
    expect(listed).not.toHaveProperty('toc')
    expect(listed).toHaveProperty('title')
  })
})
