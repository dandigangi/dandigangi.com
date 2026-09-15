/** "MAR 2026" — the meta format used across post rows. */
export function formatMonthYear(date: string): string {
  return new Date(date)
    .toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
    .toUpperCase()
}

/** "eng-management" -> "Eng management" */
export function formatTag(tag: string): string {
  const spaced = tag.replace(/-/g, ' ')
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}
