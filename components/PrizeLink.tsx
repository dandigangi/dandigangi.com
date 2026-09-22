'use client'

import { useSyncExternalStore } from 'react'
import { allFound, subscribe } from '@/lib/eggs'
import { PIKACHU_PRIZE } from '@/lib/pikachu'
import styles from './PrizeLink.module.css'

/**
 * The way to collect from a page that has nothing else to do with the hunt.
 *
 * Absent for everyone who has not finished, which is almost everyone — this is
 * a contact page, and a green button about a prize on it would be baffling to a
 * reader who is here to send an email. It opens the same modal the egg list
 * does, by the same event.
 */
export default function PrizeLink() {
  const complete = useSyncExternalStore(subscribe, allFound, () => false)
  if (!complete) return null

  return (
    <button
      type="button"
      className={`btn btnPrize ${styles.claim}`}
      onClick={() => window.dispatchEvent(new CustomEvent(PIKACHU_PRIZE))}
      data-print="hide"
    >
      Claim Your Prize
    </button>
  )
}
