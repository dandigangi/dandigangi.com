'use client'

import { useEffect } from 'react'
import { MAIL_URL, X_DM_URL } from '@/lib/pikachuLinks'
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
}: {
  onClose: () => void
  variant?: ToastVariant
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, DISMISS_MS[variant])
    return () => clearTimeout(timer)
  }, [onClose, variant])

  return (
    <div className={styles.toast} role="status" aria-live="polite">
      <span className={styles.mark} aria-hidden="true">
        {variant === 'egg' ? '🐣' : '🎉👏'}
      </span>
      <p className={styles.text}>
        {variant === 'egg' ? (
          'You found an easter egg!'
        ) : (
          <>
            You found my easter egg! Make sure to{' '}
            <a href={MAIL_URL} className={styles.link}>
              email
            </a>{' '}
            or{' '}
            <a href={X_DM_URL} target="_blank" rel="noopener noreferrer" className={styles.link}>
              DM me on X
            </a>
            .
          </>
        )}
      </p>
      <button type="button" className={styles.close} onClick={onClose}>
        <span aria-hidden="true">×</span>
        <span className="srOnly">Dismiss</span>
      </button>
    </div>
  )
}
