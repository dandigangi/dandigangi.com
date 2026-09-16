'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import siteMetadata from '@/data/siteMetadata'
import { FINAL_TIER, OPENING, OVER_TIER } from '@/lib/pikachu'
import Confetti from './Confetti'
import { ArrowRight } from './Icons'
import styles from './PikachuModal.module.css'

/**
 * Brand marks are a coloured badge and a letterform rather than the real
 * logos — close enough to read at 20px, and nobody's trademark gets shipped.
 * The two instant rails share a row because the choice between them is not
 * the joke; the row below them is.
 */
const METHODS = [
  { name: 'Venmo / PayPal', note: 'Instant', retort: 'Rude, TBH', mark: '$', color: '#12A150' },
  {
    name: 'Bitcoin',
    note: 'Network fees apply',
    retort: 'You’re about to get phished',
    mark: '₿',
    color: '#F7931A',
  },
  {
    name: 'Check',
    note: '7–14 days',
    retort: 'Are you crazy? It’s not 1994.',
    mark: '✉',
    color: '#6B7280',
  },
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

/**
 * The figure lands at ROLL_MS and the heart clears at 900ms, so this leaves
 * roughly six tenths of a second holding still on the new, lower total before
 * he lets you go. Without that beat the close eats the very thing it is
 * rewarding you with.
 */
const HUG_EXIT_MS = 1500

/**
 * One hug settles an encounter and ends it. Reopening the invoice from a nav
 * link is not an encounter, so there is nothing to end — you can work him down
 * a few times instead, and he just stops obliging.
 */
const HUGS_PER_CATCH = 1
const HUGS_PER_RE_READ = 3
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

/** Appears twice below, so it lives here rather than in both. */
const FIGURE = 10

/**
 * Base64, and the names around it are deliberately bland.
 *
 * Not secrecy — this bundle ships to every visitor and `atob` is one DevTools
 * call away. The point is that skimming the repo, reading a diff, or grepping
 * the built JS shouldn't hand someone the surprise. Decode a line before
 * editing it; `{}` interpolates FIGURE.
 */
const TEXT = [
  'Q29uZ3JhdHVsYXRpb25z',
  'QSBnaWZ0IGZyb20gUGlrYWNodQ==',
  'WW914oCZcmUgZGVkaWNhdGlvbiBpcyBpbXByZXNzaXZlLg==',
  'SeKAmWQgbGlrZSB0byBzZW5kIHlvdSBhIHt9IGdpZnQgY2FyZCBvZiB5b3VyIGNob2ljZS4=',
  '4oCUIFlvdSBQaWNr',
  'U2VuZCBETQ==',
  'RW1haWw=',
  'RWFzdGVyIEVnZyBHaWZ0Y2FyZCE=',
].map((line) =>
  new TextDecoder().decode(Uint8Array.from(atob(line), (character) => character.charCodeAt(0)))
)

const [T_HEAD, T_LABEL, T_LINE_1, T_LINE_2, T_ASIDE, T_ACT_X, T_ACT_MAIL, T_SUBJECT] = TEXT

const AVATAR = '/static/images/pikachu-avatar.jpg'
const ANGRY_AVATAR = '/static/images/pikachu-avatar-angry.jpg'

/**
 * X's compose deep link only takes a numeric account id — a handle in
 * `recipient_id` does nothing.
 * https://developer.x.com/en/docs/x-for-websites/direct-message-button
 */
const X_RECIPIENT_ID = '192625645'
const X_DM_URL = `https://x.com/messages/compose?recipient_id=${X_RECIPIENT_ID}`

/** Pre-filled so one of these is recognisable in the inbox without opening it. */
const MAIL_URL = `mailto:${siteMetadata.email}?subject=${encodeURIComponent(T_SUBJECT)}`

export default function PikachuModal({
  amount,
  previous,
  invoices,
  won,
  viaCatch,
  onHug,
  onClose,
}: {
  amount: number
  previous: number | null
  invoices: number
  /** Sticky once earned, so a hug cannot take the last state back. */
  won: boolean
  /** False when reopened from a nav link rather than caught. */
  viaCatch: boolean
  onHug: () => void
  onClose: () => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  /** One per encounter — he is not running a discount scheme. */
  const [hugs, setHugs] = useState(0)
  /** Rails he has already been asked about. None of them settle anything — he
   *  answers in place of the delivery estimate and the invoice stays open. */
  const [poked, setPoked] = useState<string[]>([])
  const final = won || amount >= FINAL_TIER
  const hugLimit = viaCatch ? HUGS_PER_CATCH : HUGS_PER_RE_READ
  /** Out of hugs — one after catching him, three when only re-reading. */
  const spent = hugs >= hugLimit
  // Mutually exclusive: in the third state the anger is over, so the red
  // banner, the angry avatar and the angry confetti all stand down.
  const over = !final && amount >= OVER_TIER

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

  // A hug settles a real encounter, so he lets you go once the heart and the
  // roll have played out. A re-read has nothing to settle and stays open.
  useEffect(() => {
    if (!viaCatch || hugs === 0) return
    const timer = setTimeout(onClose, HUG_EXIT_MS)
    return () => clearTimeout(timer)
  }, [viaCatch, hugs, onClose])

  return (
    <div
      className={styles.overlay}
      // Only a click that starts and ends on the backdrop itself closes, so a
      // drag that ends outside the dialog does not dismiss it.
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <Confetti tone={final ? 'calm' : over ? 'angry' : 'default'} />

      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pikachu-modal-title"
      >
        <header
          className={`${styles.head} ${over ? styles.headOver : ''} ${final ? styles.headFinal : ''}`}
        >
          <span className={styles.headTitle} id="pikachu-modal-title">
            <span className={styles.headTitleStrong}>{final ? T_HEAD : 'Payment request'}</span>
            {/* The running tally is the joke of the shakedown; on the third
                banner it only contradicts the headline. */}
            {!final && invoices > 1 && (
              <span className={styles.headCount}> — {invoices} missed invoices</span>
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
              <span className="label">{final ? T_LABEL : 'Requested by Pikachu'}</span>
              {final ? (
                // No roll and no struck-through previous: this is not the
                // running tab, it is a flat figure that replaces it.
                <span className={styles.amount}>
                  {money(FIGURE, 0)}
                  <span className={styles.aside}>{T_ASIDE}</span>
                </span>
              ) : (
                <span className={`${styles.amount} ${previous !== null ? styles.amountPair : ''}`}>
                  {previous !== null && (
                    <span className={styles.previous}>{money(previous, previous % 1 ? 2 : 0)}</span>
                  )}
                  <RollingAmount from={previous ?? 0} to={amount} />
                </span>
              )}
            </div>
          </div>

          <p className={styles.quote}>
            {final ? (
              <>
                {T_LINE_1}
                <br />
                {T_LINE_2.replace('{}', money(FIGURE, 0))}
              </>
            ) : (
              <>
                Why are you clicking me like that?
                <br />
                You owe me {money(amount, amount % 1 ? 2 : 0)} and a hug.
              </>
            )}
          </p>

          {/* Nothing left to settle once he is the one paying. */}
          {!final && (
            <div className={styles.settle}>
              <span className="label">Settle up</span>
              <span className={styles.rule} />
            </div>
          )}
        </div>

        {!final && (
          <div className={styles.methods}>
            {METHODS.map((method) => (
              <button
                key={method.name}
                type="button"
                className={styles.method}
                onClick={() =>
                  setPoked((names) =>
                    names.includes(method.name) ? names : [...names, method.name]
                  )
                }
              >
                <span
                  className={styles.badge}
                  style={{ background: method.color }}
                  aria-hidden="true"
                >
                  {method.mark}
                </span>
                <span className={styles.methodName}>{method.name}</span>
                <span className={`meta ${styles.note}`}>
                  {poked.includes(method.name) ? method.retort : method.note}
                </span>
                <ArrowRight size={16} />
              </button>
            ))}
          </div>
        )}

        <footer className={styles.foot}>
          {/* The small print is part of the shakedown; the third state has no terms. */}
          {!final && <span className="label">Hug not transferable</span>}
          <div className={`${styles.declineWrap} ${final ? styles.soleAction : ''}`}>
            {/* His opinion of declining — there is nothing to decline any more. */}
            {!final && (
              <>
                <button
                  type="button"
                  className={`btn ${styles.hug}`}
                  // Nothing to negotiate at the opening ask — a hug there floors
                  // at the same figure and would animate nothing.
                  disabled={spent || amount <= OPENING}
                  onClick={() => {
                    setHugs((count) => count + 1)
                    onHug()
                  }}
                >
                  Hug
                  {hugs > 0 && (
                    // Keyed on the count so the animation replays rather than
                    // sitting spent at opacity 0 after the first one.
                    <span key={hugs} className={styles.heart} aria-hidden="true">
                      ❤️
                    </span>
                  )}
                </button>
              </>
            )}
            {final ? (
              <>
                <a
                  href={X_DM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn ${styles.claim}`}
                >
                  {T_ACT_X}
                </a>
                <a href={MAIL_URL} className={`btn ${styles.claim}`}>
                  {T_ACT_MAIL}
                </a>
              </>
            ) : (
              <button
                type="button"
                className={`btn ${styles.decline} ${over ? styles.declineOver : ''}`}
                // Refusing stays open until the hugs are gone: on a re-read that
                // is three of them, so one hug must not close the door.
                disabled={spent}
                onClick={onClose}
              >
                Decline
                <span className={styles.frown} aria-hidden="true">
                  &gt;:|
                </span>
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  )
}
