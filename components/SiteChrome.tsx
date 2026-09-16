'use client'

import { usePathname } from 'next/navigation'

/** The editor, and only the editor — /admin also holds ordinary pages. */
const EDITOR = '/admin/write'

/**
 * Everything the site puts on every page, except where a page is not really a
 * page. The local post editor is a full-height tool — a footer under it and
 * Pikachu climbing over it are noise, and `body` being a cameo container means
 * he would use the editor's own edges.
 *
 * Matched against the editor's exact path rather than all of /admin: the joke
 * pages under there are ordinary pages and want their chrome. Getting that
 * wrong was invisible to any server-side check, because this runs on the
 * client — the footer rendered, then hydration took it away.
 *
 * The NODE_ENV test is first so the whole check folds away in a production
 * build, where the editor does not exist as a route at all.
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (process.env.NODE_ENV === 'development' && pathname?.startsWith(EDITOR)) return null
  return <>{children}</>
}
