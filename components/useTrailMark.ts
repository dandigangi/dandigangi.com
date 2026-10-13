'use client'

import { useSyncExternalStore } from 'react'
import { isTrail, setTrail, subscribe } from '@/lib/trail'
import { useLabels } from './useLabels'

/**
 * The Rainbow Road switch that sits beside the nav mark and in the footer.
 *
 * Always shown now the hunt is over: anyone can switch the mode on, but toggling
 * never records the egg — only the typed phrase does (setTrail never touches the
 * ledger).
 */
export function useTrailMark() {
  const on = useSyncExternalStore(subscribe, isTrail, () => false)
  const names = useLabels(['c1', 'c2'])
  return {
    on,
    label: names.get(on ? 'c2' : 'c1') ?? '',
    toggle: () => setTrail(!on),
  }
}
