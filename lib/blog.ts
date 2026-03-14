import type { Blog } from 'contentlayer/generated'
import { allBlogs } from 'contentlayer/generated'

/** Today's date as YYYY-MM-DD (UTC) for comparison. Posts with date after this are not yet "published". */
function todayUTC(): string {
  return new Date().toISOString().slice(0, 10)
}

/** Returns only published (non-draft, date <= today) blog posts. Use everywhere public lists are built. */
export function getPublishedBlogs(): Blog[] {
  const today = todayUTC()
  return allBlogs.filter((p) => {
    if (p.draft === true) return false
    const dateStr =
      typeof p.date === 'string' ? p.date.slice(0, 10) : new Date(p.date).toISOString().slice(0, 10)
    return dateStr <= today
  })
}
