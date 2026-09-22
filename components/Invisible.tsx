'use client'

import { useState } from 'react'
import styles from './Invisible.module.css'

/**
 * Text that sits on the page unseen: selecting it shows it, clicking it lights
 * it up in the Rainbow Road text treatment.
 */
export default function Invisible({ text }: { text: string }) {
  const [shown, setShown] = useState(false)

  const reveal = () => {
    // A drag-select that starts and ends on this line also fires a click, and
    // selecting is meant to be its own, quieter way of finding it.
    if (window.getSelection()?.toString()) return
    setShown(true)
  }

  return (
    <p className={shown ? styles.shown : styles.hidden} onClick={reveal}>
      {text}
    </p>
  )
}
