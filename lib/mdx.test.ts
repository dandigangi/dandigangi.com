import { describe, expect, it } from 'vitest'
import posts from '../.velite/posts.json'
import { components } from '@/components/MDXComponents'
import { requiredComponents } from './mdx'

/**
 * The guard against a published post referencing a component that no longer
 * exists. MDX resolves those at render time and throws from inside React, so
 * without this the first sign of trouble is a 500 on a live post.
 *
 * Runs against the compiled bodies rather than the .mdx sources, so it sees
 * what the site will actually execute.
 */
describe('post embeds', () => {
  const supplied = new Set(Object.keys(components))
  const withEmbeds = (posts as { slug: string; body: string }[]).filter(
    (post) => requiredComponents(post.body).length > 0
  )

  it('finds the posts that use embeds at all', () => {
    // A guard on the guard: if the compiled shape ever changes, this drops to
    // zero and every assertion below passes for the wrong reason.
    expect(withEmbeds.length).toBeGreaterThan(0)
  })

  it.each(withEmbeds.map((post) => [post.slug, requiredComponents(post.body)] as const))(
    '%s resolves %s',
    (_slug, names) => {
      for (const name of names) expect(supplied).toContain(name)
    }
  )
})

describe('requiredComponents', () => {
  it('reads the name out of the guard MDX compiles', () => {
    const body = 'const{Spotify:r}=i;return r||function(e,n){throw new Error("")}("Spotify",!0)'
    expect(requiredComponents(body)).toEqual(['Spotify'])
  })

  it('returns nothing for a post with no embeds', () => {
    expect(requiredComponents('return t(e,{children:"just prose"})')).toEqual([])
  })

  it('de-duplicates a component used twice', () => {
    expect(requiredComponents('("Video",!0) ... ("Video",!0)')).toEqual(['Video'])
  })
})
