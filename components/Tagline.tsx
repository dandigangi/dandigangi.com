'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import siteMetadata from '@/data/siteMetadata'
import styles from './Tagline.module.css'

/**
 * The canonical line leads and is the one the page loads on — it is what the
 * OG image, the résumé and llms.txt all quote, so it has to be the default.
 * The other two only exist to be found by clicking.
 */
const TAGLINES = [
  siteMetadata.tagline,
  'Leadership over management',
  'Building exceptional software for humans',
]

/** Enough for the hero image to have settled before anything starts moving. */
const START_DELAY_MS = 600

/** A beat between clearing the old line and typing the next, so a click reads
 *  as a swap rather than as a glitch. */
const SWAP_DELAY_MS = 120

/** Per character. The longest line lands in a little over a second. */
const SPEED_MS = 26

const MOTION_QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Read as a store rather than into state from an effect: the preference can
 * change while the page is open, and a plain effect that seeds state is both a
 * lint error and a frame of the wrong thing.
 */
const subscribeMotion = (onChange: () => void) => {
  const query = window.matchMedia(MOTION_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

const readMotion = () => window.matchMedia(MOTION_QUERY).matches

/** The server cannot know, and guessing "reduced" would ship the static line
 *  to everyone. */
const motionOnServer = () => false

/**
 * The hero tagline, typed in on load and swapped for another at random when
 * clicked.
 *
 * A button rather than a span: clicking it does something, so it needs to be
 * reachable from the keyboard and to say so to assistive tech. The typing is
 * decoration — the line itself is in the markup for screen readers and
 * crawlers throughout, and is never exposed mid-word.
 */
export default function Tagline() {
  const reduced = useSyncExternalStore(subscribeMotion, readMotion, motionOnServer)
  const [index, setIndex] = useState(0)
  const [typed, setTyped] = useState('')
  /** Only the first line waits for the page; a click should feel immediate. */
  const first = useRef(true)

  const full = TAGLINES[index]
  // Derived rather than written from an effect, so honouring the preference
  // costs no render of the half-typed state.
  const shown = reduced ? full : typed
  const done = shown === full

  useEffect(() => {
    if (reduced) return

    let timer: ReturnType<typeof setTimeout>
    let count = 0

    const step = () => {
      count += 1
      setTyped(full.slice(0, count))
      if (count < full.length) timer = setTimeout(step, SPEED_MS)
    }

    timer = setTimeout(step, first.current ? START_DELAY_MS : SWAP_DELAY_MS)
    first.current = false

    return () => clearTimeout(timer)
  }, [full, reduced])

  const rotate = () => {
    // Cleared here rather than in the effect: an event handler is the one place
    // this can happen without a synchronous setState inside the effect body.
    setTyped('')
    setIndex((current) => {
      // Never the line already up: with three of them, an unfiltered random
      // pick repeats often enough to look like the click did nothing.
      const others = TAGLINES.map((_, position) => position).filter(
        (position) => position !== current
      )
      return others[Math.floor(Math.random() * others.length)]
    })
  }

  return (
    <button type="button" className={styles.tagline} onClick={rotate}>
      {/*
       * Holds the pill at the finished line's width so the typing fills a box
       * that is already the right size. Without it every keystroke resizes an
       * element inside a space-between row, which walks the whole hero.
       */}
      <span className={styles.sizer} aria-hidden="true">
        {full}
      </span>
      <span className={styles.typed} aria-hidden="true">
        {shown}
        {!done && <span className={styles.caret} />}
      </span>
      <span className="srOnly">{full}</span>
    </button>
  )
}
