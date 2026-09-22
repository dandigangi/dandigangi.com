import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { TOKENS, type Token } from '@/lib/ledger'

/**
 * Issues a claim code, and is honest about what that is worth.
 *
 * What it buys: a code in a claim email is one this server minted, and can be
 * checked against the secret with scripts/verify-claim.mjs. Before this, a
 * claim was an email saying "I won" and there was nothing to check it against.
 *
 * What it does not buy, and cannot: proof that whoever holds it earned it. The
 * tally lives in localStorage, so anyone can write the full set into the
 * console and ask for a code, and no amount of server-side anything fixes that
 * while the hunt itself runs in the browser. A model given only the live site
 * pointed this out as a bigger hole than everything it had just picked apart,
 * and it was right. This closes fabrication, not forgery.
 *
 * Every issue is logged, so the count of codes out there is knowable.
 */
const SECRET = process.env.EGG_SECRET

/**
 * Set this once the prize has actually been handed over, and everyone who
 * finishes afterwards is told so instead of being minted a code.
 *
 * An environment variable rather than a store, deliberately. A real
 * first-past-the-post needs durable state and a service to hold it, and this is
 * one gift card — you know when you have paid it out, and flipping a variable
 * is the whole mechanism. It does mean two people finishing in the same minute
 * both get a code, which is what the Discord pings are for: they are timestamped
 * and they arrive in order.
 */
const CLAIMED = process.env.PRIZE_CLAIMED === '1'

/** What the losers get, and it is not a real code — it verifies against
 *  nothing, which is the point: it cannot be mistaken for a winning claim. */
const CONSOLATION = 'HOW-DID-I-LOSE'

/**
 * Optional. Any endpoint that accepts a JSON POST — a Slack or Discord incoming
 * webhook, a Zapier or Make catch hook, a Pipedream URL.
 *
 * Deliberately generic rather than wired to one service: this needs to be a URL
 * in an env var and nothing else, so changing where the pings go never means
 * changing this file. Unset, it simply does not fire.
 */
const WEBHOOK = process.env.WEBHOOKS_EGGSWIN_URL

/**
 * Fire and forget, and never allowed to affect the response. Someone who just
 * won should get their code whether or not the ping lands, and a webhook that
 * is slow or down must not turn the last moment of the hunt into a spinner.
 */
const ping = (code: string, request: Request) => {
  if (!WEBHOOK) return
  const where = request.headers.get('referer') ?? 'unknown page'
  void fetch(WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // `text` is what Slack renders; `content` is what Discord renders. Sending
    // both means one payload works for either without a setting to get wrong.
    body: JSON.stringify({
      text: `🐣 Someone finished the easter egg hunt. Code: ${code} (from ${where})`,
      content: `🐣 Someone finished the easter egg hunt. Code: ${code} (from ${where})`,
    }),
  }).catch(() => {
    // Down, blocked, or a bad URL. The claim stands regardless.
  })
}

/** Six characters of MAC. Short enough to read down a phone, and it only has to
 *  beat guessing by someone who does not have the secret. */
const MAC_LENGTH = 6

/*
 * Hex, not base64url, for both halves — and that is not cosmetic. base64url's
 * alphabet contains the hyphen this code is delimited with, so a nonce could
 * and did come out as `VLz-yXBW`, which split into four parts and failed to
 * verify against the secret that had just minted it.
 */
const mac = (nonce: string, secret: string) =>
  createHmac('sha256', secret).update(nonce).digest('hex').slice(0, MAC_LENGTH)

export async function POST(request: Request) {
  if (!SECRET) {
    // Fails shut. A code minted with a default secret verifies against nothing
    // and would be worse than no code at all.
    return NextResponse.json({ error: 'unconfigured' }, { status: 503 })
  }

  let held: string[] = []
  try {
    const body: unknown = await request.json()
    if (typeof body === 'object' && body !== null) {
      const { t } = body as { t?: unknown }
      if (Array.isArray(t)) held = t.filter((id): id is string => typeof id === 'string')
    }
  } catch {
    // No body, or not JSON.
  }

  // The nine on the board. The off-board two are not required to win and are
  // not required here either.
  const complete = TOKENS.every((token: Token) => held.includes(token))
  if (!complete) return NextResponse.json({ error: 'incomplete' }, { status: 403 })

  if (CLAIMED) {
    console.log('[claim] late finisher, prize already gone')
    ping(CONSOLATION, request)
    return NextResponse.json(
      { code: CONSOLATION, claimed: true },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  }

  const nonce = randomBytes(5).toString('hex')
  const code = `DDG-${nonce}-${mac(nonce, SECRET)}`
  console.log(`[claim] issued ${code}`)
  ping(code, request)

  return NextResponse.json({ code }, { headers: { 'Cache-Control': 'no-store' } })
}

/** Exported for the verifier, so the two cannot drift apart. */
export function verify(code: string, secret: string): boolean {
  const parts = code.trim().split('-')
  if (parts.length !== 3 || parts[0] !== 'DDG') return false
  const expected = Buffer.from(mac(parts[1], secret))
  const given = Buffer.from(parts[2])
  return expected.length === given.length && timingSafeEqual(expected, given)
}
