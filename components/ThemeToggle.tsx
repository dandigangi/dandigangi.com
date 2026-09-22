'use client'

import { SunIcon, MoonIcon } from './Icons'
import { toggleTheme } from '@/lib/theme'
import styles from './ThemeToggle.module.css'

/**
 * Both icons are always rendered and swapped by CSS on [data-theme]. That keeps
 * the button free of state, so it needs no effect and cannot disagree with the
 * theme ThemeScript resolved before paint.
 */
export default function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={toggleTheme}
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
