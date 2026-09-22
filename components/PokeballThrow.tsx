'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { isRainbow, subscribe as rainbowSubscribe } from '@/lib/rainbow'
import Pokeball from './Pokeball'
import styles from './PokeballThrow.module.css'

/** Flight, then the moment it connects. Kept here so the whole thing can be
 *  sped up or slowed down from one place if it ever feels long. */
export const FLIGHT_MS = 620
const IMPACT_MS = 220

/**
 * The ball thrown at Pikachu on the first catch.
 *
 * Deliberately a spin around the axis facing you (`rotate`), not a tumble in
 * depth. A flat disc rotated on Y foreshortens into an ellipse and reads as a
 * coin flipping on its edge; the spin plus an arc plus the scale ramp is what
 * actually reads as a thrown ball, and it is what the games show too.
 *
 * Two turns rather than three: the ball is radially symmetric apart from the
 * seam, so a faster spin stops reading as rotation and starts reading as blur.
 *
 * `x` and `y` are viewport coordinates of the point it should land on.
 */
export default function PokeballThrow({
  x,
  y,
  onDone,
}: {
  x: number
  y: number
  onDone: () => void
}) {
  const [landed, setLanded] = useState(false)
  /** On Rainbow Road you throw a star. Server snapshot false, as ever. */
  const starry = useSyncExternalStore(rainbowSubscribe, isRainbow, () => false)

  /**
   * Through a ref so the timers below can be armed exactly once. The parent
   * re-renders on every store update while this is on screen, and a fresh
   * `onDone` in the dependency list would restart the flight each time.
   */
  const done = useRef(onDone)
  useEffect(() => {
    done.current = onDone
  }, [onDone])

  // Measured once, on mount: where the ball starts its flight from. Below the
  // fold and centred, so it reads as thrown by the reader rather than by the
  // page. Falls back to a plain drop if the window cannot be measured.
  const [from] = useState(() => {
    if (typeof window === 'undefined') return { dx: 0, dy: 400 }
    return { dx: window.innerWidth / 2 - x, dy: window.innerHeight + 90 - y }
  })

  useEffect(() => {
    const hit = setTimeout(() => setLanded(true), FLIGHT_MS)
    const finish = setTimeout(() => done.current(), FLIGHT_MS + IMPACT_MS)
    return () => {
      clearTimeout(hit)
      clearTimeout(finish)
    }
  }, [])

  return (
    <div
      className={styles.stage}
      data-print="hide"
      aria-hidden="true"
      style={
        {
          left: x,
          top: y,
          '--dx': `${from.dx}px`,
          '--dy': `${from.dy}px`,
          // Spins the way it travels, so the rotation agrees with the motion
          // instead of fighting it.
          '--spin': from.dx > 0 ? '-720deg' : '720deg',
          '--flight': `${FLIGHT_MS}ms`,
          '--impact': `${IMPACT_MS}ms`,
        } as React.CSSProperties
      }
    >
      <div className={styles.flight}>
        <div className={styles.arc}>
          <div className={styles.spin}>
            <div className={`${styles.scale} ${landed ? styles.hit : ''}`}>
              {starry ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/static/images/star.gif"
                  alt=""
                  width={46}
                  height={46}
                  className={styles.star}
                />
              ) : (
                <Pokeball />
              )}
            </div>
          </div>
        </div>
      </div>

      {landed && <span className={styles.flash} />}
    </div>
  )
}
