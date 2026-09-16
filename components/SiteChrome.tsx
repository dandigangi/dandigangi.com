'use client'

import { usePathname } from 'next/navigation'

/**
 * Everything the site puts on every page, except where a page is not really a
 * page. The local post editor is a full-height tool — a footer under it and
 * Pikachu climbing over it are noise, and `body` being a cameo container means
 * he would use the editor's own edges.
 *
 * The NODE_ENV test is first so the whole check folds away in a production
 * build, where /write does not exist as a route at all.
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (process.env.NODE_ENV === 'development' && pathname?.startsWith('/admin')) return null
  return <>{children}</>
}
