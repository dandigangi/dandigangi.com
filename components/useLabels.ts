'use client'

import { useEffect, useState } from 'react'
/**
 * Copy that is not in the bundle, fetched by key.
 *
 * See app/l/route.ts for what lives there and why. Cached at module scope so a
 * session asks at most once per key and reopening anything is free — none of
 * these answers can change.
 */
const cache = new Map<string, string>()

export function useLabels(tokens: string[]): Map<string, string> {
  const [, bump] = useState(0)
  // Sorted, so the effect does not re-run on a reordering of the same set.
  const key = [...tokens].sort().join(',')

  useEffect(() => {
    const missing = key ? key.split(',').filter((id) => !cache.has(id)) : []
    if (missing.length === 0) return

    let live = true
    fetch(`/l?i=${missing.join(',')}`)
      .then((response) => (response.ok ? response.json() : {}))
      .then((names: Record<string, string>) => {
        if (!live) return
        for (const [id, name] of Object.entries(names)) cache.set(id, name)
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
