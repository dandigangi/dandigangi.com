'use client'

import { useEffect, useState } from 'react'
import { PIKACHU_CAUGHT, PIKACHU_OPEN, hasCaught } from '@/lib/pikachu'
import styles from './PayPikachuLink.module.css'

/**
 * Only appears once someone has actually met him — until then there is nothing
 * to pay and the link would give the joke away.
 */
export default function PayPikachuLink({
  fontSize,
  tone = 'brand',
}: {
  fontSize?: number
  /** 'plain' for the band nav, where his yellow reads as a warning. */
  tone?: 'brand' | 'plain'
}) {
  // Lazy initialiser, not an effect: the nav copy sits inside page content and
  // remounts on every client-side navigation, after the event has long fired.
  const [met, setMet] = useState(() => hasCaught())

  useEffect(() => {
    const onCaught = () => setMet(true)
    window.addEventListener(PIKACHU_CAUGHT, onCaught)
    return () => window.removeEventListener(PIKACHU_CAUGHT, onCaught)
  }, [])

  if (!met) return null

  return (
    <li>
      <button
        type="button"
        className={`navLink ${styles.pay} ${tone === 'plain' ? styles.plain : ''}`}
        style={fontSize ? { fontSize } : undefined}
        onClick={() => window.dispatchEvent(new CustomEvent(PIKACHU_OPEN))}
      >
        Pay Pikachu
      </button>
    </li>
  )
}
