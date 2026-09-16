'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './LocalTools.module.css'

/**
 * Local-only shortcuts into the post editor, parked in the corner rather than
 * in the nav — the nav is the real site's, and these are not part of it.
 *
 * The NODE_ENV test is first so the whole component folds away in a production
 * build, where /write does not exist as a route at all.
 */
export default function LocalTools() {
  const pathname = usePathname()

  if (process.env.NODE_ENV !== 'development') return null
  // Hidden on the editor itself; the other /admin pages are ordinary pages.
  if (!pathname || pathname.startsWith('/admin/write')) return null

  // A post's slug is its filename without .mdx — including the .draft of a
  // local one, so `/blog/foo.draft` edits `foo.draft.mdx`.
  const slug = pathname.startsWith('/blog/') ? pathname.slice('/blog/'.length) : null
  const editable = slug && !slug.includes('/') ? `${decodeURIComponent(slug)}.mdx` : null

  return (
    <div className={styles.dock} data-print="hide">
      {editable && (
        <Link href={`/admin/write?file=${encodeURIComponent(editable)}`} className={styles.button}>
          Edit this post
        </Link>
      )}
      <Link href="/admin/write" className={styles.button}>
        Write
      </Link>
    </div>
  )
}
