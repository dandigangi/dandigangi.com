'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Confetti from './Confetti'
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

/**
 * Decimal places come from the target, not the value being rendered: during the
 * count-up the intermediate numbers all have cents, and letting them decide
 * would add and drop a ".00" mid-roll.
 */
const money = (value: number, fractionDigits: number) =>
  `$${value.toLocaleString('en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`

const ROLL_MS = 620
const STEP_MS = 38

/** Eased ramp to `to`, sampled slowly enough that digits land instead of blur. */
function useCountUp(from: number, to: number) {
  const [value, setValue] = useState(from)

  useEffect(() => {
    if (from === to) return

    const started = performance.now()
    let last = 0
    let frame = 0

    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / ROLL_MS)
      if (t === 1) {
        setValue(to)
        return
      }
      if (now - last >= STEP_MS) {
        const eased = 1 - Math.pow(1 - t, 3)
        setValue(from + (to - from) * eased)
        last = now
      }
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [from, to])

  return value
}

/**
 * Each character is its own element keyed by its value, so React replaces the
 * node whenever a digit changes and the CSS roll plays again. That is what
 * makes the number look mechanical rather than merely re-rendered.
 */
function RollingAmount({ from, to }: { from: number; to: number }) {
  const fractionDigits = to % 1 ? 2 : 0
  const value = useCountUp(from, to)

  return (
    <span className={styles.roll}>
      {money(value, fractionDigits)
        .split('')
        .map((char, index) => (
          <span key={`${index}-${char}`} className={styles.digit}>
            {char}
          </span>
        ))}
    </span>
  )
}

/** The point at which he stops being polite about it. At $50-200 a click from
 *  a $100 opening ask, that lands around the fourth or fifth invoice. */
const OVER_THRESHOLD = 500

const AVATAR = '/static/images/pikachu-avatar.jpg'
const ANGRY_AVATAR = '/static/images/pikachu-avatar-angry.jpg'

export default function PikachuModal({
  amount,
  previous,
  invoices,
  onClose,
}: {
  amount: number
  previous: number | null
  invoices: number
  onClose: () => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const over = amount >= OVER_THRESHOLD

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
      <Confetti angry={over} />

      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pikachu-modal-title"
      >
        <header className={`${styles.head} ${over ? styles.headOver : ''}`}>
          <span className={styles.headTitle} id="pikachu-modal-title">
            <span className={styles.headTitleStrong}>Payment request</span>
            {over && invoices > 0 && (
              <span className={styles.headCount}>
                {' '}
                — {invoices} missed {invoices === 1 ? 'invoice' : 'invoices'}
              </span>
            )}
          </span>
          <button ref={closeRef} type="button" className={styles.close} onClick={onClose}>
            <span aria-hidden="true">×</span>
            <span className="srOnly">Close</span>
          </button>
        </header>

        <div className={styles.body}>
          <div className={styles.identity}>
            <Image
              src={over ? ANGRY_AVATAR : AVATAR}
              alt=""
              width={240}
              height={240}
              className={styles.avatar}
            />
            {/* Centred against the avatar rather than sitting on its top edge. */}
            <div className={styles.amountCol}>
              <span className="label">Requested by Pikachu</span>
              <span className={`${styles.amount} ${previous !== null ? styles.amountPair : ''}`}>
                {previous !== null && (
                  <span className={styles.previous}>{money(previous, previous % 1 ? 2 : 0)}</span>
                )}
                <RollingAmount from={previous ?? 0} to={amount} />
              </span>
            </div>
          </div>

          <p className={styles.quote}>
            Why are you clicking me like that?
            <br />
            You owe me {money(amount, amount % 1 ? 2 : 0)} and a hug.
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
            <button
              type="button"
              className={`btn ${styles.decline} ${over ? styles.declineOver : ''}`}
              onClick={onClose}
            >
              Decline
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}
