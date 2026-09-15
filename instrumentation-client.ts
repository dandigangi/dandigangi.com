import posthog from 'posthog-js'

/**
 * Next runs this on the client before the app hydrates, which is why PostHog
 * does not need a provider component or an effect in the layout.
 *
 * The key is a public project token — it ships in the client bundle by design.
 * A PostHog *personal* API key is a different credential and must never appear
 * here or anywhere else in the repo.
 *
 * Guarded so local runs without the env var configured simply skip tracking
 * rather than throwing.
 */
const key = process.env.NEXT_PUBLIC_POSTHOG_KEY

if (key) {
  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
    // Pins PostHog's own default behaviours (autocapture, pageviews, replay) to
    // a dated baseline so an SDK upgrade cannot silently change what is collected.
    defaults: '2026-05-30',
  })
}
