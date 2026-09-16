import matter from 'gray-matter'

/**
 * Reading and writing post frontmatter for the local editor.
 *
 * The rule that shapes this file: **keys the editor does not manage are never
 * re-serialised.** Their original bytes are carried through untouched.
 *
 * A YAML round trip only preserves data, not the text that expressed it — the
 * posts here use a hand-written style (single-quoted scalars, inline tag
 * arrays, a nested `media` block with inconsistent quoting) that no serialiser
 * will reproduce. Rewriting the whole block would turn a one-word typo fix into
 * a diff touching every line, and would silently flatten the one post whose
 * `media` block carries its video. So managed keys are substituted line by
 * line and everything else is left alone.
 *
 * `frontmatter.test.ts` asserts that reading and writing every real post with
 * no edits produces zero byte changes — it runs before every commit.
 */

/** The fields the editor owns. Everything else in a file is passed through. */
export type ManagedFields = {
  title: string
  date: string
  lastmod?: string
  tags: string[]
  draft: boolean
  summary: string
}

export type ParsedPost = ManagedFields & {
  body: string
  /** Every frontmatter key present in the file, managed or not. */
  keys: string[]
}

/** Order matches the existing posts, so a generated file reads like a hand one. */
const MANAGED_ORDER = ['title', 'date', 'lastmod', 'tags', 'draft', 'summary'] as const

/**
 * Matches how the posts are already written: single quotes normally, and double
 * quotes when the value contains an apostrophe. YAML would accept a doubled
 * single quote instead ('It''s'), but nine of the existing posts use the double
 * -quoted form, and rewriting them all to satisfy a serialiser is the diff noise
 * this file exists to avoid.
 */
const quote = (value: string) =>
  value.includes("'") ? `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"` : `'${value}'`

const line = (key: string, value: unknown): string | null => {
  switch (key) {
    case 'draft':
      return `draft: ${value === true}`
    case 'tags': {
      const tags = Array.isArray(value) ? value : []
      return `tags: [${tags.map((t) => quote(String(t))).join(', ')}]`
    }
    case 'lastmod':
      return value ? `lastmod: ${quote(String(value))}` : null
    default:
      return `${key}: ${quote(String(value ?? ''))}`
  }
}

const asDate = (value: unknown): string => {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value ?? '').slice(0, 10)
}

export const parsePost = (source: string): ParsedPost => {
  const { data, content } = matter(source)
  return {
    title: String(data.title ?? ''),
    date: asDate(data.date),
    lastmod: data.lastmod ? asDate(data.lastmod) : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: data.draft === true,
    summary: String(data.summary ?? ''),
    body: content.replace(/^\n+/, ''),
    keys: Object.keys(data),
  }
}

/** The raw frontmatter block of a file, without its `---` fences. */
const frontmatterBlock = (source: string): string | null => {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  return match ? match[1] : null
}

/**
 * Rewrites only the managed keys, in place, leaving every other line byte for
 * byte as it was. A managed key that spans more than one line (a block-style
 * `tags:` list, say) is refused rather than guessed at — none of the posts are
 * written that way, and quietly mangling one is worse than stopping.
 */
const substitute = (block: string, fields: ManagedFields): string => {
  const lines = block.split('\n')
  const seen = new Set<string>()

  const out = lines.map((current, index) => {
    const match = current.match(/^([a-zA-Z_][\w-]*):(.*)$/)
    if (!match) return current

    const key = match[1]
    if (!MANAGED_ORDER.includes(key as (typeof MANAGED_ORDER)[number])) return current

    const next = lines[index + 1] ?? ''
    if (match[2].trim() === '' && /^\s+\S/.test(next)) {
      throw new Error(
        `Frontmatter key "${key}" is written as a multi-line block. The editor ` +
          `only rewrites single-line values; edit this file by hand.`
      )
    }

    seen.add(key)
    return line(key, fields[key as keyof ManagedFields])
  })

  const kept = out.filter((value): value is string => value !== null)

  // A key the file never had — `lastmod` on an older post — is inserted in the
  // canonical position rather than appended, so the block keeps its shape.
  for (const key of MANAGED_ORDER) {
    if (seen.has(key)) continue
    const value = line(key, fields[key as keyof ManagedFields])
    if (value === null) continue
    const before = MANAGED_ORDER.slice(0, MANAGED_ORDER.indexOf(key))
    let at = 0
    kept.forEach((existing, index) => {
      const owner = existing.match(/^([a-zA-Z_][\w-]*):/)?.[1]
      if (owner && before.includes(owner as (typeof MANAGED_ORDER)[number])) at = index + 1
    })
    kept.splice(at, 0, value)
  }

  return kept.join('\n')
}

/** Writes an edit back over an existing file, preserving unmanaged keys. */
export const updatePost = (source: string, fields: ManagedFields, body: string): string => {
  const block = frontmatterBlock(source)
  if (block === null) throw new Error('File has no frontmatter block to update.')
  return `---\n${substitute(block, fields)}\n---\n\n${body.replace(/^\n+/, '').replace(/\s*$/, '')}\n`
}

/** Builds a file from nothing, in the same shape the existing posts use. */
export const createPost = (fields: ManagedFields, body: string): string => {
  const block = MANAGED_ORDER.map((key) => line(key, fields[key as keyof ManagedFields]))
    .filter((value): value is string => value !== null)
    .join('\n')
  return `---\n${block}\n---\n\n${body.replace(/^\n+/, '').replace(/\s*$/, '')}\n`
}
