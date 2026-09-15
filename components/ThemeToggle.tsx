'use client'

import { SunIcon, MoonIcon } from './Icons'
import styles from './ThemeToggle.module.css'

/**
 * Both icons are always rendered and swapped by CSS on [data-theme]. That keeps
 * the button free of state, so it needs no effect and cannot disagree with the
 * theme ThemeScript resolved before paint.
 */
export default function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light'
    root.setAttribute('data-theme', next)
    try {
      localStorage.setItem('theme', next)
    } catch {
      // Private browsing or blocked storage — the toggle still works for this page view.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle colour theme"
      className={styles.button}
    >
      <span className={styles.dark}>
        <SunIcon size={16} />
      </span>
      <span className={styles.light}>
        <MoonIcon size={16} />
      </span>
    </button>
  )
}
