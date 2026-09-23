'use client'

import { veiled } from '@/lib/copy'
import { OFFER_FIGURE } from '@/lib/caller'
import { LINKEDIN_URL, X_DM_URL } from '@/lib/callerLinks'
import { useClaimCode } from './useClaimCode'
import styles from './WinNote.module.css'

/**
 * What a winner sees on the contact page, and nobody else does.
 *
 * It also carries the address that is not printed anywhere on this site. That
 * arrives with the claim code from /c, which is the one endpoint that asks for
 * the full set first — so it is not in the bundle, not in the static HTML, and
 * out of reach of anything that does not run JavaScript.
 */
export default function WinNote() {
  const claim = useClaimCode()
  if (!claim) return null

  return (
    <div className={styles.note}>
      <h2 className={styles.head}>
        {claim.claimed ? (
          <>
            {veiled('WW91ciBkZWRpY2F0aW9uIGlzIGltcHJlc3NpdmUgYnV0Li4u')}{' '}
            {veiled('c29tZW9uZSBhbHJlYWR5IHdvbiB0aGUgRWFzdGVyIEVnZyBIdW50IENvbnRlc3Qu')}
          </>
        ) : (
          <>
            {veiled('WW91IHdvbiB0aGUgRWFzdGVyIEVnZyBjb250ZXN0IGFuZCBhIA==')}${OFFER_FIGURE}{' '}
            {veiled('Z2lmdCBjYXJkLg==')}
          </>
        )}
      </h2>
      <p className={styles.body}>
        {claim.claimed
          ? veiled(
              'VGhhbmtzIGZvciBwbGF5aW5nIG15IGdhbWUsIFBhcnppdmFsLiBZb3UgY2FuIHN0aWxsIGxldCBtZSBrbm93IHlvdSB3b24gYmVsb3csIA=='
            )
          : veiled(
              'VGhhbmtzIGZvciBwbGF5aW5nIG15IGdhbWUsIFBhcnppdmFsLiBSZWFjaCBvdXQgdG8gbWUgYmVsb3cgb3IgRE0gbWUgb24g'
            )}
        <a href={X_DM_URL} target="_blank" rel="noopener noreferrer" className={styles.mail}>
          {veiled('WA==')}
        </a>
        {claim.claimed ? veiled('LCBvciA=') : veiled('LCA=')}
        <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className={styles.mail}>
          {veiled('TGlua2VkSW4=')}
        </a>
        {claim.claimed ? veiled('Lg==') : veiled('IHcvIHlvdXIgY2xhaW0gY29kZS4=')}
      </p>
    </div>
  )
}
