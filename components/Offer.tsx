'use client'

import { useSyncExternalStore } from 'react'
import { veiled } from '@/lib/copy'
import { allTokens, subscribe } from '@/lib/ledger'
import { CALLER_OFFER } from '@/lib/caller'
import styles from './Offer.module.css'

/**
 * The same offer, sized for the band nav, and only ever there once it is won.
 *
 * Its own class rather than `navLink`: the rainbow rules paint every navLink
 * with a black plate and a clipped gradient, and the one control that hands
 * something over should keep its green in both modes. Same reasoning as
 * .btnTone in css/trail.css.
 */
export function OfferNavLink() {
  const complete = useSyncExternalStore(subscribe, allTokens, () => false)
  if (!complete) return null

  return (
    <li>
      <button
        type="button"
        className={styles.navClaim}
        onClick={() => window.dispatchEvent(new CustomEvent(CALLER_OFFER))}
        data-print="hide"
      >
        {veiled('Q2xhaW0gWW91ciBQcml6ZQ==')}
      </button>
    </li>
  )
}
