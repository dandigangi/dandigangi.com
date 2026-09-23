'use client'

import { useSyncExternalStore } from 'react'
import { EXTRA, hasToken, hasWon, subscribe as subscribeTokens } from '@/lib/ledger'
import { isTrail, setTrail, subscribe } from '@/lib/trail'
import { useLabels } from './useLabels'

const foundTrail = () => hasToken(EXTRA)

/**
 * The Rainbow Road switch that sits beside the nav mark and in the footer.
 *
 * Shown once the mode has been found, or the hunt won — a winner gets it greyed
 * out as a reward even without the phrase — and from then on it stays, on or
 * off. `on` counts too: the dev dock can switch the mode on without the find.
 *
 * Toggling never records the egg; only the typed phrase does (setTrail never
 * touches the ledger).
 */
export function useTrailMark() {
  const on = useSyncExternalStore(subscribe, isTrail, () => false)
  const found = useSyncExternalStore(subscribeTokens, foundTrail, () => false)
  const won = useSyncExternalStore(subscribeTokens, hasWon, () => false)
  const shown = on || found || won
  const names = useLabels(shown ? ['c1', 'c2'] : [])
  return {
    on,
    shown,
    label: names.get(on ? 'c2' : 'c1') ?? '',
    toggle: () => setTrail(!on),
  }
}
