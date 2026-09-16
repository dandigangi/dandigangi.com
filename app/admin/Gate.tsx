'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from '../not-found.module.css'
import gate from './gate.module.css'

/**
 * The joke behind /admin in production, where the editor does not exist as a
 * route at all.
 *
 * The field is scenery. Nothing reads its value beyond checking that something
 * was typed, nothing submits it anywhere, nothing is stored or sent — the only
 * thing the button changes is the copy on this page. A password box that
 * actually captured what was typed into it would be a genuinely nasty thing to
 * leave on a public site, so this one is wired to nothing on purpose.
 */
const DECOY = 'ACDoBc7WianXYKeprF9YKPt6_HWig*wLQnWfP4iQgGphR2QnVqpAVAMydRVU.e9j'

export default function Gate() {
  const [tried, setTried] = useState(false)
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (tried) {
    return (
      <>
        {/* Sentence case in the source; the heading style uppercases it, the
            same as every other page's. */}
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

  return (
    <>
      <p className="label">Secure Area</p>
      <h1 className={styles.code}>Admin</h1>
      <p className={styles.body}>
        This is for Dan only. If you can guess the password, I&rsquo;ll let you in. It looks like
        this <code className={gate.decoy}>{DECOY}</code>
      </p>

      <form
        className={gate.form}
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          // The only thing ever read off the field, and it is not kept.
          if (value.trim() === '') {
            setError('Enter a password first.')
            return
          }
          setTried(true)
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
        <button type="submit" className="btn">
          Login
        </button>
      </form>
    </>
  )
}
