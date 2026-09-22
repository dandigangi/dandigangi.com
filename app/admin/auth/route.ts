/**
 * The endpoint the login talks to, and the only thing that decides whether the
 * guess was right.
 *
 * It used to decide nothing: the comparison was client-side against a constant
 * in the bundle, and the reward was handed out by a query parameter. A model
 * given only the live site read the answer straight out of the pre-rendered
 * HTML without ever typing a password. So the expected digest lives here now,
 * where the browser cannot read it, and the cookie is set here rather than by
 * document.cookie — httpOnly, so the page cannot forge it either.
 *
 * The property that made the old version worth keeping is preserved: the
 * password itself still never leaves the browser. What is posted is its digest,
 * so nothing anyone types reaches request handling or a deployment's access
 * logs.
 *
 * It answers 200 and the same decoy body either way. A red row in the network
 * tab is a site that looks broken, and a response that differs on success is a
 * response you can diff your way to the answer with.
 */
import { NextResponse } from 'next/server'
import { LIT_PASS, LIT_PASS_MS } from '@/lib/pass'

/**
 * The digest the gate expects. Never sent to the client.
 *
 * Deliberately not the same digest the blog search compares against, even
 * though it is the same word. That one has to be in the bundle — the search
 * filters as you type, so the check cannot be anything but client-side — and
 * if this expected the same value, reading it there and posting it here would
 * walk straight past the gate without ever knowing the word.
 *
 * The suffix below is in the bundle too, and that is fine: it is not the word,
 * and without the word it does not get you from one digest to the other.
 */
const EXPECTED = '1anvycr.14svmtz'

const DECOY = {
  ok: true,
  status: 'challenge_issued',
  session: { id: 'sess_a41f9c2e', expires_in: 900, mfa_required: true },
  next: 'awaiting_second_factor',
  server: { region: 'iad1', node: 'auth-04' },
}

const HEADERS = {
  'Cache-Control': 'no-store',
  'X-Request-Id': 'req_7f3a1b90c4d2',
  'X-RateLimit-Limit': '5',
  'X-RateLimit-Remaining': '4',
}

export async function POST(request: Request) {
  let digest = ''
  try {
    const body: unknown = await request.json()
    if (typeof body === 'object' && body !== null) {
      const { h } = body as { h?: unknown }
      if (typeof h === 'string' && h.length <= 64) digest = h
    }
  } catch {
    // No body, or not JSON. Treated exactly like a wrong answer.
  }

  const response = NextResponse.json(DECOY, { status: 200, headers: HEADERS })

  if (digest === EXPECTED) {
    response.cookies.set(LIT_PASS, '1', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/admin',
      maxAge: LIT_PASS_MS / 1000,
    })
  }

  return response
}
