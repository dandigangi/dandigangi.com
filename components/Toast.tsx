'use client'

import { useEffect } from 'react'
import { MAIL_URL, X_DM_URL } from '@/lib/pikachuLinks'
import styles from './Toast.module.css'

/** Long enough to read it and act on one of the two links, which is the whole
 *  reason it exists — a short toast with links in it is a tease. The × is there
 *  for anyone who would rather not wait it out. */
const DISMISS_MS = 30000

/**
 * The send-off after the last state is dismissed. It outlives the modal that
 * triggered it, so it is rendered by the cameo rather than inside the dialog.
 *
 * `onClose` must be referentially stable — the cameo re-renders on its own
 * schedule as he comes and goes, and a fresh identity each time would restart
 * the dismiss timer forever.
 */
export default function Toast({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, DISMISS_MS)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={styles.toast} role="status" aria-live="polite">
      <span className={styles.mark} aria-hidden="true">
        🎉👏
      </span>
      <p className={styles.text}>
        You found my easter egg! Make sure to{' '}
        <a href={MAIL_URL} className={styles.link}>
          email
        </a>{' '}
        or{' '}
        <a href={X_DM_URL} target="_blank" rel="noopener noreferrer" className={styles.link}>
          DM me on X
        </a>
        .
      </p>
      <button type="button" className={styles.close} onClick={onClose}>
        <span aria-hidden="true">×</span>
        <span className="srOnly">Dismiss</span>
      </button>
    </div>
  )
}
