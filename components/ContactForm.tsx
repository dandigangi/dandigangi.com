'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './ContactForm.module.css'

type State = 'idle' | 'sending' | 'sent' | 'error'

/**
 * A short form for anyone who would rather not open their mail client.
 *
 * The addresses above it stay, and stay first — this is the convenience, not
 * the replacement. What is typed here goes to one webhook and is not stored
 * anywhere, which is also why there is no "we'll keep your details" line to
 * write: there are no details kept.
 */
export default function ContactForm() {
  const [state, setState] = useState<State>('idle')
  /**
   * When this form became interactive. The server rejects anything filled in
   * faster than a person can type — see MIN_FILL_MS in app/m/route.ts.
   *
   * Stamped in an effect rather than at render: Date.now() during render is
   * impure, which react-hooks/purity rightly objects to, and mount is the more
   * accurate moment anyway — nobody can type into this before it hydrates.
   */
  const opened = useRef(0)
  useEffect(() => {
    opened.current = Date.now()
  }, [])

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (state === 'sending') return
    setState('sending')

    const data = new FormData(event.currentTarget)
    try {
      const response = await fetch('/m', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          message: data.get('message'),
          website: data.get('website'),
          t: opened.current,
        }),
      })
      setState(response.ok ? 'sent' : 'error')
    } catch {
      setState('error')
    }
  }

  if (state === 'sent') {
    return (
      <p className={styles.sent} role="status">
        Thanks — that reached me. I&rsquo;ll reply from the address you gave.
      </p>
    )
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <span className="label">Or send it from here</span>

      <div className={styles.row}>
        <label className={styles.field}>
          <span className={styles.labelText}>Name</span>
          <input name="name" required maxLength={120} autoComplete="name" />
        </label>
        <label className={styles.field}>
          <span className={styles.labelText}>Email</span>
          <input name="email" type="email" required maxLength={200} autoComplete="email" />
        </label>
      </div>

      <label className={styles.field}>
        <span className={styles.labelText}>Message</span>
        <textarea name="message" required rows={5} maxLength={4000} />
      </label>

      {/* The honeypot. Hidden from sight and from screen readers, and skipped by
          the tab order — a person cannot reach it, so anything in it is a bot. */}
      <input
        name="website"
        className={styles.trap}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className={styles.actions}>
        <button type="submit" className="btn" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending…' : 'Send'}
        </button>
        {state === 'error' && (
          <span className={styles.error} role="alert">
            That didn&rsquo;t send. Email me directly and I&rsquo;ll get it.
          </span>
        )}
      </div>
    </form>
  )
}
