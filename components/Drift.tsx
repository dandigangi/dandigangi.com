'use client'

import { useMemo } from 'react'
import styles from './Drift.module.css'

/** Where the stars start, how big, and how long they take. */
type Star = { id: number; left: number; size: number; delay: number; fall: number }

const STAR = '/static/images/glint.gif'

const rand = (min: number, max: number) => min + Math.random() * (max - min)

/**
 * A handful of stars dropped down the page when Rainbow Road switches on, each
 * bouncing once at the bottom before leaving.
 *
 * Built on a trigger counter rather than a boolean: turning the mode off and on
 * again has to drop a fresh set, and a boolean that is already true says
 * nothing changed. The counter also keys the elements, so React replaces them
 * outright and the animations restart from the top.
 *
 * Every value is rolled on the client, after mount — `Math.random()` during a
 * render that also happens on the server is a hydration mismatch by
 * construction.
 */
export default function Drift({ trigger }: { trigger: number }) {
  /*
   * Derived, not set from an effect. `trigger` is zero on every server render
   * and only ever climbs from a keypress, so the random values here cannot
   * reach the server and cannot disagree with it — which is the whole reason
   * this looked like it needed an effect.
   */
  const stars = useMemo<Star[]>(() => {
    if (trigger === 0 || typeof window === 'undefined') return []

    // Optional call: jsdom has no matchMedia, and a test that renders this
    // should not have to know that.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return []

    return Array.from({ length: Math.round(rand(3, 5)) }, (_, at) => ({
      id: trigger * 100 + at,
      // Kept off the extreme edges: a star half off-screen reads as a glitch.
      left: rand(6, 90),
      size: rand(26, 46),
      delay: rand(0, 420),
      fall: rand(1500, 2100),
    }))
  }, [trigger])

  if (stars.length === 0) return null

  return (
    <div className={styles.sky} aria-hidden="true" data-print="hide">
      {stars.map((star) => (
        <span
          key={star.id}
          className={styles.star}
          style={
            {
              left: `${star.left}vw`,
              '--size': `${star.size}px`,
              '--delay': `${star.delay}ms`,
              '--fall': `${star.fall}ms`,
            } as React.CSSProperties
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={STAR} alt="" width={star.size} height={star.size} />
        </span>
      ))}
    </div>
  )
}
