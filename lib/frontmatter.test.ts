import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { createPost, parsePost, updatePost, type ManagedFields } from './frontmatter'

/**
 * These matter more than anything else in the editor: this is the code that
 * overwrites posts that are already published. A bug here is not a broken
 * screen, it is a live post quietly losing its video or its date.
 */

const DIR = 'data/blog'
const posts = readdirSync(DIR).filter((name) => name.endsWith('.mdx'))

const fields = (over: Partial<ManagedFields> = {}): ManagedFields => ({
  title: 'A Title',
  date: '2026-01-02',
  lastmod: '2026-01-02',
  tags: ['one', 'two'],
  draft: false,
  summary: 'A summary.',
  ...over,
})

describe('quoting', () => {
  it('uses double quotes when a value contains an apostrophe', () => {
    // Nine of the real posts are written this way. Emitting YAML's other legal
    // form ('It''s') would rewrite every one of them on an unrelated edit.
    const out = createPost(fields({ title: "It's Not 1994" }), 'Body.')
    expect(out).toContain(`title: "It's Not 1994"`)
  })

  it('uses single quotes when there is no apostrophe', () => {
    expect(createPost(fields({ title: 'Plain Title' }), 'Body.')).toContain(`title: 'Plain Title'`)
  })

  it('escapes double quotes inside a value that also has an apostrophe', () => {
    const out = createPost(fields({ summary: `She said "it's fine"` }), 'Body.')
    expect(parsePost(out).summary).toBe(`She said "it's fine"`)
  })

  it('round-trips a title through parse and create unchanged', () => {
    for (const title of [
      "What's Probably Missing",
      'No Apostrophe Here',
      'Dashes - and : colons',
    ]) {
      expect(parsePost(createPost(fields({ title }), 'Body.')).title).toBe(title)
    }
  })
})

describe('tags', () => {
  it('writes an inline array, matching the existing posts', () => {
    expect(createPost(fields({ tags: ['hiring', 'job-search'] }), 'Body.')).toContain(
      `tags: ['hiring', 'job-search']`
    )
  })

  it('writes an empty array rather than omitting the key', () => {
    expect(createPost(fields({ tags: [] }), 'Body.')).toContain('tags: []')
  })
})

describe('updatePost', () => {
  const original = [
    '---',
    "title: 'Original'",
    "date: '2025-01-01'",
    "lastmod: '2025-01-01'",
    "tags: ['a']",
    'draft: false',
    "summary: 'Original summary.'",
    'media:',
    '  type: none',
    '  video:',
    '    provider: YouTube',
    "    url: 'https://example.com/v'",
    "    duration: '42 min'",
    '---',
    '',
    'The body.',
    '',
  ].join('\n')

  it('leaves keys it does not manage byte-identical', () => {
    const post = parsePost(original)
    const out = updatePost(original, { ...post, title: 'Renamed' }, post.body)

    expect(out).toContain('media:\n  type: none\n  video:\n    provider: YouTube')
    expect(out).toContain("    duration: '42 min'")
  })

  it('changes only the line it was asked to change', () => {
    const post = parsePost(original)
    const out = updatePost(original, { ...post, title: 'Renamed' }, post.body)

    const moved = original
      .split('\n')
      .map((line, i) => [line, out.split('\n')[i]])
      .filter(([before, after]) => before !== after)

    expect(moved).toHaveLength(1)
    expect(moved[0][1]).toBe("title: 'Renamed'")
  })

  it('inserts a missing managed key in its canonical position', () => {
    const withoutLastmod = original.replace("lastmod: '2025-01-01'\n", '')
    const post = parsePost(withoutLastmod)
    const out = updatePost(withoutLastmod, { ...post, lastmod: '2026-05-05' }, post.body)
    const lines = out.split('\n')

    expect(lines.indexOf("lastmod: '2026-05-05'")).toBe(lines.indexOf("date: '2025-01-01'") + 1)
  })

  it('refuses a multi-line managed key rather than guessing at it', () => {
    const blockTags = original.replace("tags: ['a']", 'tags:\n  - a\n  - b')
    const post = parsePost(blockTags)
    expect(() => updatePost(blockTags, post, post.body)).toThrow(/multi-line block/)
  })

  it('throws on a file with no frontmatter instead of writing a broken one', () => {
    expect(() => updatePost('just a body', fields(), 'x')).toThrow(/no frontmatter/)
  })
})

describe('every real post', () => {
  it.each(posts)('%s survives a no-op round trip byte-identical', (name) => {
    const original = readFileSync(join(DIR, name), 'utf8')
    const post = parsePost(original)
    expect(updatePost(original, post, post.body)).toBe(original)
  })
})
