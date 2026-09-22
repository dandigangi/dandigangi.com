'use client'

import { useState } from 'react'
import EggToast from './EggToast'
import styles from './TagRowEnd.module.css'

/**
 * The last thing in the tag row, and the only one you cannot see.
 *
 * It keeps a chip's footprint and a pointer cursor, so the only way to find it
 * is to be moving the mouse past the end of the row and notice the cursor
 * change. There is nothing to read, nothing to tab to, and — deliberately — no
 * text content at all: an invisible element with a word inside it still puts
 * that word in the served HTML, which is the first place anyone looks.
 *
 * The bland name is the same idea. In the browser this is a div with a class
 * called `spacer`, which is what it looks like.
 *
 * `aria-hidden` and `tabIndex={-1}` are not an oversight: an invisible control
 * in the tab order is a trap for a keyboard user, and an unlabelled one is
 * worse. Hidden from everyone means hidden from everyone.
 */
export default function TagRowEnd() {
  const [found, setFound] = useState(false)

  return (
    <>
      <span className={styles.spacer} aria-hidden="true" onClick={() => setFound(true)} />
      <EggToast egg="hidden" show={found} />
    </>
  )
}
