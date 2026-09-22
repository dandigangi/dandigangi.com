'use client'

import { useState, useSyncExternalStore } from 'react'
import Image from 'next/image'
import { isAlterEgo, setAlterEgo, subscribe as isAlterEgoSubscribe } from '@/lib/pikachu'
import EggToast from './EggToast'
import { ArrowRight } from './Icons'
import styles from './Portrait.module.css'

const REAL = '/static/images/dan-digangi-portrait.jpg'
const ALTER = '/static/images/dan-digangi-alter-ego.jpg'

/**
 * Both images are the same 400x400 crop, so swapping the src cannot shift the
 * layout around it.
 *
 * Both are also always rendered, stacked: the outgoing photo has to stay on
 * screen underneath for the star to wipe the incoming one over something rather
 * than over an empty frame.
 */
export default function Portrait() {
  // Read through the store rather than seeded from it once, so clearing the
  // state puts the real photo back instead of stranding the alter ego.
  const alter = useSyncExternalStore(isAlterEgoSubscribe, isAlterEgo, () => false)
  /** Latched on the first press, so the toast outlives the swap that earned it. */
  const [found, setFound] = useState(false)
  /**
   * Nothing wipes on arrival — only on a press. Without this the star plays on
   * first paint for anyone whose stored state is already the alter ego, which
   * gives the joke away before they touch anything.
   */
  const [pressed, setPressed] = useState(false)

  return (
    <div className={styles.portrait}>
      <div className={styles.frame}>
        {/* The one being replaced, underneath and inert. */}
        <Image
          src={alter ? REAL : ALTER}
          alt=""
          aria-hidden="true"
          width={400}
          height={400}
          sizes="(max-width: 700px) 100vw, 320px"
          className={styles.under}
        />
        {/* Keyed on the state so React remounts it on every toggle, which is
            what replays the animation — a class alone would only run once. */}
        <Image
          key={String(alter)}
          src={alter ? ALTER : REAL}
          alt={alter ? 'Dan DiGangi, alter ego' : 'Dan DiGangi'}
          width={400}
          height={400}
          sizes="(max-width: 700px) 100vw, 320px"
          priority
          className={`${styles.top} ${pressed ? styles.wipe : ''}`}
        />
        <button
          type="button"
          // Stored so the photo survives navigating away and back, and read
          // back out of the store above. It goes no further than this frame —
          // the hero swap is the tab's job alone.
          onClick={() => {
            setPressed(true)
            setFound(true)
            setAlterEgo(!alter)
          }}
          className={styles.toggle}
          aria-pressed={alter}
        >
          Alter Ego <ArrowRight size={11} />
        </button>
      </div>
      <span className="meta">Dan DiGangi · Chicago</span>
      <EggToast egg="alterego" show={found} />
    </div>
  )
}
