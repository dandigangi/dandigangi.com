'use client'

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { veiled } from '@/lib/copy'
import { EXTRA, allTokens, tokenList, clearTokens, subscribe } from '@/lib/ledger'
import { useLabels } from './useLabels'
import { useTokenCount, useTokenTotal } from './useLedger'
import { usePrizeLabel } from './useClaimCode'
import { isTrail, setTrail, subscribe as rainbowSubscribe } from '@/lib/trail'
import Link from 'next/link'
import { OFFER_FIGURE, resetAll } from '@/lib/caller'
import styles from './Ledger.module.css'

/**
 * Opens the list from anywhere. A window event rather than shared state for the
 * same reason the Pikachu store uses one: the two things that open it — the
 * footer link and the count inside a toast — have no common client ancestor.
 */
export const LEDGER_OPEN = 'dd:lo'

/* Split out because they are read in two places each, and a base64 blob inline
   in a ternary is unreadable even by the standards of this file. */
/* Not in the bundle — these two name the secret outright. See app/l/route.ts. */
const ON_ROAD = 'c1'
const OFF_ROAD = 'c2'
const OFF_MODE = 'c4'

export const openLedger = () => window.dispatchEvent(new CustomEvent(LEDGER_OPEN))

/** "22 Sep, 03:24". Short enough to sit on one line beside the name. */
const when = (at: number) =>
  at === 0
    ? ''
    : new Date(at).toLocaleString(undefined, {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })

/**
 * What has been found, and how much is left. Mounted once in the layout and
 * summoned by event, so it survives a client-side navigation the way the cameo
 * does.
 *
 * Only found eggs are named. The rest are deliberately identical blanks — a
 * list of ten specific things you have not done yet is a walkthrough, and the
 * whole point is that you go and look.
 */
