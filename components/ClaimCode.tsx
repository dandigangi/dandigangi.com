'use client'

import { useState } from 'react'
import { veiled } from '@/lib/copy'
import styles from './ClaimCode.module.css'

/**
 * The claim code, and the one thing the person who earned it has to carry out
 * of here.
 *
 * The whole box copies, not just the button — a code someone fails to copy is a
 * win they cannot prove, and making the target the size of the box rather than
 * a 60px control is the cheapest way to stop that. The button stays as the
 * affordance, because a box that copies silently reads as decoration.
 *
 * Renders nothing without a code. The claim works without one and always has.
 */
export default function ClaimCode({ code, label }: { code: string | null; label: string }) {
  const [copied, setCopied] = useState(false)
  if (!code) return null

  const copy = () => {
    navigator.clipboard?.writeText(code).then(
      () => setCopied(true),
      () => setCopied(false)
    )
  }

  return (
    /*
     * A div with a click handler rather than a <button> wrapping everything:
     * the inner button would then be nested inside it, which is invalid and
     * which browsers resolve in their own ways. The inner control carries the
     * accessible action; this is the convenience on top of it.
     */
    <div
      className={`${styles.box} ${copied ? styles.copied : ''}`}
      onClick={copy}
      role="presentation"
    >
      <span className="label">{label}</span>
      <div className={styles.row}>
        <code className={styles.code}>{code}</code>
        <button type="button" className={styles.copy} onClick={copy}>
          {copied ? veiled('Q29waWVk') : veiled('Q29weQ==')}
        </button>
      </div>
      <p className={styles.note}>
        {veiled(
          'U2VuZCB0aGlzIGNsYWltIGNvZGUgd2l0aCB5b3VyIG1lc3NhZ2UsIGhvd2V2ZXIgeW91IHJlYWNoIG91dCAtLSBJIGNhbm5vdCB2ZXJpZnkgYSB3aW4gd2l0aG91dCBpdC4='
        )}
      </p>
    </div>
  )
}
