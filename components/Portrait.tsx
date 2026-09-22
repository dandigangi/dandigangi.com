'use client'

import { useSyncExternalStore } from 'react'
import Image from 'next/image'
import { isAlterEgo, setAlterEgo, subscribe as isAlterEgoSubscribe } from '@/lib/pikachu'
import { ArrowRight } from './Icons'
import styles from './Portrait.module.css'

const REAL = '/static/images/dan-digangi-portrait.jpg'
const ALTER = '/static/images/dan-digangi-alter-ego.jpg'

/**
 * Both images are the same 400x400 crop, so swapping the src cannot shift the
 * layout around it.
 */
export default function Portrait() {
  // Read through the store rather than seeded from it once, so clearing the
  // state puts the real photo back instead of stranding the alter ego.
  const alter = useSyncExternalStore(isAlterEgoSubscribe, isAlterEgo, () => false)

  return (
    <div className={styles.portrait}>
      <div className={styles.frame}>
        <Image
          src={alter ? ALTER : REAL}
          alt={alter ? 'Dan DiGangi, alter ego' : 'Dan DiGangi'}
          width={400}
          height={400}
          sizes="(max-width: 700px) 100vw, 320px"
          priority
        />
        <button
          type="button"
          // Stored so the photo survives navigating away and back, and read
          // back out of the store above. It goes no further than this frame —
          // the hero swap is the tab's job alone.
          onClick={() => setAlterEgo(!alter)}
          className={styles.toggle}
          aria-pressed={alter}
        >
          Alter Ego <ArrowRight size={11} />
        </button>
      </div>
      <span className="meta">Dan DiGangi · Chicago</span>
    </div>
  )
}
