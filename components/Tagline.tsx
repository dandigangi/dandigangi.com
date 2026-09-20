'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { TAGLINES } from '@/lib/taglines'
import { ArrowRight } from './Icons'
import styles from './Tagline.module.css'

/** Enough for the hero image to have settled before anything starts moving. */
const START_DELAY_MS = 600

/** A beat between clearing the old line and typing the next, so a click reads
 *  as a swap rather than as a glitch. */
const SWAP_DELAY_MS = 120

/** Per character. The longest line lands in a little over a second. */
const SPEED_MS = 26

/** How long a finished line holds before the next one types itself in. Longer
 *  than the wheel's, because retyping a line is a louder move than turning a
 *  row and wants more of a gap around it. */
const HOLD_MS = 4000

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
 * The tagline, typed in on load, cycling on its own, and swappable by hand.
 *
 * `arrow` adds the interaction hint, and the home hero is the only caller that
 * asks for it.
 *
 * A button rather than a span: clicking it does something, so it needs to be
 * reachable from the keyboard and to say so to assistive tech. The typing is
 * decoration — the line itself is in the markup for screen readers and
 * crawlers throughout, and is never exposed mid-word.
 */
export default function Tagline({ arrow = false }: { arrow?: boolean } = {}) {
  const reduced = useSyncExternalStore(subscribeMotion, readMotion, motionOnServer)
  const [index, setIndex] = useState(0)
  const [typed, setTyped] = useState('')
  /**
   * Auto-rotation stops while someone is pointing at or tabbed into the
   * control. WCAG asks that movement lasting more than five seconds can be
   * paused, and it also stops the accessible name changing under a reader that
   * is sitting on the button.
   */
  const [held, setHeld] = useState(false)
  /** Only the first line waits for the page; a swap should feel immediate. */
  const first = useRef(true)

  const full = TAGLINES[index]
  // Derived rather than written from an effect, so honouring the preference
  // costs no render of the half-typed state.
  const shown = reduced ? full : typed
  const done = shown === full

  const rotate = useCallback(() => {
    setTyped('')
    setIndex((current) => {
      // Never the line already up: with three of them, an unfiltered random
      // pick repeats often enough to look like nothing happened.
      const others = TAGLINES.map((_, position) => position).filter(
        (position) => position !== current
      )
      return others[Math.floor(Math.random() * others.length)]
    })
  }, [])

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

  /**
   * The cycle. Armed only once the line has finished typing, so the hold is a
   * hold on something readable rather than a race with the animation.
   */
  useEffect(() => {
    if (reduced || held || !done) return
    const timer = setTimeout(rotate, HOLD_MS)
    return () => clearTimeout(timer)
  }, [reduced, held, done, full, rotate])

  return (
    <button
      type="button"
      className={styles.tagline}
      onClick={rotate}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      <span className={styles.lines}>
        {/*
         * Holds the pill at the finished line's width so the typing fills a box
         * that is already the right size. Without it every keystroke resizes an
         * element inside a space-between row, which walks the whole band.
         */}
        <span className={styles.sizer} aria-hidden="true">
          {full}
        </span>
        <span className={styles.typed} aria-hidden="true">
          {shown}
          {!done && <span className={styles.caret} />}
        </span>
      </span>

      {/*
       * Decoration, not a control: the whole pill is the button, and the arrow
       * is the cheapest way to say it can be poked. Opted into rather than on
       * by default — only the home hero wears it, so the hint is made once
       * rather than repeated on every band that carries the line.
       */}
      {arrow && <ArrowRight size={12} className={styles.arrow} />}
      <span className="srOnly">{full}</span>
    </button>
  )
}
