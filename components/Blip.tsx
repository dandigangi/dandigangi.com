'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { addToken, hasToken, type Token } from '@/lib/ledger'
import { useTokenCount, useTokenTotal } from './useLedger'
import { useLabels } from './useLabels'
import Toast from './Toast'

/**
 * The acknowledgement for the smaller eggs around the site — typing his name
 * into the blog search, guessing the password on the fake admin page, the first
 * Pokéball.
 *
 * Once dismissed it stays dismissed for the life of this mount, so retyping the
 * trigger does not fire it again. Finding a thing twice is not finding it twice.
 */
export default function Blip({ egg, show }: { egg: Token; show: boolean }) {
  const [dismissed, setDismissed] = useState(false)

  /**
   * Whether this egg was already in the tally when the page loaded. Captured
   * once, so re-triggering something you found last week says nothing — the
   * toast announces a discovery, not a trigger. Without it, every visit to a
   * page you have already solved re-congratulates you for it.
   */
  const [alreadyKnown] = useState(() => hasToken(egg))
  // Stable, because Toast restarts its own dismiss timer whenever this changes.
  const close = useCallback(() => setDismissed(true), [])

  /**
   * Recorded in an effect and read back through the store, rather than set into
   * state here: `addToken` is the thing that changes, and driving the number off
   * the store means every other mounted counter agrees with this one without
   * anything having to tell them.
   */
  useEffect(() => {
    if (show) addToken(egg)
  }, [show, egg])

  /**
   * A line in the console for anyone who has one open, with the same name the
   * list uses.
   *
   * Gated on this being a new find, like the toast is — reopening a page you
   * solved last week should not announce it again. The name is fetched rather
   * than shipped (see app/l/route.ts), so this waits for it rather than logging
   * an id nobody can read.
   */
  const name = useLabels(show && !alreadyKnown ? [egg] : []).get(egg)
  // A ref rather than state: this guards a side effect and must not itself
  // cause a render, which is also what react-hooks/purity is there to catch.
  const logged = useRef(false)
  useEffect(() => {
    if (!show || alreadyKnown || logged.current || !name) return
    logged.current = true
    console.log(`🐣 easter egg found - ${name}`)
  }, [show, alreadyKnown, name])

  /**
   * `null` on the server, and therefore also through hydration, because the
   * tally lives in localStorage. Toast omits the parenthetical when the count is
   * undefined, so the server-rendered admin egg ships "You found an easter egg!"
   * and the number appears a beat later — rather than shipping "(0/3)", which is
   * the one thing it must never say, and which any count matching the server
   * would have to say.
   */
  const found = useTokenCount()
  const total = useTokenTotal()

  if (!show || dismissed || alreadyKnown) return null
  return <Toast count={found} total={total} onClose={close} />
}
