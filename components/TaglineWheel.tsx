'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { TAGLINES } from '@/lib/taglines'
import EggToast from './EggToast'
import styles from './TaglineWheel.module.css'

/** How long a line sits centred before the wheel turns. Shorter than the hero
 *  pill's: the neighbours are already on screen, so a turn is a small expected
 *  movement rather than a line rewriting itself. */
const HOLD_MS = 2300

const MOTION_QUERY = '(prefers-reduced-motion: reduce)'

const subscribeMotion = (onChange: () => void) => {
  const query = window.matchMedia(MOTION_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

const readMotion = () => window.matchMedia(MOTION_QUERY).matches
const motionOnServer = () => false

/**
 * Three copies, so the wheel can always show a line above and below the centre
 * one without the ends running out. The visible window sits in the middle copy
 * and is nudged back there whenever it wanders into an outer one, which is what
 * makes the turn look endless in both directions.
 */
const REEL = [...TAGLINES, ...TAGLINES, ...TAGLINES]
const MIDDLE = TAGLINES.length

/**
 * The About pull quote as a rotator: the current line centred and lit, its
 * neighbours dimmed above and below, turning on a timer or on a click.
 *
 * The centre line is the only one exposed to assistive tech. The two neighbours
 * are the same three strings over and over, and announcing them would say
 * nothing except that the page is busy.
 */
export default function TaglineWheel() {
  const reduced = useSyncExternalStore(subscribeMotion, readMotion, motionOnServer)
  const [position, setPosition] = useState(MIDDLE)
  /** Suppressed for the one frame that snaps back to the middle copy, or the
   *  wheel would visibly rewind a copy's worth of rows. */
  const [animate, setAnimate] = useState(true)
  const [held, setHeld] = useState(false)

  /**
   * Which lines have been reached *by pressing*, so sitting and watching the
   * timer walk the whole wheel earns nothing. A Set of indices rather than a
   * counter: pressing the same line ten times is one line, not ten.
   *
   * A ref, not state — nothing renders from it until it is complete, and making
   * it state would re-render the wheel on every press for no visible reason.
   * The timer pauses on hover, so a run of presses walks the lines in order;
   * that is the whole trick, and it needs no coordination with the timer.
   */
  const pressed = useRef(new Set<number>())
  const [wheelEgg, setWheelEgg] = useState(false)

  const current = TAGLINES[position % TAGLINES.length]

  const turn = useCallback(() => {
    setPosition((at) => {
      const next = at + 1
      pressed.current.add(next % TAGLINES.length)
      if (pressed.current.size === TAGLINES.length) setWheelEgg(true)
      return next
    })
  }, [])

  /**
   * The timer turns the wheel too, and it must not count. It calls `advance`,
   * which does nothing but move; only the button calls `turn`.
   */
  const advance = useCallback(() => setPosition((at) => at + 1), [])

  useEffect(() => {
    if (reduced || held) return
    const timer = setTimeout(advance, HOLD_MS)
    return () => clearTimeout(timer)
  }, [reduced, held, position, advance])

  /**
   * Once the window has climbed out of the middle copy, drop it back by one
   * copy's worth. The row it lands on renders identically, so with the
   * transition off nothing moves on screen.
   *
   * It has to wait for the turn to finish. Doing this a frame after the
   * position changed yanked the reel back while it was still travelling, which
   * read as a jump and ate the last line's turn entirely.
   */
  const settle = useCallback(
    (event: React.TransitionEvent<HTMLDivElement>) => {
      // The rows run their own transitions and those bubble; only the reel's
      // own travel means the turn is over.
      if (event.target !== event.currentTarget) return
      if (position < MIDDLE + TAGLINES.length) return
      setAnimate(false)
      setPosition(position - TAGLINES.length)
    },
    [position]
  )

  /** Put the transition back a frame after a snap, so re-enabling it and moving
   *  the reel never land in the same style recalculation. */
  useEffect(() => {
    if (animate) return
    const frame = requestAnimationFrame(() => setAnimate(true))
    return () => cancelAnimationFrame(frame)
  }, [animate])

  return (
    <div
      className={styles.wheel}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
    >
      <div className={styles.window} aria-hidden="true">
        <div
          className={`${styles.reel} ${animate ? styles.turning : ''}`}
          onTransitionEnd={settle}
          // The centre row is one above the current position, so the window
          // shows previous / current / next.
          style={{ transform: `translateY(calc(${-(position - 1)} * var(--row)))` }}
        >
          {REEL.map((line, at) => (
            <span
              key={`${line}-${at}`}
              className={`${styles.line} ${at === position ? styles.current : ''}`}
            >
              {line}
            </span>
          ))}
        </div>
      </div>

      {/*
       * The control and the accessible copy in one: a screen reader gets the
       * centred line and nothing about the two ghosts flanking it, and the
       * whole block stays reachable by keyboard.
       */}
      <button
        type="button"
        className={styles.hit}
        onFocus={() => setHeld(true)}
        onBlur={() => setHeld(false)}
        onClick={turn}
      >
        <span className="srOnly">{current} — show another</span>
      </button>

      <EggToast egg="wheel" show={wheelEgg} />
    </div>
  )
}
