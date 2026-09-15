/**
 * The slim build deliberately: the default entry statically imports rrweb (the
 * session-replay recorder), which lands ~520KB in the first-load bundle whether
 * or not recording is enabled. `disable_session_recording` only stops it running
 * — it does not stop it shipping. This site wants pageviews and events, so the
 * recorder should never be in the bundle at all.
 */
import posthog from 'posthog-js/dist/module.slim'

/**
 * Next runs this on the client before the app hydrates, which is why PostHog
 * needs no provider component and no effect in the layout.
 *
 * The key is a public project token — it ships in the client bundle by design.
 * A PostHog *personal* API key is a different credential and must never appear
 * here or anywhere else in the repo.
 *
 * Production-only on purpose: local and preview traffic would otherwise show up
 * as real sessions. Initialising with a placeholder key is not equivalent — the
 * SDK still boots, still records, and still fires requests that merely fail.
 * To exercise PostHog locally, set NEXT_PUBLIC_POSTHOG_DEBUG=true with a real key.
 */
const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
const enabled =
  Boolean(key) &&
  (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_POSTHOG_DEBUG === 'true')

if (enabled) {
  posthog.init(key!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
    // Pins PostHog's own default behaviours to a dated baseline so an SDK
    // upgrade cannot silently change what is collected.
    defaults: '2026-05-30',
    // This site wants pageviews and events, not replay. Replay is also the bulk
    // of the SDK's weight (rrweb), and weight here costs LCP, which costs SEO.
    disable_session_recording: true,
  })
}
