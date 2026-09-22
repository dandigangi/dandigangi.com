'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { allTokens, subscribe, tokenList } from '@/lib/ledger'

/**
 * The claim code, for anywhere that needs to show it.
 *
 * Cached at module scope because two places ask — the win modal and the contact
 * form — and a code is a code: minting a second one for the same person would
 * put two valid strings in circulation for one win, which is the one thing that
 * makes a claim harder to check rather than easier.
 *
 * `null` until it arrives, and `null` for good if the route is unconfigured or
 * unreachable. Every caller is expected to render nothing in that case; the
 * claim still works without it, as it did before there were codes.
 */
let cached: string | null = null
let inflight: Promise<void> | null = null

export function useClaimCode(): string | null {
  const complete = useSyncExternalStore(subscribe, allTokens, () => false)
  const [code, setCode] = useState<string | null>(cached)

  useEffect(() => {
    if (!complete || code) return
    let live = true

    /*
     * One path whether or not the cache is warm. Branching to a synchronous
     * setCode for the cached case is a state update inside the effect body,
     * which react-hooks/set-state-in-effect objects to and is right to — the
     * resolved promise puts it in a microtask instead, where it belongs.
     */
    const pending =
      cached !== null
        ? Promise.resolve()
        : (inflight ??= fetch('/c', {
            method: 'POST',
            cache: 'no-store',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ t: tokenList().map((entry) => entry.egg) }),
          })
            .then((response) => (response.ok ? response.json() : null))
            .then((body: { code?: string } | null) => {
              if (body?.code) cached = body.code
            })
            .catch(() => {
              // Offline, or the secret is not configured. Nothing to show.
            })
            .finally(() => {
              inflight = null
            }))

    void pending.then(() => {
      if (live) setCode(cached)
    })

    return () => {
      live = false
    }
  }, [complete, code])

  return code
}
