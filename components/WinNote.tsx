'use client'

import { veiled } from '@/lib/copy'
import { OFFER_FIGURE } from '@/lib/caller'
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
        {veiled('Q29uZ3JhdHMh')} {veiled('WW91IHdvbiB0aGUgRWFzdGVyIEVnZyBjb250ZXN0IGFuZCBhIA==')}$
        {OFFER_FIGURE} {veiled('Z2lmdCBjYXJkLg==')}
      </h2>
      <p className={styles.body}>
        {veiled('UmVhY2ggbWUgZGlyZWN0bHkgYXQ=')}{' '}
        <a href={`mailto:${claim.to}`} className={styles.mail}>
          {claim.to}
        </a>{' '}
        {veiled(
          'LSBvciBqdXN0IHNlbmQgdGhlIGZvcm0gYmVsb3csIHdoaWNoIGNhcnJpZXMgeW91ciBjb2RlIGZvciB5b3Uu'
        )}
      </p>
    </div>
  )
}