export default function Ledger() {
  const [open, setOpen] = useState(false)
  const found = useTokenCount()
  const total = useTokenTotal()
  const complete = useSyncExternalStore(subscribe, allTokens, () => false)
  const rainbow = useSyncExternalStore(rainbowSubscribe, isTrail, () => false)
  const prizeLabel = usePrizeLabel()

  /**
   * Two-step, not a second modal: the first press turns this control into its
   * own confirmation and the second carries it out. A dialog on top of a dialog
   * to ask about a dialog is worse than the mistake it prevents, and the
   * question belongs where the answer is.
   *
   * It stays armed for as long as the dialog is open — long enough to read what
   * it is about to do and decide — and disarms on close, so coming back later
   * always starts from the safe state rather than one press from losing
   * everything.
   */
  const [arming, setArming] = useState(false)

  const close = useCallback(() => {
    setOpen(false)
    setArming(false)
  }, [])

  useEffect(() => {
    const show = () => setOpen(true)
    window.addEventListener(LEDGER_OPEN, show)
    return () => window.removeEventListener(LEDGER_OPEN, show)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, close])

  /*
   * Above the early return, because hooks have to be. Asked for only while the
   * dialog is open, so a visitor who never opens it never makes the request —
   * and the cache means reopening it makes none either.
   */
  const unlocked = open ? tokenList() : []
  // Names are fetched, not shipped — see app/l/route.ts. Until they land the
  // row is still a row: its mark, and when it was found.
  const names = useLabels([
    ...unlocked.map((entry) => entry.egg),
    // Only once the secret is out; asking for them sooner would be the tell.
    ...(unlocked.some((entry) => entry.egg === EXTRA) ? [ON_ROAD, OFF_ROAD, OFF_MODE] : []),
  ])

  if (!open) return null

  const remaining = total - unlocked.length

  return (
    <div
      className={styles.overlay}
      onClick={(event) => event.target === event.currentTarget && close()}
    >
      <div
        className={`halo ${styles.dialog}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lg-t"
      >
        <header className={styles.head}>
          <div>
            <h2 className={styles.title} id="lg-t">
              {veiled('RWFzdGVyIEVnZ3M=')}
            </h2>
            <p className={styles.score}>
              {found} of {total} found
            </p>
            <p className={styles.stakes}>
              {veiled('SWYgeW91IGZpbmQgYWxs')} {total}, {veiled('eW91IHdpbGwgd2luIGE=')} $
              {OFFER_FIGURE} {veiled('Z2lmdCBjYXJkLg==')}
            </p>
          </div>
          <button type="button" className={styles.x} onClick={close}>
            <span aria-hidden="true">×</span>
            <span className="srOnly">Close</span>
          </button>
        </header>

        <ol className={styles.list}>
          {unlocked.map(({ egg, at }) => (
            <li key={egg} className={styles.row}>
              {/* The secret wears its own mark — it is not one of the nine, and
                  once it has been found that mark is also the switch. */}
              {egg === EXTRA ? (
                <button
                  type="button"
                  className={`${styles.mark} ${styles.markButton}`}
                  onClick={() => setTrail(!rainbow)}
                  title={names.get(rainbow ? OFF_ROAD : ON_ROAD) ?? ''}
                >
                  <span aria-hidden="true">🌈</span>
                  <span className="srOnly">{names.get(rainbow ? OFF_ROAD : ON_ROAD) ?? ''}</span>
                </button>
              ) : (
                <span className={styles.mark} aria-hidden="true">
                  🐣
                </span>
              )}
              {/* data-shine, not the class name: the rule in css/trail.css that
                  flattens this dialog's text has to exempt it, and a global
                  stylesheet can only match a hashed module class by substring —
                  which breaks the moment the file is renamed. */}
              <span
                className={`${styles.name} ${egg === EXTRA ? styles.shine : ''}`}
                data-shine={egg === EXTRA ? '' : undefined}
              >
                {names.get(egg) ?? ''}
              </span>
              <span className={styles.at}>{when(at)}</span>
            </li>
          ))}

          {/* Identical blanks, not a list of what is missing. */}
          {Array.from({ length: remaining }, (_, at) => (
            <li key={`left-${at}`} className={`${styles.row} ${styles.locked}`}>
              <span className={styles.mark} aria-hidden="true">
                🥚
              </span>
              <span className={styles.name}>{veiled('S2VlcCBsb29raW5n')}!</span>
            </li>
          ))}
        </ol>

        {complete && (
          /* A way back to the prize once the modal has been dismissed — the
             tally stays complete, so without this there would be none. */
          /* To the contact page rather than back into the invoice: that is
             where the code and the form to send it with now live, and a prize
             that reopens the thing you just closed is a loop, not a way out. */
          <Link href="/contact" className={`btn btnPrize btnTone ${styles.claim}`} onClick={close}>
            {prizeLabel}
          </Link>
        )}

        <button type="button" className={`btn ${styles.close}`} onClick={close}>
          Close
        </button>

        <div className={styles.tools}>
          <button
            type="button"
            className={`${styles.reset} ${arming ? styles.arming : ''}`}
            onClick={() => {
              if (!arming) {
                setArming(true)
                return
              }
              clearTokens()
              setTrail(false)
              // The tally is not the whole game: the tab, the catch, and the
              // hero swap all live in the Pikachu store, and clearing only the
              // eggs left a Pay Pikachu link in the footer of a site that had
              // supposedly never met him.
              resetAll()
              setArming(false)
              close()
            }}
          >
            {veiled(arming ? 'UHJlc3MgYWdhaW4gdG8gY2xlYXIgYWxsIG9mIHRoZW0=' : 'UmVzZXQgZWdncw==')}
          </button>

          {/* No confirmation on this one, deliberately: it is one keystroke to
              undo, and the two controls should not feel equally heavy. */}
          {rainbow && (
            <>
              <span className={styles.dash} aria-hidden="true">
                —
              </span>
              <button type="button" className={styles.reset} onClick={() => setTrail(false)}>
                {names.get(OFF_MODE) ?? ''}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/** The footer's way in. Absent until there is something to show. */
export function LedgerLink({ className }: { className?: string }) {
  const found = useTokenCount()
  const total = useTokenTotal()
  const complete = useSyncExternalStore(subscribe, allTokens, () => false)
  if (found === 0) return null

  return (
    <button type="button" className={className} onClick={openLedger}>
      {/* The egg hatches once the set is complete, and the label goes with it. */}
      <span aria-hidden="true">{complete ? '🐣' : '🥚'}</span>{' '}
      {/* Always the gradient, whether or not the mode is on and whether or not
          the set is complete. It is the one thing in the footer worth a look. */}
      <span className={styles.linkDone}>
        {veiled('RUFTVEVSIEVHR1M=')} {found}/{total}
      </span>
    </button>
  )
}
