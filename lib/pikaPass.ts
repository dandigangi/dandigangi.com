/**
 * The memory of having guessed his name at /admin.
 *
 * A cookie rather than localStorage, because the page that reacts to it is a
 * server component: it has to know before it renders, or the lulz page paints
 * plain and then has a full-bleed Pikachu drop onto it a frame later.
 *
 * The expiry is the cookie's own `max-age`, so the browser does the forgetting
 * and there is no timestamp to validate on the way back in. Nothing is stored
 * in it — its presence is the whole payload.
 */
export const PIKA_PASS = 'dd_pika'

/** Long enough to survive a reload and a wander round the site, short enough
 *  that coming back tomorrow means guessing again. */
export const PIKA_PASS_MS = 60 * 60 * 1000

/**
 * Scoped to /admin so it is never sent with a request for anything else — the
 * rest of the site has its own, unrelated reason to go yellow.
 */
const PATH = '/admin'

/** Client-side. Called the moment the guess lands, before the redirect, so the
 *  navigation that renders the lulz page already carries it. */
export const grantPikaPass = () => {
  try {
    const secure = location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${PIKA_PASS}=1; Max-Age=${PIKA_PASS_MS / 1000}; Path=${PATH}; SameSite=Lax${secure}`
  } catch {
    // Blocked cookies. The `?pika=1` on the redirect still shows him once.
  }
}

/** Forgets the guess. Only the local dev dock calls this — the pass otherwise
 *  expires on its own `max-age`. */
export const clearPikaPass = () => {
  try {
    document.cookie = `${PIKA_PASS}=; path=${PATH}; max-age=0; SameSite=Lax`
  } catch {
    // Blocked cookies. There was nothing to clear in that case anyway.
  }
}
