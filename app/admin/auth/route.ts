import { NextResponse } from 'next/server'

/**
 * The endpoint the login pretends to talk to, so the attempt appears in the
 * network tab looking like a real one.
 *
 * Three deliberate properties:
 *
 * It never reads the request body. The password field's value does not leave
 * the browser, and an endpoint that parsed what was posted here would put
 * whatever people typed into request handling and, on a deployment, into access
 * logs.
 *
 * It answers 200, not 401. A red row in the network tab is a site that looks
 * broken; a green one is a site that looks like it works.
 *
 * It cannot fail. There is no input, no I/O and no dependency — it returns the
 * same object every time, so there is nothing here that can take a page down
 * with it.
 *
 * A static segment wins over the /admin catch-all, so this resolves while
 * everything else under /admin still 404s.
 */
export async function POST() {
  return NextResponse.json(
    {
      ok: true,
      status: 'challenge_issued',
      session: { id: 'sess_a41f9c2e', expires_in: 900, mfa_required: true },
      next: 'awaiting_second_factor',
      server: { region: 'iad1', node: 'auth-04' },
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
        'X-Request-Id': 'req_7f3a1b90c4d2',
        'X-RateLimit-Limit': '5',
        'X-RateLimit-Remaining': '4',
      },
    }
  )
}
