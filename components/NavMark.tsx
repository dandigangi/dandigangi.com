'use client'

import { useSyncExternalStore } from 'react'
import { EXTRA, hasToken, subscribe as subscribeTokens } from '@/lib/ledger'
import { isTrail, setTrail, subscribe } from '@/lib/trail'
import { useLabels } from './useLabels'
import styles from './NavMark.module.css'

const foundTrail = () => hasToken(EXTRA)

/**
 * Rides beside the mark once Rainbow Road has been found, and doubles as its
 * switch. Absent until then — a sprite sitting in the nav of an ordinary page
 * is a clue nobody asked for — but once found it stays, on or off, so the way
 * back in is always one click rather than retyping the phrase.
 *
 * Slightly under the mark's height so it reads as a companion rather than a
 * second logo.
 */
export default function NavMark({ size }: { size: number }) {
  const on = useSyncExternalStore(subscribe, isTrail, () => false)
  const found = useSyncExternalStore(subscribeTokens, foundTrail, () => false)
  // `on` as well: the dev tools can switch it on without the egg being found.
  const shown = on || found
  const names = useLabels(shown ? ['c1', 'c2'] : [])
  if (!shown) return null

  const label = names.get(on ? 'c2' : 'c1') ?? ''

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={() => setTrail(!on)}
      aria-pressed={on}
      title={label}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/static/images/glint.gif"
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
        className={styles.star}
        data-off={on ? undefined : ''}
        style={{ height: size, width: size }}
      />
      <span className="srOnly">{label}</span>
    </button>
  )
}
