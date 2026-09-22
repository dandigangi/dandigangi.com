'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { grantPikaPass } from '@/lib/pass'
import { veiled } from '@/lib/copy'
import { hash } from '@/lib/hash'
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

const IP_KEY = 'dd:gate-ip'
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
/* The other instruction on the site, and hashed for the same reason as the
   search trigger — see components/PostSearch.tsx. This is not authentication:
   the real check is the POST below, and this only decides whether the joke
   fires. */
const MAGIC_HASH = 448630920

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

const knock = () => {
  // Wrapped as well as caught: a throw from fetch() itself — a blocked origin,
  // an extension tearing it out — must not stop the page doing its thing.
  try {
    void fetch('/admin/auth', {
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
      // Split around the figure so it cannot drift from MIN_LENGTH.
      setError(
        `${veiled('TWluaW11bSA=')}${MIN_LENGTH}${veiled('IGNoYXJhY3RlcnMgYW5kIHBvc3NpYmx5IGEgUG9rZW1vbi4=')}`
      )
      return
    }

    knock()
    start(hash(entered.toLowerCase()) === MAGIC_HASH)
  }

  const start = (magic: boolean) => {
    // Before the push, so the request that renders the lulz page already
    // carries it and the server can put him up on the first paint.
    if (magic) grantPikaPass()
    setIp(sessionIp())
    setPhase('connecting')
    timers.current.push(
      setTimeout(() => setPhase('validating'), CONNECT_MS),
      setTimeout(() => setPhase('settled'), CONNECT_MS + VALIDATE_MS),
      setTimeout(
        () => router.push(magic ? '/admin/lulz?pika=1' : '/admin/lulz'),
        CONNECT_MS + VALIDATE_MS + SETTLE_MS
      )
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
