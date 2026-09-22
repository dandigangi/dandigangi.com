'use client'

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { veiled } from '@/lib/copy'
import {
  EXTRA,
  totalEggs,
  allFound,
  eggName,
  foundEggs,
  foundList,
  resetEggs,
  subscribe,
} from '@/lib/eggs'
import { setRainbow } from '@/lib/rainbow'
import { PIKACHU_PRIZE } from '@/lib/pikachu'
import styles from './EggList.module.css'

/**
 * Opens the list from anywhere. A window event rather than shared state for the
 * same reason the Pikachu store uses one: the two things that open it — the
 * footer link and the count inside a toast — have no common client ancestor.
 */
export const EGG_LIST_OPEN = 'dd:eggs-open'

export const openEggList = () => window.dispatchEvent(new CustomEvent(EGG_LIST_OPEN))

/** "22 Sep, 03:24". Short enough to sit on one line beside the name. */
const when = (at: number) =>
  at === 0
    ? ''
    : new Date(at).toLocaleString(undefined, {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })

/**
 * What has been found, and how much is left. Mounted once in the layout and
 * summoned by event, so it survives a client-side navigation the way the cameo
 * does.
 *
 * Only found eggs are named. The rest are deliberately identical blanks — a
 * list of ten specific things you have not done yet is a walkthrough, and the
 * whole point is that you go and look.
 */
export default function EggList() {
  const [open, setOpen] = useState(false)
  const found = useSyncExternalStore(subscribe, foundEggs, () => 0)
  const complete = useSyncExternalStore(subscribe, allFound, () => false)

  const close = useCallback(() => setOpen(false), [])
  /**
   * Two-step, not a second modal: the first press turns this control into its
   * own confirmation and the second carries it out. A dialog on top of a dialog
   * to ask about a dialog is worse than the mistake it prevents, and the
   * question belongs where the answer is.
   *
   * It backs out on its own after a few seconds, so a stray press cannot leave
   * a primed destructive control sitting there.
   */
  const [arming, setArming] = useState(false)

  useEffect(() => {
    if (!arming) return
    const timer = setTimeout(() => setArming(false), 4000)
    return () => clearTimeout(timer)
  }, [arming])

  useEffect(() => {
    const show = () => setOpen(true)
    window.addEventListener(EGG_LIST_OPEN, show)
    return () => window.removeEventListener(EGG_LIST_OPEN, show)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, close])

  if (!open) return null

  const unlocked = foundList()
  const remaining = totalEggs() - unlocked.length

  return (
    <div
      className={styles.overlay}
      onClick={(event) => event.target === event.currentTarget && close()}
    >
      <div
        className={`spectrumRing ${styles.dialog}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="egg-list"
      >
        <header className={styles.head}>
          <div>
            <h2 className={styles.title} id="egg-list">
              {veiled('RWFzdGVyIGVnZ3M=')}
            </h2>
            <p className={styles.score}>
              {found} of {totalEggs()} found
            </p>
          </div>
          <button type="button" className={styles.x} onClick={close}>
            <span aria-hidden="true">×</span>
            <span className="srOnly">Close</span>
          </button>
        </header>

        <ol className={styles.list}>
          {unlocked.map(({ egg, at }) => (
            <li key={egg} className={styles.row}>
              {/* The secret wears its own mark — it is not one of the nine. */}
              <span className={styles.mark} aria-hidden="true">
                {egg === EXTRA ? '🌈' : '🐣'}
              </span>
              <span className={`${styles.name} ${egg === EXTRA ? styles.secretName : ''}`}>
                {eggName(egg)}
              </span>
              <span className={styles.at}>{when(at)}</span>
            </li>
          ))}

          {/* Identical blanks, not a list of what is missing. */}
          {Array.from({ length: remaining }, (_, at) => (
            <li key={`left-${at}`} className={`${styles.row} ${styles.locked}`}>
              <span className={styles.mark} aria-hidden="true">
                🥚
              </span>
              <span className={styles.name}>{veiled('S2VlcCBsb29raW5n')}!</span>
            </li>
          ))}
        </ol>

        {complete && (
          /* A way back to the prize once the modal has been dismissed — the
             tally stays complete, so without this there would be none. */
          <button
            type="button"
            className={`btn ${styles.claim}`}
            onClick={() => {
              close()
              window.dispatchEvent(new CustomEvent(PIKACHU_PRIZE))
            }}
          >
            Claim Your Prize
          </button>
        )}

        <button type="button" className={`btn ${styles.close}`} onClick={close}>
          Close
        </button>

        <button
          type="button"
          className={`${styles.reset} ${arming ? styles.arming : ''}`}
          onClick={() => {
            if (!arming) {
              setArming(true)
              return
            }
            resetEggs()
            setRainbow(false)
            setArming(false)
            close()
          }}
        >
          {arming ? 'Press again to clear all of them' : 'Reset eggs'}
        </button>
      </div>
    </div>
  )
}

/** The footer's way in. Absent until there is something to show. */
export function EggListLink({ className }: { className?: string }) {
  const found = useSyncExternalStore(subscribe, foundEggs, () => 0)
  const complete = useSyncExternalStore(subscribe, allFound, () => false)
  if (found === 0) return null

  return (
    <button type="button" className={className} onClick={openEggList}>
      {/* The egg hatches once the set is complete, and the label goes with it. */}
      <span aria-hidden="true">{complete ? '🐣' : '🥚'}</span>{' '}
      <span className={complete ? styles.linkDone : undefined}>
        {veiled('RUFTVEVSIEVHR1M=')} {found}/{totalEggs()}
      </span>
    </button>
  )
}
