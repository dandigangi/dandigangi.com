'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { MAIL_URL, X_DM_URL } from '@/lib/pikachuLinks'
import { veiled } from '@/lib/copy'
import styles from './Toast.module.css'

/**
 * 'prize' is the send-off for finishing the Pikachu chase, and carries the two
 * ways to claim it. 'egg' is the lighter acknowledgement used by the smaller
 * eggs around the site — it says well spotted and gets out of the way.
 */
export type ToastVariant = 'prize' | 'egg'

/**
 * The prize toast has to outlast reading it *and* acting on one of its links —
 * a short toast with links in it is a tease. The egg toast has nothing to act
 * on, so it behaves like an ordinary notification. The × is on both for anyone
 * who would rather not wait either out.
 */
const DISMISS_MS: Record<ToastVariant, number> = { prize: 30000, egg: 6000 }

/** Both toasts' copy, encoded for the reason in lib/copy.ts. Decode before editing. */
const FOUND = veiled('WW91IGZvdW5kIGFuIGVhc3RlciBlZ2ch')
const PRIZE_LEAD = veiled('WW91IGZvdW5kIG15IGVhc3RlciBlZ2chIE1ha2Ugc3VyZSB0byA=')
const PRIZE_MAIL = veiled('ZW1haWw=')
const PRIZE_OR = veiled('IG9yIA==')
const PRIZE_DM = veiled('RE0gbWUgb24gWA==')

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
  variant = 'prize',
  count,
  total,
}: {
  onClose: () => void
  variant?: ToastVariant
  /** Progress through the eggs, shown only when both are given. */
  count?: number
  total?: number
}) {
  const [leaving, setLeaving] = useState(false)
  const exit = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const out = setTimeout(() => setLeaving(true), DISMISS_MS[variant] - EXIT_MS)
    const gone = setTimeout(onClose, DISMISS_MS[variant])
    return () => {
      clearTimeout(out)
      clearTimeout(gone)
    }
  }, [onClose, variant])

  /** Dismissing by hand plays the same outro rather than cutting it. */
  const dismiss = useCallback(() => {
    setLeaving(true)
    exit.current = setTimeout(onClose, EXIT_MS)
  }, [onClose])

  // Owns only the hand-dismiss timer; the two above clean up on their own.
  useEffect(() => () => void (exit.current && clearTimeout(exit.current)), [])

  const progress = count !== undefined && total !== undefined ? ` (${count}/${total})` : ''

  return (
    <div
      className={`${styles.toast} ${variant === 'egg' ? styles.aboveModal : ''} ${
        leaving ? styles.leaving : ''
      }`}
      role="status"
      aria-live="polite"
    >
      <span className={styles.mark} aria-hidden="true">
        {variant === 'egg' ? '🐣' : '🎉👏'}
      </span>
      <p className={styles.text}>
        {variant === 'egg' ? (
          `${FOUND}${progress}`
        ) : (
          <>
            {PRIZE_LEAD}
            <a href={MAIL_URL} className={styles.link}>
              {PRIZE_MAIL}
            </a>
            {PRIZE_OR}
            <a href={X_DM_URL} target="_blank" rel="noopener noreferrer" className={styles.link}>
              {PRIZE_DM}
            </a>
            .
          </>
        )}
      </p>
      <button type="button" className={styles.close} onClick={dismiss}>
        <span aria-hidden="true">×</span>
        <span className="srOnly">Dismiss</span>
      </button>
    </div>
  )
}
