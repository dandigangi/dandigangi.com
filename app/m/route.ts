import { NextResponse } from 'next/server'

/**
 * The contact form's only destination.
 *
 * The webhook URL is read here rather than shipped, for the obvious reason: a
 * URL in the bundle is a URL anyone can post to directly, and the form's own
 * checks below would be the first thing they skipped.
 */
const WEBHOOK = process.env.WEBHOOKS_CONTACT_URL

/** Caps, so a single submission cannot be used to flood a channel. */
const LIMITS = { name: 120, email: 200, message: 4000 }

/**
 * How long a real person takes to fill this in, at the absolute floor.
 *
 * Bots post the instant they parse the form. This is the cheapest filter that
 * catches them and it costs a human nothing — by the time anyone has typed a
 * message they are well past it.
 */
const MIN_FILL_MS = 3000

const clean = (value: unknown, limit: number): string =>
  typeof value === 'string' ? value.trim().slice(0, limit) : ''

export async function POST(request: Request) {
  if (!WEBHOOK) return NextResponse.json({ error: 'unconfigured' }, { status: 503 })

  let body: Record<string, unknown> = {}
  try {
    const parsed: unknown = await request.json()
    if (typeof parsed === 'object' && parsed !== null) body = parsed as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  /*
   * The honeypot. A field no human can see and no human will fill, which most
   * form bots populate because they fill everything. Answered with the same 200
   * a real submission gets: telling a bot it was caught is telling whoever
   * wrote it what to change.
   */
  if (clean(body.website, 50) !== '') return NextResponse.json({ ok: true })

  const started = Number(body.t)
  if (!Number.isFinite(started) || Date.now() - started < MIN_FILL_MS) {
    return NextResponse.json({ ok: true })
  }

  const name = clean(body.name, LIMITS.name)
  const email = clean(body.email, LIMITS.email)
  const message = clean(body.message, LIMITS.message)

  // Deliberately loose. A regex that rejects a valid address is worse than one
  // that accepts an invalid one — the reply just bounces, and nobody is
  // authenticated here anyway.
  if (!name || !message || !email.includes('@')) {
    return NextResponse.json({ error: 'incomplete' }, { status: 400 })
  }

  const text = [`📬 New message from ${name} <${email}>`, '', message].join('\n')

  try {
    const sent = await fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // `content` is Discord's field, `text` is Slack's — one payload, either.
      body: JSON.stringify({ content: text, text }),
    })
    if (!sent.ok) throw new Error(String(sent.status))
  } catch {
    // Said plainly rather than swallowed: unlike the win ping, this is the only
    // copy of what someone wrote, and pretending it arrived would lose it.
    return NextResponse.json({ error: 'undelivered' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
