'use client'

import { useSyncExternalStore } from 'react'
import { veiled } from '@/lib/copy'
import { allTokens, subscribe } from '@/lib/ledger'
import { CALLER_OFFER } from '@/lib/caller'
import styles from './Offer.module.css'

/**
 * The way to collect from a page that has nothing else to do with the hunt.
 *
 * Absent for everyone who has not finished, which is almost everyone — this is
 * a contact page, and a green button about a prize on it would be baffling to a
 * reader who is here to send an email. It opens the same modal the egg list
 * does, by the same event.
 */
export default function Offer() {
  const complete = useSyncExternalStore(subscribe, allTokens, () => false)
  if (!complete) return null

  return (
    <button
      type="button"
      className={`btn btnPrize ${styles.claim}`}
      onClick={() => window.dispatchEvent(new CustomEvent(CALLER_OFFER))}
      data-print="hide"
    >
      {veiled('Q2xhaW0gWW91ciBQcml6ZQ==')}
    </button>
  )
}
