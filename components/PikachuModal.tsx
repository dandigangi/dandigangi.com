'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { ArrowRight } from './Icons'
import styles from './PikachuModal.module.css'

/**
 * Brand marks are a coloured badge and a letterform rather than the real
 * logos — close enough to read at 20px, and nobody's trademark gets shipped.
 */
const METHODS = [
  { name: 'Venmo', note: 'Instant', mark: 'V', color: '#008CFF' },
  { name: 'PayPal', note: '1–3 days', mark: 'P', color: '#0070BA' },
  { name: 'Bitcoin', note: 'Network fees apply', mark: '₿', color: '#F7931A' },
]

export default function PikachuModal({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [onClose])

  return (
    <div
      className={styles.overlay}
      // Only a click that starts and ends on the backdrop itself closes, so a
      // drag that ends outside the dialog does not dismiss it.
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pikachu-modal-title"
      >
        <header className={styles.head}>
          <span className="label" id="pikachu-modal-title">
            Payment request
          </span>
          <button ref={closeRef} type="button" className={styles.close} onClick={onClose}>
            <span aria-hidden="true">×</span>
            <span className="srOnly">Close</span>
          </button>
        </header>

        <div className={styles.body}>
          <div className={styles.identity}>
            <Image
              src="/static/images/pikachu-avatar.jpg"
              alt=""
              width={240}
              height={240}
              className={styles.avatar}
            />
            {/* Centred against the avatar rather than sitting on its top edge. */}
            <div className={styles.amountCol}>
              <span className="label">Requested by Pikachu</span>
              <span className={styles.amount}>$500</span>
            </div>
          </div>

          <p className={styles.quote}>
            Why are you clicking me like that?
            <br />
            You owe me $500 and a hug.
          </p>

          <div className={styles.settle}>
            <span className="label">Settle up</span>
            <span className={styles.rule} />
          </div>
        </div>

        <div className={styles.methods}>
          {METHODS.map((method) => (
            <button key={method.name} type="button" className={styles.method} onClick={onClose}>
              <span
                className={styles.badge}
                style={{ background: method.color }}
                aria-hidden="true"
              >
                {method.mark}
              </span>
              <span className={styles.methodName}>{method.name}</span>
              <span className={`meta ${styles.note}`}>{method.note}</span>
              <ArrowRight size={16} />
            </button>
          ))}
        </div>

        <footer className={styles.foot}>
          <span className="label">Hug not transferable</span>
          <div className={styles.declineWrap}>
            <span className={styles.frown} aria-hidden="true">
              &gt;:|
            </span>
            <button type="button" className="btn" onClick={onClose}>
              Decline
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}
