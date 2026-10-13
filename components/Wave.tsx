'use client'

import { useEffect, useState } from 'react'
import { isTrail, subscribe, trailToggles } from '@/lib/trail'
import styles from './Wave.module.css'

/** Two frames at 170ms each, read off the GIF itself. */
const LOOP_MS = 340
const LOOPS = 3

/**
 * A sprite in the bottom-right for a few loops whenever Rainbow Road is switched
 * on — by the phrase, the star, or the egg list. Not on page load with the mode
 * already on, and not on the way out.
 *
 * Named neutrally, like the rest of the egg's assets, so the file list does not
 * hint at what the phrases are about.
 */
export default function Wave() {
  const [shownFor, setShownFor] = useState(0)

  useEffect(() => {
    let seen = trailToggles()
    let timer: ReturnType<typeof setTimeout> | undefined
    const unsubscribe = subscribe(() => {
      const arrivals = trailToggles()
      if (arrivals === seen) return
      seen = arrivals
      if (!isTrail()) return
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
      clearTimeout(timer)
      setShownFor(arrivals)
      timer = setTimeout(() => setShownFor(0), LOOP_MS * LOOPS)
    })
    return () => {
      unsubscribe()
      clearTimeout(timer)
    }
  }, [])

  if (!shownFor) return null

  return (
    // eslint-disable-next-line @next/next/no-img-element -- next/image drops GIF animation
    <img
      // A fresh URL per arrival, so the animation starts at frame one rather
      // than wherever a cached copy of the GIF had got to.
      src={`/static/images/sprite-b.gif?n=${shownFor}`}
      alt=""
      aria-hidden="true"
      className={styles.sprite}
    />
  )
}
