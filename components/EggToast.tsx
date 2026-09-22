'use client'

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { TOTAL_EGGS, findEgg, foundEggs, hasEgg, subscribe, type Egg } from '@/lib/eggs'
import Toast from './Toast'

/**
 * The acknowledgement for the smaller eggs around the site — typing his name
 * into the blog search, guessing the password on the fake admin page, the first
 * Pokéball.
 *
 * Once dismissed it stays dismissed for the life of this mount, so retyping the
 * trigger does not fire it again. Finding a thing twice is not finding it twice.
 */
export default function EggToast({ egg, show }: { egg: Egg; show: boolean }) {
  const [dismissed, setDismissed] = useState(false)

  /**
   * Whether this egg was already in the tally when the page loaded. Captured
   * once, so re-triggering something you found last week says nothing — the
   * toast announces a discovery, not a trigger. Without it, every visit to a
   * page you have already solved re-congratulates you for it.
   */
  const [alreadyKnown] = useState(() => hasEgg(egg))
  // Stable, because Toast restarts its own dismiss timer whenever this changes.
  const close = useCallback(() => setDismissed(true), [])

  /**
   * Recorded in an effect and read back through the store, rather than set into
   * state here: `findEgg` is the thing that changes, and driving the number off
   * the store means every other mounted counter agrees with this one without
   * anything having to tell them.
   */
  useEffect(() => {
    if (show) findEgg(egg)
  }, [show, egg])

  /**
   * `null` on the server, and therefore also through hydration, because the
   * tally lives in localStorage. Toast omits the parenthetical when the count is
   * undefined, so the server-rendered admin egg ships "You found an easter egg!"
   * and the number appears a beat later — rather than shipping "(0/3)", which is
   * the one thing it must never say, and which any count matching the server
   * would have to say.
   */
  const found = useSyncExternalStore(subscribe, foundEggs, () => null)

  if (!show || dismissed || alreadyKnown) return null
  return <Toast variant="egg" count={found ?? undefined} total={TOTAL_EGGS} onClose={close} />
}
