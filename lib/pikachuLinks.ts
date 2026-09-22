import siteMetadata from '@/data/siteMetadata'

/**
 * The two ways to claim the last state, shared by the modal that offers them
 * and the toast that follows it — one definition, so the address and the
 * subject line cannot drift apart between the two.
 */

/**
 * X's compose deep link only takes a numeric account id — a handle in
 * `recipient_id` does nothing.
 * https://developer.x.com/en/docs/x-for-websites/direct-message-button
 */
const X_RECIPIENT_ID = '192625645'

export const X_DM_URL = `https://x.com/messages/compose?recipient_id=${X_RECIPIENT_ID}`

/**
 * Base64 for the same reason the modal's copy is: skimming the repo or grepping
 * the built JS shouldn't hand someone the surprise. Decode before editing.
 */
const SUBJECT = new TextDecoder().decode(
  Uint8Array.from(atob('RWFzdGVyIEVnZyBHaWZ0Y2FyZCE='), (character) => character.charCodeAt(0))
)

/** Pre-filled so one of these is recognisable in the inbox without opening it. */
export const MAIL_URL = `mailto:${siteMetadata.email}?subject=${encodeURIComponent(SUBJECT)}`

/**
 * LinkedIn has no compose deep link that works for someone who is not already a
 * connection, so this is the profile — one click short of a message, which is
 * as close as the platform allows.
 */
export const LINKEDIN_URL = siteMetadata.linkedin
