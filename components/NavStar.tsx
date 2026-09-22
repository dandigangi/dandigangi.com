'use client'

import { useSyncExternalStore } from 'react'
import { isRainbow, subscribe } from '@/lib/rainbow'
import styles from './NavStar.module.css'

/**
 * Rides beside the mark while Rainbow Road is on, and is absent otherwise —
 * a sprite sitting in the nav of an ordinary page is a clue nobody asked for.
 *
 * Slightly under the mark's height so it reads as a companion rather than a
 * second logo.
 */
export default function NavStar({ size }: { size: number }) {
  const on = useSyncExternalStore(subscribe, isRainbow, () => false)
  if (!on) return null

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/static/images/star.gif"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={styles.star}
      style={{ height: size, width: size }}
    />
  )
}
