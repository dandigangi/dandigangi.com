'use client'

import Glint from './Glint'
import { useTrailMark } from './useTrailMark'
import styles from './NavMark.module.css'

/**
 * Rides beside the mark and doubles as Rainbow Road's switch — see useTrailMark
 * for when it appears. Absent until then: a sprite sitting in the nav of an
 * ordinary page is a clue nobody asked for.
 *
 * Slightly under the mark's height so it reads as a companion rather than a
 * second logo.
 */
export default function NavMark({ size }: { size: number }) {
  const { on, shown, label, toggle } = useTrailMark()
  if (!shown) return null

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-pressed={on}
      title={label}
    >
      <Glint size={size} className={styles.star} off={!on} />
      <span className="srOnly">{label}</span>
    </button>
  )
}
