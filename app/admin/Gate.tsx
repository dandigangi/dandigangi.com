'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { veiled } from '@/lib/copy'
import { ROUNDS, hash } from '@/lib/hash'
import { useLabels } from '@/components/useLabels'
import styles from '../not-found.module.css'
import gate from './gate.module.css'

/**
 * The joke behind /admin in production, where the editor does not exist as a
 * route at all.
 *
 * The field is scenery. Its value is read once, only to check that something
 * was typed, and is never stored or sent anywhere — the button just runs a
 * theatrical loader and then changes the copy on this page. A password box that
 * actually captured what was typed into it would be a genuinely nasty thing to
 * leave on a public site, so this one is wired to nothing on purpose.
 */
const DECOY = 'ACDoBc7WianXYKeprF9YKPt6_HWig*69420fP4iQgGphR2QnVqpAVAMydRVU.e9j'

/** Generated on click rather than during render: a value that differs between
 *  the server and the client is a hydration mismatch. */
const fakeIp = () =>
  [
    Math.floor(Math.random() * 205) + 11,
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 254) + 1,
  ].join('.')

const IP_KEY = 'dd:gi'
const IP_SHAPE = /^\d{1,3}(\.\d{1,3}){3}$/

/**
 * The same box every time you try, because a server that moved between attempts
 * would give the game away.
 *
 * Read on click rather than during render, for the same reason the value is
 * generated there. The shape is checked on the way back out: nothing sensitive
 * lives here, but a value from storage is still someone else's input, and it
 * should not be able to put anything it likes on the page.
 */
const sessionIp = () => {
  try {
    const saved = localStorage.getItem(IP_KEY)
    if (saved && IP_SHAPE.test(saved)) return saved
  } catch {
    // Private mode or blocked storage — a fresh address is a fine fallback.
  }

  const fresh = fakeIp()
  try {
    localStorage.setItem(IP_KEY, fresh)
  } catch {
    // Same again; it just will not be remembered.
  }
  return fresh
}

/**
 * The only password the page reacts to at all, and it still does not let you in
 * — it just decorates the refusal. Compared case-insensitively; nothing is
 * stored or sent either way.
 */
/*
 * There is no expected digest here any more. It lives in app/admin/auth, where
 * the browser cannot read it — so the bundle no longer contains anything that
 * says what the answer is, and guessing is the only way in.
 *
 * This suffix is what keeps the gate separate from the blog search, which
 * compares the same word and must keep its digest in the bundle to do it. See
 * the note in app/admin/auth/route.ts.
 */
const GATE_SALT = ':a'

/** Long enough to be a plausible rule, and a nudge at the only answer that
 *  changes anything — which happens to be exactly this many letters. */
const MIN_LENGTH = 7

/**
 * Knocks on a door that always says no, so the attempt appears in the network
 * tab as a real one would.
 *
 * The body is fabricated on the spot and contains nothing that was typed: the
 * field's value does not leave the browser. Fire and forget — the answer is
 * always 401 and the page does not wait for it.
 */
const nonce = () => {
  // randomUUID needs a secure context, and it used to sit inside the same try
  // as the fetch — so anywhere it threw, the request was silently skipped.
  try {
    return crypto.randomUUID()
  } catch {
    return Math.random().toString(16).slice(2) + Date.now().toString(16)
  }
}

/** Both guarded: neither is worth an exception, and both are absent somewhere. */
const timezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC'
  } catch {
    return 'UTC'
  }
}

const viewport = () => {
  try {
    return `${window.innerWidth}x${window.innerHeight}`
  } catch {
    return '0x0'
  }
}

/**
 * Posts the attempt and reports whether it was the right one.
 *
 * The decision moved to the server — see app/admin/auth/route.ts. What goes up
 * is the digest, never the word, so nothing anyone types reaches request
 * handling or an access log; and what comes back is the same decoy either way,
 * so the answer is the cookie the server sets, not anything readable here.
 *
 * The padding around it is unchanged. It is there to make the attempt look like
 * a real one in the network tab.
 */
const knock = async (digest: string): Promise<void> => {
  // Wrapped as well as caught: a throw from fetch() itself — a blocked origin,
  // an extension tearing it out — must not stop the page doing its thing.
  try {
    await fetch('/admin/auth', {
      method: 'POST',
      cache: 'no-store',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-Client-Version': '2.0.0',
        'X-Request-Id': nonce(),
      },
      body: JSON.stringify({
        h: digest,
        grant_type: 'password',
        client_id: 'dandigangi-web',
        scope: 'admin:read admin:write',
        redirect_uri: '/admin',
        code_challenge_method: 'S256',
        nonce: nonce(),
        prompt: 'consent',
        client: {
          tz: timezone(),
          viewport: viewport(),
          locale: typeof navigator === 'undefined' ? 'en-US' : navigator.language,
        },
      }),
    }).catch(() => {
      // Offline, blocked, whatever. The theatre does not depend on it.
    })
  } catch {
    // Same.
  }
}

