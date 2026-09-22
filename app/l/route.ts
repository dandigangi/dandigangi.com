import { NextResponse } from 'next/server'
import { T, type Token } from '@/lib/ledger'

/**
 * Names for tokens the caller says they hold.
 *
 * This table used to sit in lib/ledger.ts, base64-encoded, and ship to every
 * visitor. Base64 is not obfuscation — a model pointed at the built bundle
 * decoded every literal in one pass and had the complete list of what exists,
 * and what each one is, before it had located a single trigger. That inventory
 * was the single biggest giveaway on the site: it turned "find the surprises"
 * into "confirm the list".
 *
 * Here it is server-only, so the bundle carries opaque ids and nothing else.
 *
 * What this does not do, and is not pretending to do: stop anyone determined.
 * There are eleven ids and they are all in the bundle, so a loop over them
 * returns the same table. The point is that it is no longer free — it costs
 * deliberate, obvious effort instead of arriving with one `atob`. That is the
 * whole claim; see lib/copy.ts.
 */
const NAMES: Record<Token, string> = {
  [T.met]: 'Met Pikachu',
  [T.tier1]: 'Pushed him past $250',
  [T.tier2]: 'Pushed him past $500',
  [T.probe]: 'Searched the blog for him',
  [T.gate]: 'Guessed the admin password',
  [T.toss]: 'Threw a Pokeball at him',
  [T.dial]: 'Turned the whole tagline wheel',
  [T.tail]: 'Found the chip that is not there',
  [T.twin]: 'Met the alter ego',
  [T.arc]: '[SECRET] RAINBOW ROAD DISCOVERED',
  [T.rails]: 'Tried every way to get paid',
}

const known = (id: string): id is Token => id in NAMES

export function GET(request: Request) {
  const asked = new URL(request.url).searchParams.get('i')?.split(',') ?? []
  // Capped so the endpoint cannot be used to fan out, and unknown ids are
  // dropped rather than answered — it says nothing about what it does not hold.
  const found = Object.fromEntries(
    asked
      .slice(0, 16)
      .filter(known)
      .map((id) => [id, NAMES[id]])
  )
  return NextResponse.json(found, {
    // Per-visitor and cheap to recompute; caching it at the edge would put the
    // full table one request away from anyone who found the URL in a log.
    headers: { 'Cache-Control': 'no-store' },
  })
}
