'use client'

import { useState } from 'react'
import { veiled } from '@/lib/copy'
import Blip from './Blip'
import styles from './ChipTail.module.css'
import { T } from '@/lib/ledger'

/**
 * The last thing in a tag row, and the only one you cannot see — until you find
 * it, at which point it stops hiding and becomes an ordinary label in his
 * yellow. Nothing to press twice: the puzzle is over, so the cursor, the hover
 * and the click all go with it.
 *
 * Before that there is no text node: an invisible element with a word inside it
 * still puts that word in the served HTML, which is the first place anyone
 * looks. The accessible name comes from `aria-label` instead, and the visible
 * text only ever exists after a press, on the client.
 *
 * It *is* focusable and it *is* announced. Hiding it from assistive tech would
 * make it a thing only sighted mouse users could reach, and the joke is not
 * worth that; a keyboard user tabs to it and hears its name, which is its own
 * way of finding it. The focus ring is the one state where it is visible before
 * being found — a focusable control you cannot see is a trap.
 *
 * The bland name is deliberate too: in the browser this is a `spacer`.
 */
export default function ChipTail() {
  const [found, setFound] = useState(false)
  const name = veiled('UGlrYWNodQ==')

  if (found) {
    return (
      <>
        <span className={styles.revealed}>{name}</span>
        <Blip egg={T.tail} show />
      </>
    )
  }

  return (
    <button
      type="button"
      className={styles.spacer}
      aria-label={name}
      onClick={() => setFound(true)}
    />
  )
}
