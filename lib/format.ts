/** "MAR 2026" — the meta format used across post rows. */
export function formatMonthYear(date: string): string {
  return new Date(date)
    .toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
    .toUpperCase()
}

/**
 * Initialisms that are wrong in title case. Kept as a set rather than a regex
 * so adding one is a one-word edit, and matched on the whole word only — "ai"
 * is AI, but "said" is not "sAId".
 */
const INITIALISMS = new Set([
  'ai',
  'api',
  'ci',
  'cd',
  'css',
  'html',
  'js',
  'llm',
  'qa',
  'seo',
  'ui',
  'ux',
])

/** "engineering-management" -> "Engineering Management", "ai" -> "AI" */
export function formatTag(tag: string): string {
  return tag
    .split('-')
    .map((word) =>
      INITIALISMS.has(word.toLowerCase())
        ? word.toUpperCase()
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(' ')
}

/** "Mar 14 2026" — the blog index meta format. */
export function formatFullDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
