'use client'

import { useEffect, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { resetAll } from '@/lib/pikachu'
import { TOTAL_EGGS, foundEggs, resetEggs, subscribe as eggsSubscribe } from '@/lib/eggs'
import { clearPikaPass } from '@/lib/pikaPass'
import styles from './LocalTools.module.css'

/**
 * Collapsed state, kept in localStorage and read through a store rather than an
 * effect: the dock is fixed to the bottom-right corner, which is where the
 * footer's theme toggle ends up once the page is scrolled to the bottom. It sat
 * on top of it and swallowed the clicks.
 *
 * The server snapshot is always "open", so there is nothing to mismatch on
 * hydration; a collapsed dock expands for one frame and then folds away.
 */
/** Segments under /blog that are sections rather than posts. */
const RESERVED = new Set(['tags', 'page'])

const DOCK_KEY = 'dd:devdock'
const DOCK_EVENT = 'dd:devdock'

const subscribeDock = (onChange: () => void) => {
  window.addEventListener(DOCK_EVENT, onChange)
  return () => window.removeEventListener(DOCK_EVENT, onChange)
}

const readDock = () => {
  try {
    return localStorage.getItem(DOCK_KEY) === 'hidden'
  } catch {
    return false
  }
}

const dockOnServer = () => false

const setDock = (hidden: boolean) => {
  try {
    localStorage.setItem(DOCK_KEY, hidden ? 'hidden' : 'open')
  } catch {
    // Private mode. It just will not be remembered between reloads.
  }
  window.dispatchEvent(new CustomEvent(DOCK_EVENT))
}

/**
 * Local-only shortcuts, parked in the corner rather than in the nav — the nav is
 * the real site's, and these are not part of it.
 *
 * This also carried jumps into the Pikachu states (Hero on, Lapse, Win, Reset);
 * they were scaffolding for building that feature, and a dev dock that covers
 * the bottom-right corner of every page has to earn its width. The states are
 * still reachable through the site itself, which is the thing actually worth
 * testing.
 *
 * The NODE_ENV test is first so the whole component folds away in a production
 * build, where /write does not exist as a route at all.
 */
export default function LocalTools() {
  const pathname = usePathname()
  const hidden = useSyncExternalStore(subscribeDock, readDock, dockOnServer)
  // Server snapshot is 0: the tally is in localStorage, so it cannot be known
  // before hydration, and 0 is what the markup has to say until then.
  const eggs = useSyncExternalStore(eggsSubscribe, foundEggs, () => 0)

  /**
   * Ctrl+` toggles the dock from anywhere. The visible handle is the ordinary
   * way back, but a control whose only "show me again" affordance is a button
   * in a corner is one misclick away from being lost — so there is also a
   * shortcut that works whether or not that handle can be seen or reached.
   */
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return
    const onPress = (event: KeyboardEvent) => {
      if (event.key !== '`' || !event.ctrlKey) return
      event.preventDefault()
      setDock(!readDock())
    }
    window.addEventListener('keydown', onPress)
    return () => window.removeEventListener('keydown', onPress)
  }, [])

  if (process.env.NODE_ENV !== 'development') return null
  // Hidden on the editor itself; the other /admin pages are ordinary pages.
  if (!pathname || pathname.startsWith('/admin/write')) return null

  if (hidden) {
    return (
      <button
        type="button"
        className={styles.peek}
        data-print="hide"
        onClick={() => setDock(false)}
        title="Show dev tools (Ctrl+`)"
      >
        dev tools
      </button>
    )
  }

  // A post's slug is its filename without .mdx — including the .draft of a
  // local one, so `/blog/foo.draft` edits `foo.draft.mdx`.
  //
  // `/blog/tags` and `/blog/page` are sections, not posts. Deeper ones —
  // `/blog/tags/ai`, `/blog/page/2` — are excluded by the slash test already;
  // these two are the bare segments that slip past it and offered to edit a
  // `tags.mdx` that does not exist.
  const slug = pathname.startsWith('/blog/') ? pathname.slice('/blog/'.length) : null
  const isPost = slug !== null && slug !== '' && !slug.includes('/') && !RESERVED.has(slug)
  const editable = isPost ? `${decodeURIComponent(slug)}.mdx` : null

  return (
    <div className={styles.dock} data-print="hide">
      <button
        type="button"
        className={styles.hide}
        onClick={() => setDock(true)}
        title="Hide dev tools (Ctrl+`)"
      >
        hide ×
      </button>
      {/* Only on a post page, and it is the whole reason the dock is worth
          having there — it opens the editor already pointed at what you are
          reading, rather than at the post list. */}
      {editable && (
        <Link href={`/admin/write?file=${encodeURIComponent(editable)}`} className={styles.button}>
          Edit this post
        </Link>
      )}
      <Link href="/admin/write" className={styles.button}>
        Write
      </Link>
      {/* Every trace of him: the tab, having met him, the alter ego, the hero
          swap, the egg tally — and the cookie behind the /admin reveal, which is
          the one bit of this that does not live in a store. */}
      <button
        type="button"
        className={styles.button}
        onClick={() => {
          resetAll()
          clearPikaPass()
          resetEggs()
        }}
      >
        Reset Pikachu
      </button>

      {/* A readout, not a control — the button above is what clears it. Kept in
          the dock's old purple so it reads as one of these tools rather than
          something the site would ever show a visitor. */}
      <span className={styles.tally}>
        🥚 {eggs}/{TOTAL_EGGS} found
      </span>
    </div>
  )
}
