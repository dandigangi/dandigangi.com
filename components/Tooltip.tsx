import type { ReactNode } from 'react'
import styles from './Tooltip.module.css'

/**
 * Hover/focus tooltip in the Pikachu modal's style (Invoice's `.frown`). Give
 * the trigger `aria-describedby={id}` so screen readers get the text too.
 */
export default function Tooltip({
  id,
  text,
  children,
}: {
  id: string
  text: string
  children: ReactNode
}) {
  return (
    <span className={styles.anchor}>
      {children}
      <span id={id} role="tooltip" className={styles.tip}>
        {text}
      </span>
    </span>
  )
}
