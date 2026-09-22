'use client'

import { useState } from 'react'
import { veiled } from '@/lib/copy'
import EggToast from './EggToast'
import styles from './TagRowEnd.module.css'

/**
 * The last thing in a tag row, and the only one you cannot see.
 *
 * It keeps a chip's footprint and a pointer cursor, so with a mouse the only
 * way to find it is to sweep past the end of the row and notice the cursor
 * change. There is no text node: an invisible element with a word inside it
 * still puts that word in the served HTML, which is the first place anyone
 * looks. The accessible name is supplied by `aria-label` instead, which never
 * reaches the markup as readable copy.
 *
 * It *is* focusable and it *is* announced. Hiding it from assistive tech would
 * make it a thing only sighted mouse users could ever reach, and the joke is
 * not worth that; a keyboard user tabs to it and hears its name, which is its
 * own way of finding it. The focus ring is the one state where it becomes
 * visible — a focusable control you cannot see is a trap.
 *
 * The bland name is deliberate too. In the browser this is a button with a
 * class called `spacer`, which is what it looks like.
 */
export default function TagRowEnd() {
  const [found, setFound] = useState(false)

  return (
    <>
      <button
        type="button"
        className={styles.spacer}
        aria-label={veiled('UGlrYWNodQ==')}
        onClick={() => setFound(true)}
      />
      <EggToast egg="hidden" show={found} />
    </>
  )
}
