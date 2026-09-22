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

/*
 * There was a mailto here, pre-filled with the subject and the claim code. The
 * third way out of the prize is the contact page now, which carries the code on
 * its own form — so the address is reached the same way everyone else reaches
 * it, and there is no second copy of the subject line to drift.
 */

/**
 * LinkedIn has no compose deep link that works for someone who is not already a
 * connection, so this is the profile — one click short of a message, which is
 * as close as the platform allows.
 */
export const LINKEDIN_URL = siteMetadata.linkedin
