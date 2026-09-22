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
export type Claim = { code: string; claimed: boolean }

/**
 * Where a minted code is kept between page loads.
 *
 * Without this, the module cache lasts exactly one page view: a winner who
 * opens the prize, reloads, and later wanders onto the contact page mints three
 * codes and fires three notifications for one win. Minting is the moment worth
 * knowing about, so it should happen once per person, not once per render tree.
 */
const STORE_KEY = 'dd:f5'

const remembered = (): Claim | null => {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (!raw) return null
    const saved: unknown = JSON.parse(raw)
    if (typeof saved !== 'object' || saved === null) return null
    const { code, claimed } = saved as Partial<Claim>
    return typeof code === 'string' ? { code, claimed: claimed === true } : null
  } catch {
    // Private mode, or something else wrote here. Mint a fresh one.
    return null
  }
}

const remember = (claim: Claim) => {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(claim))
  } catch {
    // It will be minted again next visit. Not worth failing the claim over.
  }
}

let cached: Claim | null = null
let inflight: Promise<void> | null = null

export function useClaimCode(): Claim | null {
  const complete = useSyncExternalStore(subscribe, allTokens, () => false)
  const [code, setCode] = useState<Claim | null>(cached)

  useEffect(() => {
    if (!complete || code) return
    let live = true

    /*
     * One path whether or not the cache is warm. Branching to a synchronous
     * setCode for the cached case is a state update inside the effect body,
     * which react-hooks/set-state-in-effect objects to and is right to — the
     * resolved promise puts it in a microtask instead, where it belongs.
     */
    cached ??= remembered()

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
            .then((body: { code?: string; claimed?: boolean } | null) => {
              if (!body?.code) return
              cached = { code: body.code, claimed: body.claimed === true }
              remember(cached)
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
