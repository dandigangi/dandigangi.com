'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { veiled } from '@/lib/copy'
import { openEggList } from './EggList'
import styles from './Toast.module.css'

/**
 * Long enough to be read, understood, and acted on: the count in it is a
 * control, so it has to survive being noticed as one. The × is there for anyone
 * who would rather not wait it out.
 */
const DISMISS_MS = 9500

/** Encoded for the reason in lib/copy.ts. Decode before editing. */
const FOUND = veiled('WW91IGZvdW5kIGFuIGVhc3RlciBlZ2ch')

/**
 * How long the outro runs. Subtracted from the dismiss time rather than added
 * to it, so the toast is still gone exactly when it always was — it just stops
 * vanishing between one frame and the next.
 */
export const EXIT_MS = 260

/**
 * The send-off after the last state is dismissed. It outlives the modal that
 * triggered it, so it is rendered by the cameo rather than inside the dialog.
 *
 * `onClose` must be referentially stable — the cameo re-renders on its own
 * schedule as he comes and goes, and a fresh identity each time would restart
 * the dismiss timer forever.
 */
export default function Toast({
  onClose,
  count,
  total,
}: {
  onClose: () => void
  /** Progress through the eggs, shown only when both are given. */
  count?: number
  total?: number
}) {
  const [leaving, setLeaving] = useState(false)
  const exit = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const out = setTimeout(() => setLeaving(true), DISMISS_MS - EXIT_MS)
    const gone = setTimeout(onClose, DISMISS_MS)
    return () => {
      clearTimeout(out)
      clearTimeout(gone)
    }
  }, [onClose])

  /** Dismissing by hand plays the same outro rather than cutting it. */
  const dismiss = useCallback(() => {
    setLeaving(true)
    exit.current = setTimeout(onClose, EXIT_MS)
  }, [onClose])

  // Owns only the hand-dismiss timer; the two above clean up on their own.
  useEffect(() => () => void (exit.current && clearTimeout(exit.current)), [])

  const hasProgress = count !== undefined && total !== undefined

  return (
    <div
      className={`spectrumRing ${styles.toast} ${leaving ? styles.leaving : ''}`}
      role="status"
      aria-live="polite"
    >
      <span className={styles.mark} aria-hidden="true">
        🐣
      </span>
      <p className={styles.text}>
        {FOUND}{' '}
        {hasProgress && (
          /* The count is the way into the list — the toast is the only place it
             is guaranteed to be on screen at the moment one is found. */
          <button type="button" className={styles.count} onClick={openEggList}>
            ({count}/{total})
          </button>
        )}
      </p>
      <button type="button" className={styles.close} onClick={dismiss}>
        <span aria-hidden="true">×</span>
        <span className="srOnly">Dismiss</span>
      </button>
    </div>
  )
}
