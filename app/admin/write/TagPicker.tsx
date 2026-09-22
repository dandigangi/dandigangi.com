'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './TagPicker.module.css'

/**
 * A tag is used verbatim as a URL segment — `/blog/tags/<tag>` — and every tag
 * on the site is already kebab-case. Normalising on the way in is what stops
 * "Job Search", "job search" and "job-search" becoming three tags that look
 * like one.
 */
export const normalizeTag = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export type TagOption = { tag: string; count: number }

/**
 * Tokenised multi-select over the tags already in use, with an explicit escape
 * hatch for a new one.
 *
 * The shape is deliberate. A plain <select multiple> cannot create a value and
 * is miserable to use past a handful of options; the free-text field this
 * replaces could create anything, including a fourth spelling of a tag that
 * already existed. So: existing tags are one keystroke and one click away and
 * carry their post counts, and inventing one is possible but has to be chosen —
 * the "Create" row never wins the Enter from an exact match.
 */
export default function TagPicker({
  value,
  options,
  onChange,
}: {
  value: string[]
  options: TagOption[]
  onChange: (tags: string[]) => void
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const wrap = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)

  const typed = normalizeTag(query)

  const matches = useMemo(() => {
    const chosen = new Set(value)
    return options
      .filter((option) => !chosen.has(option.tag))
      .filter((option) => (typed ? option.tag.includes(typed) : true))
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
  }, [options, value, typed])

  /** Offered only when it is genuinely new — not an existing tag, not already on. */
  const creatable =
    typed !== '' && !options.some((option) => option.tag === typed) && !value.includes(typed)
      ? typed
      : null

  // `null` stands for the Create row, so one index can walk the whole menu.
  const rows: (string | null)[] = [
    ...matches.map((match) => match.tag),
    ...(creatable ? [null] : []),
  ]

  // Close on a press anywhere else. Pointerdown rather than click: a click on an
  // option fires after blur, and this has to settle before that ordering matters.
  useEffect(() => {
    if (!open) return
    const away = (event: PointerEvent) => {
      if (!wrap.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', away)
    return () => document.removeEventListener('pointerdown', away)
  }, [open])

  const add = (tag: string) => {
    const clean = normalizeTag(tag)
    if (!clean || value.includes(clean)) return
    onChange([...value, clean])
    setQuery('')
    setActive(0)
    input.current?.focus()
  }

  const remove = (tag: string) => {
    onChange(value.filter((entry) => entry !== tag))
    input.current?.focus()
  }

  const commitActive = () => {
    if (rows.length === 0) return add(typed)
    const row = rows[Math.min(active, rows.length - 1)]
    add(row ?? typed)
  }

  const onPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Comma commits as well as Enter: the field this replaced was comma-separated,
    // and that habit should not silently cost a tag.
    if (event.key === 'Enter' || (event.key === ',' && typed !== '')) {
      event.preventDefault()
      commitActive()
      return
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      setOpen(true)
      const step = event.key === 'ArrowDown' ? 1 : -1
      setActive((current) => (rows.length === 0 ? 0 : (current + step + rows.length) % rows.length))
      return
    }

    if (event.key === 'Escape') {
      setOpen(false)
      return
    }

    // Backspace clears the last token only on an empty field, so it never eats a
    // character being corrected.
    if (event.key === 'Backspace' && query === '' && value.length > 0) {
      event.preventDefault()
      remove(value[value.length - 1])
    }
  }

  return (
    <div className={styles.wrap} ref={wrap}>
      {/* Not a <label>: the tokens are buttons, and a label wrapping them would
          make every remove click also focus the input and reopen the menu. */}
      <span className={styles.legend} id="tag-picker-label">
        Tags
        <em className={styles.hint}> — {value.length === 0 ? 'none yet' : `${value.length} on`}</em>
      </span>

      <div
        className={styles.field}
        onClick={(event) => {
          if (event.target === event.currentTarget) input.current?.focus()
        }}
      >
        {value.map((tag) => (
          <span key={tag} className={styles.token}>
            {tag}
            <button
              type="button"
              className={styles.remove}
              aria-label={`Remove ${tag}`}
              onClick={() => remove(tag)}
            >
              ×
            </button>
          </span>
        ))}

        <input
          ref={input}
          className={styles.input}
          value={query}
          role="combobox"
          aria-expanded={open}
          aria-controls="tag-picker-menu"
          aria-autocomplete="list"
          aria-labelledby="tag-picker-label"
          autoComplete="off"
          placeholder={value.length === 0 ? 'Pick or type a tag' : 'Add another'}
          onChange={(event) => {
            setQuery(event.target.value)
            // Reset here rather than in an effect on `query`: an effect that
            // only ever runs after this handler is a second render for nothing,
            // and the highlight visibly lands on the old row first.
            setActive(0)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onPress}
        />
      </div>

      {open && (
        <ul className={styles.menu} id="tag-picker-menu" role="listbox">
          {rows.length === 0 && (
            <li className={styles.empty}>
              {typed === '' ? 'Every tag is already on this post.' : 'Already on this post.'}
            </li>
          )}

          {matches.map((option, index) => (
            <li key={option.tag}>
              <button
                type="button"
                role="option"
                aria-selected={index === active}
                className={`${styles.option} ${index === active ? styles.active : ''}`}
                onMouseEnter={() => setActive(index)}
                onClick={() => add(option.tag)}
              >
                <span>{option.tag}</span>
                <span className={styles.count}>{option.count}</span>
              </button>
            </li>
          ))}

          {creatable && (
            <li>
              <button
                type="button"
                role="option"
                aria-selected={active === rows.length - 1}
                className={`${styles.option} ${styles.create} ${
                  active === rows.length - 1 ? styles.active : ''
                }`}
                onMouseEnter={() => setActive(rows.length - 1)}
                onClick={() => add(creatable)}
              >
                <span>
                  Create <strong>{creatable}</strong>
                </span>
                <span className={styles.count}>new</span>
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
