'use client'

import { useClaimCode } from './useClaimCode'

/**
 * Mints the claim code the moment the tally completes, wherever that happens.
 *
 * Renders nothing. It exists because the mint used to be a side effect of some
 * piece of UI mounting — the prize modal, or the contact page — which meant the
 * notification fired when a winner happened to look at something rather than
 * when they won. Someone who had already dismissed the prize once never
 * reopened it, so nothing fired at all until they wandered onto /contact, and
 * the win arrived alongside whatever they did there.
 *
 * Mounted in the layout, so it is on every page and the win is the trigger.
 * One code per person regardless: the hook caches in localStorage and shares a
 * single request across every caller.
 */
export default function Watch() {
  useClaimCode()
  return null
}
