'use client'

import { useEffect, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FINAL_TIER,
  OVER_TIER,
  PIKACHU_OPEN,
  lapseHero,
  markCaught,
  raiseTab,
  resetTab,
} from '@/lib/pikachu'
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
 * Local-only shortcuts into the post editor, parked in the corner rather than
 * in the nav — the nav is the real site's, and these are not part of it.
 *
 * The NODE_ENV test is first so the whole component folds away in a production
 * build, where /write does not exist as a route at all.
 */
export default function LocalTools() {
  const pathname = usePathname()
  const hidden = useSyncExternalStore(subscribeDock, readDock, dockOnServer)

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

  // A post's slug is its filename without .mdx — including the .draft of a
  // local one, so `/blog/foo.draft` edits `foo.draft.mdx`.
  const slug = pathname.startsWith('/blog/') ? pathname.slice('/blog/'.length) : null
  const editable = slug && !slug.includes('/') ? `${decodeURIComponent(slug)}.mdx` : null

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
      {editable && (
        <Link href={`/admin/write?file=${encodeURIComponent(editable)}`} className={styles.button}>
          Edit this post
        </Link>
      )}
      <Link href="/admin/write" className={styles.button}>
        Write
      </Link>
      <PikachuTools />
    </div>
  )
}

/**
 * Jumps straight to the states that are otherwise a lot of clicking to reach:
 * sixteen catches to the last state, and five real minutes to watch the hero
 * window lapse.
 *
 * These drive the store through its ordinary exports rather than writing
 * storage directly, so what they set up is the same thing the site would have
 * arrived at on its own.
 */
function PikachuTools() {
  return (
    <div className={styles.row}>
      <button
        type="button"
        className={`${styles.button} ${styles.small}`}
        // Over the tier and freshly armed: the swap should be on everywhere it
        // exists — home, about, projects, resume, contact, blog/tags.
        onClick={() => {
          markCaught()
          raiseTab(OVER_TIER + 100)
        }}
      >
        Hero on
      </button>
      <button
        type="button"
        className={`${styles.button} ${styles.small}`}
        // The lapse, without the wait. Watch it fade rather than cut.
        onClick={lapseHero}
      >
        Lapse
      </button>
      <button
        type="button"
        className={`${styles.button} ${styles.small}`}
        // Past the last tier, then reopened rather than caught — so the modal
        // comes up won without waiting for him to appear. Closing it is what
        // fires the reset and the toast.
        onClick={() => {
          markCaught()
          raiseTab(FINAL_TIER + 100)
          window.dispatchEvent(new CustomEvent(PIKACHU_OPEN))
        }}
      >
        Win
      </button>
      <button type="button" className={`${styles.button} ${styles.small}`} onClick={resetTab}>
        Reset
      </button>
    </div>
  )
}
