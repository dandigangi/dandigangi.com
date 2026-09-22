'use client'

import { useEffect, useState } from 'react'
import type { Token } from '@/lib/ledger'

/**
 * Names for the tokens someone holds, fetched rather than shipped.
 *
 * See app/l/route.ts for why they are not in the bundle. Cached at module
 * scope so reopening the list is free and a session asks at most once per
 * token — the answer cannot change.
 */
const cache = new Map<Token, string>()

export function useLabels(tokens: Token[]): Map<Token, string> {
  const [, bump] = useState(0)
  // Sorted, so the effect does not re-run on a reordering of the same set.
  const key = [...tokens].sort().join(',')

  useEffect(() => {
    const missing = key ? key.split(',').filter((id) => !cache.has(id as Token)) : []
    if (missing.length === 0) return

    let live = true
    fetch(`/l?i=${missing.join(',')}`)
      .then((response) => (response.ok ? response.json() : {}))
      .then((names: Record<string, string>) => {
        if (!live) return
        for (const [id, name] of Object.entries(names)) cache.set(id as Token, name)
        bump((at) => at + 1)
      })
      // Offline, blocked, or the route is down: the list renders without names
      // rather than not rendering. The count and the timestamps still stand.
      .catch(() => {})

    return () => {
      live = false
    }
  }, [key])

  return cache
}
