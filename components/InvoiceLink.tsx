'use client'

import { useSyncExternalStore } from 'react'
import { veiled } from '@/lib/copy'
import { CALLER_OPEN, hasMet, subscribe } from '@/lib/caller'
import styles from './InvoiceLink.module.css'

/**
 * Only appears once someone has actually met him — until then there is nothing
 * to pay and the link would give the joke away.
 */
export default function InvoiceLink({ fontSize }: { fontSize?: number }) {
  /**
   * Subscribed, not seeded once. This used to latch on a one-way "caught" event,
   * which meant it could learn that he had been met but never that the state had
   * been cleared — so Reset Pikachu left this link sitting in every nav. The
   * store handles both directions, and still gives the right answer on the
   * remount that every client-side navigation causes.
   *
   * The server snapshot is false: the store only exists on the client.
   */
  const met = useSyncExternalStore(subscribe, hasMet, () => false)

  if (!met) return null

  return (
    <li>
      <button
        type="button"
        className={`navLink ${styles.pay}`}
        style={fontSize ? { fontSize } : undefined}
        onClick={() => window.dispatchEvent(new CustomEvent(CALLER_OPEN))}
      >
        {veiled('UGF5IFBpa2FjaHU=')}
      </button>
    </li>
  )
}