const CONNECT_MS = 1900
const VALIDATE_MS = 1800
/** Both lines sit green for a beat before the answer lands — the pause is what
 *  makes it read as "it worked" right up until it does not. */
const SETTLE_MS = 900

type Phase = 'idle' | 'connecting' | 'validating' | 'settled'

export default function Gate() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('idle')
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  /* Prefetched on mount so the message is instant when it is needed — it is an
     error under an input, not somewhere to show a spinner. */
  const hint = useLabels(['c3']).get('c3') ?? '.'
  const [ip, setIp] = useState('')
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  // Clearing only — nothing here sets state, so the loader cannot outlive the
  // component and warn about it.
  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  const attempt = () => {
    const entered = value.trim()

    if (entered === '') {
      setError('Enter a password first.')
      return
    }
    if (entered.length < MIN_LENGTH) {
      // The tail is fetched, not shipped: "possibly a Pokemon" turned a hashed
      // password into a one-guess problem for anything reading the bundle.
      setError(`${veiled('TWluaW11bSA=')}${MIN_LENGTH}${hint}`)
      return
    }

    /*
     * Fired and not awaited, deliberately. The theatre below runs on its own
     * timers whatever the network does, and the answer is not in the response —
     * it is the httpOnly cookie the server sets, which this page cannot read
     * and therefore cannot leak. The lulz page is where it gets checked.
     */
    void knock(hash(`${entered.toLowerCase()}${GATE_SALT}`, ROUNDS))
    start()
  }

  const start = () => {
    setIp(sessionIp())
    setPhase('connecting')
    timers.current.push(
      setTimeout(() => setPhase('validating'), CONNECT_MS),
      setTimeout(() => setPhase('settled'), CONNECT_MS + VALIDATE_MS),
      // One destination. It used to carry ?g=1 on a correct guess, which meant
      // the reward was claimable by typing the URL.
      setTimeout(() => router.push('/admin/lulz'), CONNECT_MS + VALIDATE_MS + SETTLE_MS)
    )
  }

  return (
    <>
      <p className="label">Secure Area</p>
      <h1 className={styles.code}>Admin</h1>
      <p className={styles.body}>
        This is for Dan only. If you can guess the password, I&rsquo;ll let you in. It looks like
        this <code className={gate.decoy}>{DECOY}</code>.
      </p>

      {/*
       * Deliberately not a <form>. Password managers offer "Save login?" off
       * the submit event, and there is no login here worth saving — so the
       * field keeps type="password" and the submit goes away instead. Enter is
       * wired up by hand below, which is all the form was doing for us.
       */}
      <div className={gate.form}>
        <input
          type="password"
          className={`${gate.input} ${error ? gate.invalid : ''}`}
          placeholder="Password"
          aria-label="Password"
          aria-invalid={error !== null}
          aria-describedby={error ? 'gate-error' : undefined}
          autoComplete="off"
          spellCheck={false}
          // Every manager opted out differently; none of them agreed on one
          // attribute, so this is the full set rather than a favourite.
          data-1p-ignore
          data-lpignore="true"
          data-bwignore
          data-form-type="other"
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
            if (error) setError(null)
          }}
          onKeyDown={(event) => {
            if (event.key !== 'Enter') return
            event.preventDefault()
            attempt()
          }}
        />
        <button type="button" className="btn" disabled={phase !== 'idle'} onClick={attempt}>
          Login
        </button>
      </div>

      {/* Below the row rather than inside it: in the row, a message that wrapped
          to two lines grew the row and stretched the Login button to match. */}
      {error && (
        <span id="gate-error" className={gate.error}>
          {error}
        </span>
      )}

      {phase !== 'idle' && <Loader ip={ip} phase={phase} />}
    </>
  )
}

function Loader({ ip, phase }: { ip: string; phase: Phase }) {
  const connected = phase !== 'connecting'
  const validated = phase === 'settled'

  return (
    <div className={gate.overlay} role="status" aria-live="polite">
      <div className={gate.dialog}>
        <p className={gate.line}>
          <span className={gate.mark}>{connected ? 'ok' : <Dots />}</span>
          Establishing SSH connection to {ip}
        </p>
        <p className={`${gate.line} ${connected ? '' : gate.pending}`}>
          <span className={gate.mark}>{validated ? 'ok' : connected ? <Dots /> : ''}</span>
          Validating credentials
        </p>
      </div>
    </div>
  )
}

function Dots() {
  return (
    <span className={gate.dots} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  )
}
