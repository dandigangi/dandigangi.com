'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
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
const DECOY = 'ACDoBc7WianXYKeprF9YKPt6_HWig*wLQnWfP4iQgGphR2QnVqpAVAMydRVU.e9j'

/** Generated on click rather than during render: a value that differs between
 *  the server and the client is a hydration mismatch. */
const fakeIp = () =>
  [
    Math.floor(Math.random() * 205) + 11,
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 254) + 1,
  ].join('.')

const CONNECT_MS = 1400
const VALIDATE_MS = 1300

type Phase = 'idle' | 'connecting' | 'validating' | 'done'

export default function Gate() {
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

  if (phase === 'done') {
    return (
      <>
        <p className="label">You serious?</p>
        <h1 className={styles.code}>Lulz no</h1>
        <p className={styles.body}>
          I&rsquo;ve done enough security work to not put this up in production. This is all fake.
          Rekt.
        </p>
        <div className={styles.actions}>
          <Link href="/" className="btn">
            Home
          </Link>
          <Link href="/blog" className="btn">
            Read the blog
          </Link>
        </div>
      </>
    )
  }

  const start = () => {
    setIp(fakeIp())
    setPhase('connecting')
    timers.current.push(
      setTimeout(() => setPhase('validating'), CONNECT_MS),
      setTimeout(() => setPhase('done'), CONNECT_MS + VALIDATE_MS)
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

      <form
        className={gate.form}
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          if (value.trim() === '') {
            setError('Enter a password first.')
            return
          }
          start()
        }}
      >
        <div className={gate.entry}>
          <input
            type="password"
            className={`${gate.input} ${error ? gate.invalid : ''}`}
            placeholder="Password"
            aria-label="Password"
            aria-invalid={error !== null}
            aria-describedby={error ? 'gate-error' : undefined}
            autoComplete="off"
            spellCheck={false}
            value={value}
            onChange={(event) => {
              setValue(event.target.value)
              if (error) setError(null)
            }}
          />
          {error && (
            <span id="gate-error" className={gate.error}>
              {error}
            </span>
          )}
        </div>
        <button type="submit" className="btn" disabled={phase !== 'idle'}>
          Login
        </button>
      </form>

      {phase !== 'idle' && <Loader ip={ip} validating={phase === 'validating'} />}
    </>
  )
}

function Loader({ ip, validating }: { ip: string; validating: boolean }) {
  return (
    <div className={gate.overlay} role="status" aria-live="polite">
      <div className={gate.dialog}>
        <p className={gate.line}>
          <span className={gate.mark}>{validating ? 'ok' : <Dots />}</span>
          Establishing SSH connection to {ip}
        </p>
        <p className={`${gate.line} ${validating ? '' : gate.pending}`}>
          <span className={gate.mark}>{validating ? <Dots /> : ''}</span>
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
