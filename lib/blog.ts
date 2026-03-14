import type { Blog } from 'contentlayer/generated'
import { allBlogs } from 'contentlayer/generated'

/** Returns only published (non-draft) blog posts. Use everywhere public lists are built. */
export function getPublishedBlogs(): Blog[] {
  return allBlogs.filter((p) => p.draft !== true)
}
